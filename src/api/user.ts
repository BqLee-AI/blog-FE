import apiClient from './index';
import type{ User, UserProfileForm, PasswordChangeForm } from '../types/user';

/**
 * 获取当前用户信息
 * @returns 当前登录用户的信息
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取用户信息
 * @param userId 用户ID
 * @returns 用户信息
 */
export const getUserById = async (userId: number | string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`获取用户信息失败 (ID: ${userId}):`, error);
    throw error;
  }
};

/**
 * 更新用户个人信息
 * @param userData 用户更新数据
 * @returns 更新后的用户信息
 */
export const updateProfile = async (userData: UserProfileForm): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 更新用户头像
 * @param avatarUrl 新头像URL
 * @returns 更新后的用户信息
 */
export const updateAvatar = async (avatarUrl: string): Promise<User> => {
  try {
    const response = await apiClient.patch<User>('/users/profile/avatar', { avatarUrl });
    return response.data;
  } catch (error) {
    console.error('更新头像失败:', error);
    throw error;
  }
};

/**
 * 更改用户密码
 * @param passwordData 密码数据
 * @returns 是否成功更改密码
 */
export const changePassword = async (passwordData: PasswordChangeForm): Promise<boolean> => {
  try {
    const response = await apiClient.patch('/users/profile/password', passwordData);
    return response.data.success;
  } catch (error) {
    console.error('更改密码失败:', error);
    throw error;
  }
};