import { create } from "zustand";
import type { AuthUser, LoginForm, RegisterForm } from "@/types/auth";

function normalizeAuthUser(user: AuthUser): AuthUser {
  return {
    ...user,
    role: user.role ?? "user",
  };
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;

  // 登录
  login: (form: LoginForm) => Promise<void>;

  // 注册
  register: (form: RegisterForm) => Promise<void>;

  // 登出
  logout: () => void;

  // 清空错误
  clearError: () => void;

  // 设置用户信息（用于页面跳转后更新）
  setUser: (user: AuthUser) => void;

  // 更新头像
  updateAvatar: (avatarUrl: string) => void;
}

/**
 * 认证状态管理 Store
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,

  login: async (form: LoginForm) => {
    set({ isLoading: true, error: null });
    try {
      // 基础验证
      if (!form.email || !form.password) {
        throw new Error("邮箱和密码不能为空");
      }

      if (!form.email.includes("@")) {
        throw new Error("请输入正确的邮箱地址");
      }

      if (form.password.length < 6) {
        throw new Error("密码至少需要 6 个字符");
      }

      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟登录数据
      const mockUser: AuthUser = {
        id: 1,
        username: form.email.split("@")[0] ?? "",
        email: form.email,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + form.email,
        role: "user",
      };

      set({
        user: mockUser,
        isLoggedIn: true,
        isLoading: false,
      });

      // 保存到 localStorage
      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(mockUser));
      } catch (e) {
        console.error("Failed to save user to localStorage:", e);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "登录失败",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (form: RegisterForm) => {
    set({ isLoading: true, error: null });
    try {
      // 验证
      if (!form.username || !form.email || !form.password) {
        throw new Error("所有字段都不能为空");
      }

      if (form.username.length < 2) {
        throw new Error("用户名至少需要 2 个字符");
      }

      if (!form.email.includes("@")) {
        throw new Error("请输入正确的邮箱地址");
      }

      if (form.password.length < 6) {
        throw new Error("密码至少需要 6 个字符");
      }

      if (form.password !== form.confirmPassword) {
        throw new Error("两次输入的密码不一致");
      }

      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟注册数据
      const mockUser: AuthUser = {
        id: Math.random(),
        username: form.username,
        email: form.email,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + form.email,
        role: "user",
      };

      set({
        user: mockUser,
        isLoggedIn: true,
        isLoading: false,
      });

      // 保存到 localStorage
      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(mockUser));
      } catch (e) {
        console.error("Failed to save user to localStorage:", e);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "注册失败",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false, error: null });
    // 清除 localStorage
    try {
      localStorage.removeItem("blog-auth-user");
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: AuthUser) => {
    set({ user: normalizeAuthUser(user), isLoggedIn: true });
  },

  updateAvatar: (avatarUrl: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, avatar: avatarUrl } : null,
    }));

    // 更新 localStorage
    try {
      const updatedUser = useAuthStore.getState().user;
      if (updatedUser) {
        localStorage.setItem("blog-auth-user", JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("Failed to save avatar to localStorage:", e);
    }
  },
}));

/**
 * 初始化认证状态（从 localStorage 恢复）
 */
export const initializeAuth = () => {
  try {
    const savedUser = localStorage.getItem("blog-auth-user");
    if (savedUser) {
      const user = normalizeAuthUser(JSON.parse(savedUser) as AuthUser);
      useAuthStore.setState({ user, isLoggedIn: true });
    }
  } catch (e) {
    console.error("Failed to restore auth state:", e);
  }
};
