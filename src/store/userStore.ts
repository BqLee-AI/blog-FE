import { create } from "zustand";
import type { User, UserProfileForm, PasswordChangeForm } from "../types/index";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // 获取用户信息
  fetchUser: () => Promise<void>;
  
  // 更新个人信息
  updateProfile: (profile: UserProfileForm) => Promise<void>;
  
  // 更新头像
  updateAvatar: (avatarUrl: string) => Promise<void>;
  
  // 修改密码
  changePassword: (passwordForm: PasswordChangeForm) => Promise<void>;
  
  // 登出
  logout: () => void;
  
  // 清空错误信息
  clearError: () => void;
}

/**
 * 用户状态管理 Store
 */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // 获取用户信息（模拟数据）
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 使用模拟数据
      const mockUser: User = {
        id: 1,
        username: "张三",
        email: "zhangsan@example.com",
        bio: "热爱编程和技术分享的开发者",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        createdAt: "2024-01-15",
        updatedAt: "2024-03-20",
      };

      set({ user: mockUser, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "获取用户信息失败",
        isLoading: false,
      });
    }
  },

  // 更新个人信息
  updateProfile: async (profile: UserProfileForm) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              username: profile.username,
              email: profile.email,
              bio: profile.bio,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "更新个人信息失败",
        isLoading: false,
      });
    }
  },

  // 更新头像
  updateAvatar: async (avatarUrl: string) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              avatar: avatarUrl,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "更新头像失败",
        isLoading: false,
      });
      throw error;
    }
  },

  // 修改密码
  changePassword: async (passwordForm: PasswordChangeForm) => {
    set({ isLoading: true, error: null });
    try {
      // 验证密码
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("新密码和确认密码不一致");
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error("新密码至少需要 6 个字符");
      }

      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "修改密码失败",
        isLoading: false,
      });
      throw error; // 向上抛出错误以便 UI 处理
    }
  },

  // 登出
  logout: () => {
    set({ user: null, error: null });
    // 可以在这里清除本地存储或 token 等
  },

  // 清空错误信息
  clearError: () => {
    set({ error: null });
  },
}));
