import { create } from "zustand";
import type { AuthUser, LoginForm, RegisterForm } from "@/types/auth";
import { login as apiLogin, register as apiRegister, logout as apiLogout, sendVerificationCode } from "@/api/auth";

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  isSendingCode: boolean;
  countdown: number;

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

  // 发送验证码
  sendCode: (email: string) => Promise<void>;

  // 设置倒计时
  setCountdown: (count: number) => void;
}

/**
 * 认证状态管理 Store
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  isSendingCode: false,
  countdown: 0,

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

      // 调用后端API
      const response = await apiLogin(form);

      // response 现在直接是 LoginResponse，包含 user 和 accessToken
      set({
        user: response.user,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      // 保存到 localStorage
      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(response.user));
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
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

      if (!form.verificationCode || form.verificationCode.trim() === "") {
        throw new Error("请输入邮箱验证码");
      }

      // 调用后端API
      const user = await apiRegister(form);

      set({
        user: user,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      // 保存到 localStorage
      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(user));
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

  logout: async () => {
    try {
      // 调用后端API
      await apiLogout();
    } catch (error) {
      console.error("登出API调用失败:", error);
    } finally {
      set({ user: null, isLoggedIn: false, error: null });
      // 清除 localStorage
      try {
        localStorage.removeItem("blog-auth-user");
      } catch (e) {
        console.error("Failed to clear localStorage:", e);
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: AuthUser) => {
    set({ user, isLoggedIn: true });
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

  sendCode: async (email: string) => {
    set({ isSendingCode: true, error: null });
    try {
      if (!email || !email.includes("@")) {
        throw new Error("请输入有效的邮箱地址");
      }

      await sendVerificationCode(email);
      
      // 开始倒计时
      let count = 60;
      set({ countdown: count });
      const timer = setInterval(() => {
        count -= 1;
        set({ countdown: count });
        if (count <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "发送验证码失败",
        isSendingCode: false,
      });
      throw error;
    } finally {
      set({ isSendingCode: false });
    }
  },

  setCountdown: (count: number) => {
    set({ countdown: count });
  },
}));

/**
 * 初始化认证状态（从 localStorage 恢复）
 */
export const initializeAuth = () => {
  try {
    const savedUser = localStorage.getItem("blog-auth-user");
    if (savedUser) {
      const user = JSON.parse(savedUser) as AuthUser;
      useAuthStore.setState({ user, isLoggedIn: true });
    }
  } catch (e) {
    console.error("Failed to restore auth state:", e);
  }
};
