import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiErrorResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || '/';
const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_STORAGE_KEY = 'blog-auth-user';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthEndpoint = (url?: string) => {
  if (!url) {
    return false;
  }

  return /\/auth\/(login|register|logout|refresh)(?:\/|$)/.test(url);
};

const getCurrentRedirectTarget = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const buildLoginRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return LOGIN_PATH;
  }

  const loginUrl = new URL(LOGIN_PATH, window.location.origin);
  loginUrl.searchParams.set('redirect', getCurrentRedirectTarget());

  return `${loginUrl.pathname}${loginUrl.search}${loginUrl.hash}`;
};

const clearAuthState = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const normalizeErrorMessage = (error: AxiosError) => {
  const responseMessage =
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
      ? (error.response.data as ApiErrorResponse).message
      : undefined;

  if (responseMessage) {
    return responseMessage;
  }

  if (error.response) {
    const { status } = error.response;

    switch (status) {
      case 400:
        return '请求参数有误';
      case 401:
        return '登录状态已失效，请重新登录';
      case 403:
        return '没有权限执行该操作';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误';
      default:
        return `请求失败 (${status})`;
    }
  }

  if (error.request) {
    return '网络错误，请检查网络连接';
  }

  return error.message || '请求配置错误';
};

// 请求拦截器 - 自动注入Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && !isAuthEndpoint(requestUrl)) {
      clearAuthState();

      if (typeof window !== 'undefined') {
        window.location.assign(buildLoginRedirectUrl());
      }
    }

    const message = normalizeErrorMessage(error);
    console.error(message);

    return Promise.reject(new Error(message));
  }
);

type ApiMethodConfig = AxiosRequestConfig;

const api = {
  get<TResponse = unknown>(url: string, config?: ApiMethodConfig): Promise<AxiosResponse<TResponse>> {
    return apiClient.get<TResponse>(url, config);
  },
  delete<TResponse = unknown>(url: string, config?: ApiMethodConfig): Promise<AxiosResponse<TResponse>> {
    return apiClient.delete<TResponse>(url, config);
  },
  post<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiMethodConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.post<TResponse>(url, data, config);
  },
  put<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiMethodConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.put<TResponse>(url, data, config);
  },
  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiMethodConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.patch<TResponse>(url, data, config);
  },
};

export { api, apiClient };
export default apiClient;

// 导出所有API模块
export * from './auth.ts';
export * from './user.ts';
export * from './post.ts';
export * from './comment.ts';