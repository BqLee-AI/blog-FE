import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient';
import { login, refreshToken, register, sendVerificationCode } from './auth';

vi.mock('./apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = apiClient.post as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

let localStorageMock: {
  clear: () => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: ReturnType<typeof vi.fn>;
};

function installLocalStorageMock() {
  const storage = new Map<string, string>();

  localStorageMock = {
    clear() {
      storage.clear();
      localStorageMock.setItem.mockClear();
    },
    getItem(key: string) {
      return storage.has(key) ? storage.get(key)! : null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  });
}

beforeEach(() => {
  installLocalStorageMock();
  localStorage.clear();
  mockedPost.mockReset();
});

describe('auth api adapter', () => {
  it('maps login response from backend envelope', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Login successful',
        data: {
          user: {
            user_id: 7,
            username: 'Alice',
            email: 'alice@example.com',
            role_id: 1,
          },
          tokens: {
            access_token: 'access-token-1',
            refresh_token: 'refresh-token-1',
          },
        },
      },
    });

    await expect(
      login({ email: 'alice@example.com', password: 'secret123' })
    ).resolves.toEqual({
      user: {
        id: 7,
        username: 'Alice',
        email: 'alice@example.com',
        avatar: undefined,
        role: 'admin',
      },
      accessToken: 'access-token-1',
      refreshToken: 'refresh-token-1',
    });

    expect(localStorage.getItem('accessToken')).toBe('access-token-1');
  });

  it('rejects login responses without an access token and does not persist storage', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Login successful',
        data: {
          user: {
            user_id: 7,
            username: 'Alice',
            email: 'alice@example.com',
            role_id: 1,
          },
          tokens: {
            refresh_token: 'refresh-token-1',
          },
        },
      },
    });

    await expect(
      login({ email: 'alice@example.com', password: 'secret123' })
    ).rejects.toThrow('登录响应缺少访问令牌');

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('builds register user from minimal response payload', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Registration successful',
        data: {
          user_id: 9,
        },
      },
    });

    await expect(
      register({
        username: 'Bob',
        email: 'bob@example.com',
        password: 'secret123',
        confirmPassword: 'secret123',
        code: '123456',
      })
    ).resolves.toEqual({
      id: 9,
      username: 'Bob',
      email: 'bob@example.com',
      avatar: undefined,
      role: 'user',
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('persists the access token when register response includes nested tokens', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Registration successful',
        data: {
          user: {
            user_id: 9,
            username: 'Bob',
            email: 'bob@example.com',
            role_id: 0,
          },
          tokens: {
            access_token: 'register-access-token',
            refresh_token: 'register-refresh-token',
          },
        },
      },
    });

    await expect(
      register({
        username: 'Bob',
        email: 'bob@example.com',
        password: 'secret123',
        confirmPassword: 'secret123',
        code: '123456',
      })
    ).resolves.toEqual({
      id: 9,
      username: 'Bob',
      email: 'bob@example.com',
      avatar: undefined,
      role: 'user',
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'register-access-token');
    expect(localStorage.getItem('accessToken')).toBe('register-access-token');
  });

  it('unwraps verification code response messages', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Verification code sent successfully',
        data: {
          message: 'Verification code sent successfully',
        },
      },
    });

    await expect(sendVerificationCode('alice@example.com')).resolves.toEqual({
      message: 'Verification code sent successfully',
    });
  });

  it('rejects invalid verification code responses without a string message', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Verification code sent successfully',
        data: {
          message: null,
        },
      },
    });

    await expect(sendVerificationCode('alice@example.com')).rejects.toThrow('发送验证码响应格式无效');
  });

  it('extracts refreshed access token from nested tokens', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
          },
        },
      },
    });

    await expect(refreshToken()).resolves.toBe('new-access-token');
    expect(localStorage.getItem('accessToken')).toBe('new-access-token');
  });

  it('rejects refresh responses without an access token and leaves storage unchanged', async () => {
    localStorage.setItem('accessToken', 'existing-token');
    mockedPost.mockResolvedValueOnce({
      data: {
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            refresh_token: 'new-refresh-token',
          },
        },
      },
    });

    await expect(refreshToken()).rejects.toThrow('刷新令牌响应缺少访问令牌');
    expect(localStorage.getItem('accessToken')).toBe('existing-token');
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith('accessToken', 'new-access-token');
  });
});