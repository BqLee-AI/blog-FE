import { api } from './index';
import type { LoginForm, RegisterForm, AuthUser } from '../types/auth';

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: AuthUser;
  accessToken?: string;
}

/**
 * 用户登录
 * @param credentials 登录凭证（邮箱和密码）
 * @returns 登录响应数据
 */
export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse | { data: LoginResponse }, LoginForm>('/auth/login', credentials);
    const loginData = 'data' in response.data ? response.data.data : response.data;

    if (loginData.accessToken) {
      localStorage.setItem('accessToken', loginData.accessToken);
    }

    return loginData;
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
    const response = await api.post<{ message: string }, { email: string }>('/auth/sendcode', { email });
    return response.data;
  } catch (error) {
    console.error('发送验证码失败:', error);
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
    const response = await api.post<RegisterResponse | AuthUser | { data: RegisterResponse | AuthUser }, RegisterForm>(
      '/auth/register',
      userData
    );
    const registerData = 'data' in response.data ? response.data.data : response.data;

    if ('accessToken' in registerData && registerData.accessToken) {
      localStorage.setItem('accessToken', registerData.accessToken);
    }

    return 'user' in registerData ? registerData.user : registerData;
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
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('登出失败:', error);
    localStorage.removeItem('accessToken');
  }
};

/**
 * 刷新访问令牌
 * @returns 新的访问令牌
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const response = await api.post<{ accessToken: string }>('/auth/refresh');
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
