import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/store/authStore';

vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  sendVerificationCode: vi.fn(),
}));

import { login as apiLogin, logout as apiLogout, register as apiRegister } from '@/api/auth';

const mockedLogin = apiLogin as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

const mockedRegister = apiRegister as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

const mockedLogout = apiLogout as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

function installLocalStorageMock() {
  const storage = new Map<string, string>();

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      clear() {
        storage.clear();
      },
      getItem(key: string) {
        return storage.has(key) ? storage.get(key)! : null;
      },
      removeItem(key: string) {
        storage.delete(key);
      },
      setItem(key: string, value: string) {
        storage.set(key, value);
      },
    },
  });
}

beforeEach(() => {
  installLocalStorageMock();
  localStorage.clear();
  mockedLogin.mockReset();
  mockedRegister.mockReset();
  mockedLogout.mockReset();
  useAuthStore.setState({
    user: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
    hasHydrated: false,
    isSendingCode: false,
    countdown: 0,
    timerId: null,
  });
});

describe('useAuthStore login flow', () => {
  it('stores the mapped user and token after login', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: {
        id: 3,
        username: 'Carol',
        email: 'carol@example.com',
        role: 'admin',
      },
      accessToken: 'token-abc',
      refreshToken: 'refresh-abc',
    });

    await useAuthStore.getState().login({
      email: 'carol@example.com',
      password: 'secret123',
    });

    const state = useAuthStore.getState();

    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      id: 3,
      username: 'Carol',
      email: 'carol@example.com',
      role: 'admin',
    });
    expect(localStorage.getItem('blog-auth-user')).toBe(JSON.stringify({
      id: 3,
      username: 'Carol',
      email: 'carol@example.com',
      role: 'admin',
    }));
    expect(localStorage.getItem('accessToken')).toBe('token-abc');
  });
});

describe('useAuthStore register flow', () => {
  it('stores the mapped user after register', async () => {
    mockedRegister.mockResolvedValueOnce({
      id: 8,
      username: 'Dora',
      email: 'dora@example.com',
      role: 'user',
    });

    await useAuthStore.getState().register({
      username: 'Dora',
      email: 'dora@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
      code: '123456',
    });

    const state = useAuthStore.getState();

    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      id: 8,
      username: 'Dora',
      email: 'dora@example.com',
      role: 'user',
    });
    expect(localStorage.getItem('blog-auth-user')).toBe(JSON.stringify({
      id: 8,
      username: 'Dora',
      email: 'dora@example.com',
      role: 'user',
    }));
  });
});

describe('useAuthStore logout flow', () => {
  it('clears auth state and storage after logout', async () => {
    localStorage.setItem('blog-auth-user', JSON.stringify({
      id: 9,
      username: 'Eve',
      email: 'eve@example.com',
      role: 'user',
    }));
    localStorage.setItem('accessToken', 'token-logout');

    useAuthStore.setState({
      user: {
        id: 9,
        username: 'Eve',
        email: 'eve@example.com',
        role: 'user',
      },
      isLoggedIn: true,
      isLoading: false,
      error: null,
      hasHydrated: true,
    });

    mockedLogout.mockResolvedValueOnce(undefined);

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(localStorage.getItem('blog-auth-user')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});