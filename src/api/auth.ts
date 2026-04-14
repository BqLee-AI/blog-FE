import apiClient from './apiClient';
import type { AuthUser, LoginForm, RegisterForm } from '../types/auth';

interface ApiEnvelope<T> {
  message: string;
  data: T;
  code?: string;
  requestId?: string;
}

interface BackendAuthTokens {
  token_type?: string;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  access_expires_at?: string;
  refresh_expires_at?: string;
}

interface BackendAuthUser {
  id?: number;
  user_id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  role_id?: number;
  role?: AuthUser['role'];
}

interface BackendAuthPayload {
  user?: BackendAuthUser;
  tokens?: BackendAuthTokens;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  user_id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  role_id?: number;
  role?: AuthUser['role'];
}

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

function unwrapResponse<T>(payload: ApiEnvelope<T> | T): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

function resolveRole(roleId?: number, role?: AuthUser['role']): AuthUser['role'] {
  if (role) {
    return role;
  }

  switch (roleId) {
    case 1:
      return 'admin';
    case 2:
      return 'superadmin';
    default:
      return 'user';
  }
}

function mapAuthUser(payload: BackendAuthUser, fallback?: Partial<AuthUser>): AuthUser {
  const id = payload.id ?? payload.user_id ?? fallback?.id;
  const username = payload.username ?? fallback?.username;
  const email = payload.email ?? fallback?.email;

  if (id === undefined || !username || !email) {
    throw new Error('认证响应缺少用户信息');
  }

  return {
    id,
    username,
    email,
    avatar: payload.avatar ?? fallback?.avatar,
    role: resolveRole(payload.role_id, payload.role ?? fallback?.role),
  };
}

function resolveAuthTokens(payload: BackendAuthPayload): { accessToken?: string; refreshToken?: string } {
  const tokens = payload.tokens ?? payload;

  return {
    accessToken: tokens.access_token ?? tokens.accessToken,
    refreshToken: tokens.refresh_token ?? tokens.refreshToken,
  };
}

/**
 * 用户登录
 * @param credentials 登录凭证（邮箱和密码）
 * @returns 登录响应数据
 */
export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiEnvelope<BackendAuthPayload> | BackendAuthPayload>('/auth/login', credentials);
    const loginData = unwrapResponse(response.data);
    const user = mapAuthUser(loginData.user ?? loginData);
    const { accessToken, refreshToken } = resolveAuthTokens(loginData);

    if (!accessToken) {
      throw new Error('登录响应缺少访问令牌');
    }

    localStorage.setItem('accessToken', accessToken);

    return {
      user,
      accessToken,
      refreshToken: refreshToken ?? '',
    };
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
    const response = await apiClient.post<ApiEnvelope<{ message: string }> | { message: string }>("/auth/sendcode", { email });
    const codeData = unwrapResponse(response.data);

    if (!codeData || typeof codeData !== 'object' || typeof codeData.message !== 'string') {
      throw new Error('发送验证码响应格式无效');
    }

    return { message: codeData.message };
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
    const response = await apiClient.post<ApiEnvelope<BackendAuthPayload> | BackendAuthPayload>('/auth/register', userData);
    const registerData = unwrapResponse(response.data);
    const user = mapAuthUser(registerData.user ?? registerData, {
      id: registerData.user?.id ?? registerData.user?.user_id ?? registerData.user_id,
      username: userData.username,
      email: userData.email,
      role: 'user',
    });
    const { accessToken } = resolveAuthTokens(registerData);

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }

    return user;
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
    const response = await apiClient.post<ApiEnvelope<BackendAuthPayload> | BackendAuthPayload>('/auth/refresh');
    const refreshData = unwrapResponse(response.data);
    const { accessToken } = resolveAuthTokens(refreshData);

    if (!accessToken) {
      throw new Error('刷新令牌响应缺少访问令牌');
    }

    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    throw error;
  }
};