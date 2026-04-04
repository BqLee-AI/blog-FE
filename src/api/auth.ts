import { api } from './index';
import type { LoginForm, RegisterForm, AuthUser } from '../types/auth';

// 定义登录响应类型
interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * 用户登录
 * @param credentials 登录凭证（邮箱和密码）
 * @returns 登录响应数据
 */
export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await api.post<{ data: LoginResponse; code?: number; message?: string } | LoginResponse>('/auth/login', credentials);
    // 后端返回的数据结构可能是 { data: { user, accessToken, refreshToken } } 或者直接是 { user, accessToken, refreshToken }
    const loginData = (response.data as any)?.data || response.data;
    // 登录成功后保存token到localStorage
    if (loginData.accessToken) {
      localStorage.setItem('accessToken', loginData.accessToken);
    }
    return loginData as LoginResponse;
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
    const response = await api.post<{ message: string }>("/auth/sendcode", { email });
    const codeData = (response.data as any)?.data || response.data;
    return codeData as { message: string };
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
    const response = await api.post<{ data: RegisterResponse; code?: number; message?: string } | RegisterResponse>('/auth/register', userData);
    // 后端可能返回 { data: { user, accessToken } } 或直接返回 { user, accessToken }
    const registerData = 'data' in response.data ? response.data.data : response.data;
    const user = registerData.user;
    // 如果注册返回 token，保存到 localStorage
    if (registerData.accessToken) {
      localStorage.setItem('accessToken', registerData.accessToken);
    }
    return user as AuthUser;
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
    await api.post('/auth/logout');
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
    const response = await api.post('/auth/refresh');
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