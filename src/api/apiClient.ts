import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const DEFAULT_API_BASE_URL = '/api/v1';

const resolveApiBaseUrl = (value?: string): string => {
  return value?.trim() || DEFAULT_API_BASE_URL;
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

const getCurrentRedirectTarget = (): string => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const buildHomeRedirectUrl = (): string => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `/?redirect=${encodeURIComponent(getCurrentRedirectTarget())}`;
};

const TOKEN_EXEMPT_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/sendcode'] as const;

const isSafeAuthPath = (pathname: string): boolean => {
  return TOKEN_EXEMPT_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export const isTokenExemptAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  try {
    const baseOrigin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
    const parsedUrl = new URL(url, baseOrigin);

    if (parsedUrl.origin !== baseOrigin) {
      return false;
    }

    return isSafeAuthPath(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.replace(/[?#].*$/, '');
  return normalizedUrl.startsWith('/auth/');
};

export const shouldHandleUnauthorizedResponse = (requestUrl?: string): boolean => {
  if (isRedirecting || isAuthEndpoint(requestUrl)) {
    return false;
  }

  isRedirecting = true;
  return true;
};

export const resetUnauthorizedRedirectState = (): void => {
  isRedirecting = false;
};

export const normalizeErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as
    | { message?: string; msg?: string }
    | string
    | undefined;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object') {
    const message = responseData.message?.trim() || responseData.msg?.trim();
    if (message) {
      return message;
    }
  }

  if (error.code === 'ECONNABORTED') {
    return '请求超时，请重试';
  }

  if (error.message === 'Network Error') {
    return '网络连接失败，请检查网络';
  }

  if (error.response?.status === 401) {
    return '未授权，请先登录';
  }

  if (error.response?.status === 403) {
    return '没有权限访问该资源';
  }

  if (error.response?.status === 404) {
    return '请求的资源不存在';
  }

  if (error.response?.status === 500) {
    return '服务器内部错误';
  }

  return error.message || '请求失败';
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isTokenExemptAuthEndpoint(config.url)) {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const requestUrl = error.config?.url;
    const message = normalizeErrorMessage(error);

    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          if (shouldHandleUnauthorizedResponse(requestUrl)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('blog-auth-user');
            window.location.href = buildHomeRedirectUrl();
          }
          console.error(message);
          break;
        default:
          console.error(message);
      }
    } else if (error.request) {
      console.error(message);
    } else {
      console.error(message);
    }

    error.message = message;
    return Promise.reject(error);
  }
);

export default apiClient;