import { afterEach, describe, expect, it } from 'vitest';
import {
  isTokenExemptAuthEndpoint,
  normalizeErrorMessage,
  resetUnauthorizedRedirectState,
  shouldHandleUnauthorizedResponse,
} from '@/api/apiClient';

afterEach(() => {
  resetUnauthorizedRedirectState();
});

describe('isTokenExemptAuthEndpoint', () => {
  it('accepts only whitelisted auth endpoints', () => {
    expect(isTokenExemptAuthEndpoint('/auth/login')).toBe(true);
    expect(isTokenExemptAuthEndpoint('/auth/login?next=/dashboard')).toBe(true);
    expect(isTokenExemptAuthEndpoint('/auth/login/')).toBe(true);
    expect(isTokenExemptAuthEndpoint('/auth/register')).toBe(true);
    expect(isTokenExemptAuthEndpoint('/auth/refresh')).toBe(true);
    expect(isTokenExemptAuthEndpoint('/auth/sendcode')).toBe(true);
  });

  it('rejects malformed and non-whitelisted urls', () => {
    expect(isTokenExemptAuthEndpoint('/auth/login-extra')).toBe(false);
    expect(isTokenExemptAuthEndpoint('/x00//evil.com')).toBe(false);
    expect(isTokenExemptAuthEndpoint('//evil.com/auth/login')).toBe(false);
    expect(isTokenExemptAuthEndpoint('https://evil.com/auth/login')).toBe(false);
    expect(isTokenExemptAuthEndpoint('/auth/unknown')).toBe(false);
  });
});

describe('shouldHandleUnauthorizedResponse', () => {
  it('allows the first non-auth 401 response and blocks subsequent ones', () => {
    expect(shouldHandleUnauthorizedResponse('/articles/1')).toBe(true);
    expect(shouldHandleUnauthorizedResponse('/articles/2')).toBe(false);
  });

  it('never handles 401 responses for auth endpoints', () => {
    expect(shouldHandleUnauthorizedResponse('/auth/login')).toBe(false);
    expect(shouldHandleUnauthorizedResponse('/auth/refresh')).toBe(false);
  });
});

describe('normalizeErrorMessage', () => {
  it('uses backend message for business errors', () => {
    expect(
      normalizeErrorMessage({
        message: 'Request failed',
        response: {
          data: {
            message: '邮箱已被注册',
          },
          status: 409,
        },
      } as never)
    ).toBe('邮箱已被注册');
  });

  it('falls back to the 401 default message when backend is silent', () => {
    expect(
      normalizeErrorMessage({
        message: 'Request failed',
        response: {
          data: {},
          status: 401,
        },
      } as never)
    ).toBe('未授权，请先登录');
  });
});