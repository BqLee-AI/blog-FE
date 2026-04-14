import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { LoginForm, RegisterForm } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface LoginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "login" | "register";

const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
});

const registerSchema = z
  .object({
    username: z.string().min(2, "用户名至少 2 个字符"),
    email: z.string().email("请输入有效的邮箱"),
    code: z.string().min(1, "请输入验证码"),
    password: z.string().min(6, "密码至少 6 位"),
    confirmPassword: z.string().min(6, "请再次输入密码"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiCheckCircle, 
  FiEye, 
  FiEyeOff, 
  FiX, 
  FiShield 
} from "react-icons/fi";

export default function LoginPopover({ isOpen, onClose }: LoginPopoverProps) {
  const { login, register, isLoading, error, clearError, sendCode, isSendingCode, countdown, setCountdown, clearCountdownTimer } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<TabType>("login");

  // 登录表单
  const loginMethods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  // 注册表单
  const registerMethods = useForm<RegisterForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const loginErrors = loginMethods.formState.errors;
  const registerErrors = registerMethods.formState.errors;

  const getPostAuthRedirect = () => {
    const redirectTarget = new URLSearchParams(location.search).get("redirect");

    if (!redirectTarget || !redirectTarget.startsWith("/") || redirectTarget.startsWith("//")) {
      return null;
    }

    return redirectTarget;
  };

  const closeAndRedirect = () => {
    onClose();

    const redirectTarget = getPostAuthRedirect();
    if (redirectTarget) {
      navigate(redirectTarget, { replace: true });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      clearCountdownTimer();
    }
  }, [isOpen, clearCountdownTimer]);

  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);


  // 处理标签页切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    clearError();
    setCountdown(0);
    // 清空表单
    loginMethods.reset();
    registerMethods.reset();
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  // 处理登录
  const handleLoginSubmit = loginMethods.handleSubmit(async (data) => {
    try {
      await login(data);
      closeAndRedirect();
    } catch (err) {
      console.error("登录失败:", err);
    }
  });

  // 处理注册
  const handleRegisterSubmit = registerMethods.handleSubmit(async (data) => {
    try {
      await register(data);
      closeAndRedirect();
    } catch (err) {
      console.error("注册失败:", err);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="hover-card relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden w-full max-w-sm mx-4">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="关闭"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* 选项卡标签 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={() => handleTabChange("login")}
            variant="ghost"
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === "login"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            登录
          </Button>
          <Button
            type="button"
            onClick={() => handleTabChange("register")}
            variant="ghost"
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === "register"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            注册
          </Button>
        </div>

        {/* 登录标签页 */}
        {activeTab === "login" && (
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="login-email" className="sr-only">邮箱</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="邮箱地址"
                    {...loginMethods.register("email")}
                    aria-invalid={!!loginErrors.email}
                    aria-describedby={loginErrors.email ? "login-email-error" : undefined}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {loginErrors.email && (
                  <p id="login-email-error" className="text-xs text-red-500 ml-1">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="login-password" className="sr-only">密码</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="密码"
                    {...loginMethods.register("password")}
                    aria-invalid={!!loginErrors.password}
                    aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p id="login-password-error" className="text-xs text-red-500 ml-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded dark:bg-blue-700 font-medium disabled:opacity-50 transition-all hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95"
              >
                {isLoading ? "登录中..." : "登录"}
              </button>
            </form>
          </div>
        )}

        {/* 注册标签页 */}
        {activeTab === "register" && (
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="register-username" className="sr-only">用户名</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="register-username"
                    type="text"
                    placeholder="用户名"
                    {...registerMethods.register("username")}
                    aria-invalid={!!registerErrors.username}
                    aria-describedby={registerErrors.username ? "register-username-error" : undefined}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                {registerErrors.username && (
                  <p id="register-username-error" className="text-xs text-red-500 ml-1">
                    {registerErrors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="register-email" className="sr-only">邮箱</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="邮箱"
                    {...registerMethods.register("email")}
                    aria-invalid={!!registerErrors.email}
                    aria-describedby={registerErrors.email ? "register-email-error" : undefined}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                {registerErrors.email && (
                  <p id="register-email-error" className="text-xs text-red-500 ml-1">
                    {registerErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <label htmlFor="register-code" className="sr-only">验证码</label>
                    <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="register-code"
                      type="text"
                      placeholder="验证码"
                      {...registerMethods.register("code")}
                      aria-invalid={!!registerErrors.code}
                      aria-describedby={registerErrors.code ? "register-code-error" : undefined}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => sendCode(registerMethods.watch("email"))}
                    disabled={countdown > 0 || isSendingCode || !registerMethods.watch("email")}
                    className="px-4 py-2 bg-green-600 text-white rounded dark:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm flex items-center gap-1.5 transition-all hover:bg-green-700"
                  >
                    {countdown > 0 ? (
                      `${countdown}s`
                    ) : isSendingCode ? (
                      "发送中..."
                    ) : (
                      <>
                        <FiCheckCircle />
                        发送
                      </>
                    )}
                  </button>
                </div>
                {registerErrors.code && (
                  <p id="register-code-error" className="text-xs text-red-500 ml-1">
                    {registerErrors.code.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="register-password" className="sr-only">密码</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="register-password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="密码 (至少6位)"
                    {...registerMethods.register("password")}
                    aria-invalid={!!registerErrors.password}
                    aria-describedby={registerErrors.password ? "register-password-error" : undefined}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {registerErrors.password && (
                  <p id="register-password-error" className="text-xs text-red-500 ml-1">
                    {registerErrors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="register-confirm-password" className="sr-only">确认密码</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="register-confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="确认密码"
                    {...registerMethods.register("confirmPassword")}
                    aria-invalid={!!registerErrors.confirmPassword}
                    aria-describedby={registerErrors.confirmPassword ? "register-confirm-password-error" : undefined}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <p id="register-confirm-password-error" className="text-xs text-red-500 ml-1">
                    {registerErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded dark:bg-green-700 font-medium disabled:opacity-50 transition-all hover:bg-green-700 dark:hover:bg-green-600 active:scale-95"
              >
                {isLoading ? "注册中..." : "立即加入"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
