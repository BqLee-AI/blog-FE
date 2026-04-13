import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient';
import { login, refreshToken, register, sendVerificationCode } from './auth';

vi.mock('./apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(apiClient.post);

beforeEach(() => {
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
});