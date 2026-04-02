import { create } from "zustand";
import type { AuthUser, LoginForm, RegisterForm } from "@/types/auth";
import { login as apiLogin, register as apiRegister, logout as apiLogout, sendVerificationCode } from "@/api/auth";

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
  isSendingCode: boolean;
  countdown: number;
  timerId: ReturnType<typeof setInterval> | null;

  login: (form: LoginForm) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser) => void;
  updateAvatar: (avatarUrl: string) => void;
  sendCode: (email: string) => Promise<void>;
  setCountdown: (count: number) => void;
  clearCountdownTimer: () => void;
}

/**
 * 认证状态管理 Store
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  isSendingCode: false,
  countdown: 0,
  timerId: null,

  login: async (form: LoginForm) => {
    set({ isLoading: true, error: null });
    try {
      if (!form.email || !form.password) {
        throw new Error("邮箱和密码不能为空");
      }

      if (!form.email.includes("@")) {
        throw new Error("请输入正确的邮箱地址");
      }

      const response = await apiLogin(form);
      const normalizedUser = normalizeAuthUser(response.user);

      set({
        user: normalizedUser,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(normalizedUser));
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
        hasHydrated: true,
      });
      throw error;
    }
  },

  register: async (form: RegisterForm) => {
    set({ isLoading: true, error: null });
    try {
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

      if (!form.code || form.code.trim() === "") {
        throw new Error("请输入邮箱验证码");
      }

      const user = normalizeAuthUser(await apiRegister(form));

      set({
        user,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });

      try {
        localStorage.setItem("blog-auth-user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save user to localStorage:", e);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "注册失败",
        isLoading: false,
        hasHydrated: true,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      get().clearCountdownTimer();
      await apiLogout();
    } catch (error) {
      console.error("登出API调用失败:", error);
    } finally {
      set({ user: null, isLoggedIn: false, error: null });
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
    set({ user: normalizeAuthUser(user), isLoggedIn: true, hasHydrated: true });
  },

  updateAvatar: (avatarUrl: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, avatar: avatarUrl } : null,
    }));

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
      get().clearCountdownTimer();

      let count = 60;
      const timerId = setInterval(() => {
        count -= 1;

        if (count <= 0) {
          get().clearCountdownTimer();
          return;
        }

        set({ countdown: count });
      }, 1000);

      set({ countdown: count, timerId });
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
    if (count <= 0) {
      get().clearCountdownTimer();
      return;
    }

    set({ countdown: count });
  },

  clearCountdownTimer: () => {
    const { timerId } = get();

    if (timerId !== null) {
      clearInterval(timerId);
    }

    set({ timerId: null, countdown: 0 });
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
  } catch (error) {
    console.error("Failed to restore auth state:", error);
  }
};
