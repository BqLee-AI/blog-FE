import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const isTokenExemptAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.replace(/[?#].*$/, '');
  return /\/auth\/(login|register|refresh|sendcode)(?:\/|$)/.test(normalizedUrl);
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.replace(/[?#].*$/, '');
  return normalizedUrl.startsWith('/auth/');
};

const normalizeErrorMessage = (error: AxiosError): string => {
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
          if (!isAuthEndpoint(requestUrl)) {
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