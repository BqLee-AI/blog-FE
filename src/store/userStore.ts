import { create } from "zustand";
import type { User, UserProfileForm, PasswordChangeForm } from "@/types/user";
import { getCurrentUser as fetchCurrentUser, updateProfile as updateProfileAPI, updateAvatar as updateAvatarAPI, changePassword as changePasswordAPI } from "@/api/user";

/**
 * Mock 用户数据（用于 API 未实现时的降级方案）
 */
const createMockUser = (): User => ({
  id: 1,
  username: "测试用户",
  email: "test@example.com",
  bio: "这是一个测试用户",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

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

  // 获取用户信息
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await fetchCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "获取用户信息失败";
      console.warn("API 获取用户信息失败，使用 mock 数据:", errorMessage);
      // 降级方案：使用 mock 数据
      const mockUser = createMockUser();
      set({
        user: mockUser,
        error: `${errorMessage}（使用测试数据）`,
        isLoading: false,
      });
    }
  },

  // 更新个人信息
  updateProfile: async (profile: UserProfileForm) => {
    set({ isLoading: true, error: null });
    try {
      const user = await updateProfileAPI(profile);
      set({ user, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "更新个人信息失败";
      console.warn("API 更新个人信息失败:", errorMessage);
      // 降级方案：模拟更新
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              ...profile,
              updatedAt: new Date().toISOString(),
            }
          : null,
        error: `${errorMessage}（本地更新）`,
        isLoading: false,
      }));
    }
  },

  // 更新头像
  updateAvatar: async (avatarUrl: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await updateAvatarAPI(avatarUrl);
      set({ user, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "更新头像失败";
      console.warn("API 更新头像失败:", errorMessage);
      // 降级方案：模拟更新头像
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              avatar: avatarUrl,
              updatedAt: new Date().toISOString(),
            }
          : null,
        error: `${errorMessage}（本地更新）`,
        isLoading: false,
      }));
    }
  },

  // 修改密码
  changePassword: async (passwordForm: PasswordChangeForm) => {
    set({ isLoading: true, error: null });
    try {
      await changePasswordAPI(passwordForm);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "修改密码失败";
      console.warn("API 修改密码失败:", errorMessage);
      // 降级方案：本地模拟成功
      set({
        error: `${errorMessage}（本地处理）`,
        isLoading: false,
      });
    }
  },

  // 登出
  logout: () => {
    set({ user: null, error: null });
    // 清除本地存储的用户信息
    try {
      localStorage.removeItem("blog-auth-user");
      localStorage.removeItem("accessToken");
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  },

  // 清空错误信息
  clearError: () => {
    set({ error: null });
  },
}));
