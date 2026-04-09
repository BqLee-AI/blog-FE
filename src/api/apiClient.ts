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

    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          if (!isAuthEndpoint(requestUrl)) {
            localStorage.removeItem('accessToken');
            window.location.href = buildHomeRedirectUrl();
          }
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${status}`);
      }
    } else if (error.request) {
      console.error('网络错误或服务器无响应');
    } else {
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;