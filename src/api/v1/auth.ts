import type { AuthUser, LoginForm, RegisterForm } from "@/types/auth";
import {
  API_DELAY,
  ApiError,
  readJson,
  request,
  writeJson,
} from "./client";

const AUTH_USER_KEY = "blog-auth-user";
const AUTH_TOKEN_KEY = "blog-auth-token";

export type AuthSession = {
  user: AuthUser;
  token: string;
};

const buildAvatar = (email: string): string =>
  "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email;

const createToken = (user: AuthUser): string => `mock-token-${user.id}-${Date.now()}`;

const saveSession = (session: AuthSession): void => {
  writeJson(AUTH_USER_KEY, session.user);
  writeJson(AUTH_TOKEN_KEY, session.token);
};

const loadUser = (): AuthUser | null => readJson<AuthUser | null>(AUTH_USER_KEY, null);

export const getSession = () =>
  request(
    () => {
      const user = loadUser();
      if (!user) {
        return null;
      }

      const token = readJson<string | null>(AUTH_TOKEN_KEY, null);
      if (!token) {
        return null;
      }

      return { user, token } satisfies AuthSession;
    },
    {
      delay: API_DELAY.fast,
      message: "会话获取成功",
    }
  );

export const login = (form: LoginForm) =>
  request(
    () => {
      if (!form.email || !form.password) {
        throw new ApiError("邮箱和密码不能为空", 400, "AUTH_INVALID_INPUT");
      }

      if (!form.email.includes("@")) {
        throw new ApiError("请输入正确的邮箱地址", 400, "AUTH_INVALID_EMAIL");
      }

      if (form.password.length < 6) {
        throw new ApiError("密码至少需要 6 个字符", 400, "AUTH_WEAK_PASSWORD");
      }

      const user: AuthUser = {
        id: 1,
        username: form.email.split("@")[0] ?? "",
        email: form.email,
        avatar: buildAvatar(form.email),
      };

      const session: AuthSession = {
        user,
        token: createToken(user),
      };

      saveSession(session);
      return session;
    },
    {
      delay: 1000,
      message: "登录成功",
    }
  );

export const register = (form: RegisterForm) =>
  request(
    () => {
      if (!form.username || !form.email || !form.password) {
        throw new ApiError("所有字段都不能为空", 400, "AUTH_INVALID_INPUT");
      }

      if (form.username.length < 2) {
        throw new ApiError("用户名至少需要 2 个字符", 400, "AUTH_INVALID_USERNAME");
      }

      if (!form.email.includes("@")) {
        throw new ApiError("请输入正确的邮箱地址", 400, "AUTH_INVALID_EMAIL");
      }

      if (form.password.length < 6) {
        throw new ApiError("密码至少需要 6 个字符", 400, "AUTH_WEAK_PASSWORD");
      }

      if (form.password !== form.confirmPassword) {
        throw new ApiError("两次输入的密码不一致", 400, "AUTH_PASSWORD_MISMATCH");
      }

      const user: AuthUser = {
        id: Date.now(),
        username: form.username,
        email: form.email,
        avatar: buildAvatar(form.email),
      };

      const session: AuthSession = {
        user,
        token: createToken(user),
      };

      saveSession(session);
      return session;
    },
    {
      delay: 1000,
      message: "注册成功",
    }
  );

export const logout = () =>
  request(
    () => {
      writeJson<AuthUser | null>(AUTH_USER_KEY, null);
      writeJson<string | null>(AUTH_TOKEN_KEY, null);
      return null;
    },
    {
      delay: API_DELAY.fast,
      message: "退出登录成功",
    }
  );
