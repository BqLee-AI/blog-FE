import axios, {
  type AxiosRequestConfig,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import type { StandardApiResponse, NetworkError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_STORAGE_KEY = 'blog-auth-user';

/**
 * 创建 axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 判断是否为不需要注入 access token 的认证端点
 */
const isTokenExemptAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return /\/auth\/(login|register|refresh)(?:\/|$)/.test(url);
};

/**
 * 判断是否为不应触发 401 全局登出的端点
 */
const isAuthErrorBypassEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return /\/auth\/(login|register|logout|refresh)(?:\/|$)/.test(url);
};

/**
 * 获取当前页面（用于 redirect 参数）
 */
const getCurrentRedirectTarget = (): string => {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

/**
 * 构建登录重定向 URL（包含 redirect 参数）
 */
const buildLoginRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '/';
  
  const loginUrl = '/';
  const redirectParam = encodeURIComponent(getCurrentRedirectTarget());
  return `${loginUrl}?redirect=${redirectParam}`;
};

/**
 * 清除认证状态
 */
const clearAuthState = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * 规范化错误信息
 */
const normalizeErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as any;
    if (data.message) return data.message;
    if (data.msg) return data.msg;
  }
  
  if (error.message === 'Network Error') {
    return '网络连接失败，请检查网络';
  }
  
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请重试';
  }
  
  return error.message || '请求失败';
};

/**
 * 请求拦截器 - 自动注入 Token（token 免注入端点除外）
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 认证端点不需要注入 access token
    if (isTokenExemptAuthEndpoint(config.url)) {
      return config;
    }

    // 其他端点添加 token
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 响应拦截器 - 统一处理错误
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    // 401 未授权：清除状态并跳转到登录，保留 redirect 参数
    if (status === 401 && !isAuthErrorBypassEndpoint(requestUrl)) {
      clearAuthState();
      if (typeof window !== 'undefined') {
        window.location.assign(buildLoginRedirectUrl());
      }
    }

    const message = normalizeErrorMessage(error);
    console.error('[API Error]', status, message);

    return Promise.reject(new Error(message));
  }
);

/**
 * 类型化 API 方法集合
 */
export const api = {
  /**
   * GET 请求
   */
  get<TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.get<TResponse>(url, config);
  },

  /**
   * POST 请求
   */
  post<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.post<TResponse>(url, data, config);
  },

  /**
   * PUT 请求
   */
  put<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.put<TResponse>(url, data, config);
  },

  /**
   * PATCH 请求
   */
  patch<TResponse = any, TData = any>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.patch<TResponse>(url, data, config);
  },

  /**
   * DELETE 请求
   */
  delete<TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return apiClient.delete<TResponse>(url, config);
  },
};

export default apiClient;
export { type StandardApiResponse, type NetworkError };

// 导出所有 API 模块
export * from './auth';
export * from './user';
export * from './post';
export * from './comment';