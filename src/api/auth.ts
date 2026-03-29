import apiClient from './index';
import type{ LoginForm, RegisterForm, AuthUser } from '../types/auth';

// 定义登录响应类型
interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * 用户登录
 * @param credentials 登录凭证（邮箱和密码）
 * @returns 登录响应数据
 */
export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
    // 登录成功后保存token到localStorage
    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * @returns 是否发送成功
 */
export const sendVerificationCode = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>("/api/v1/auth/sendEmail", { email });
    return response.data;
  } catch (error) {
    console.error("发送验证码失败:", error);
    throw error;
  }
};

/**
 * 用户注册
 * @param userData 注册数据
 * @returns 注册成功的用户信息
 */
export const register = async (userData: RegisterForm): Promise<AuthUser> => {
  try {
    const response = await apiClient.post<AuthUser>('/api/v1/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 * 清除本地存储的令牌
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
    // 清除本地存储的令牌
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('登出失败:', error);
    // 即使API调用失败，也要清除本地token
    localStorage.removeItem('accessToken');
  }
};

/**
 * 刷新访问令牌
 * @returns 新的访问令牌
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const response = await apiClient.post('/auth/refresh');
    const newToken = response.data.accessToken;
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    }
    return newToken;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    throw error;
  }
};