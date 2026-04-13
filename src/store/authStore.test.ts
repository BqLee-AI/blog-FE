import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/store/authStore';

vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  sendVerificationCode: vi.fn(),
}));

import { login as apiLogin } from '@/api/auth';

const mockedLogin = apiLogin as unknown as {
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