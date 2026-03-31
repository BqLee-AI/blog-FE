import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { LoginForm, RegisterForm } from "@/types/auth";

interface LoginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "login" | "register";

export default function LoginPopover({ isOpen, onClose }: LoginPopoverProps) {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError, sendCode, isSendingCode, countdown, setCountdown } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>("login");

  // 登录表单状态
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // 处理标签页切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    clearError();
    setCountdown(0);
    // 清空表单
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ username: "", email: "", password: "", confirmPassword: "", code: "" });
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  // 处理登录
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm);
      // 登录成功，关闭弹窗并导航到首页
      onClose();
      navigate("/");
    } catch (err) {
      console.error("登录失败:", err);
    }
  };

  // 处理注册
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerForm);
      // 注册成功，关闭弹窗并导航到首页
      onClose();
      navigate("/");
    } catch (err) {
      console.error("注册失败:", err);
    }
  };

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
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 选项卡标签 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleTabChange("login")}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === "login"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            登录
          </button>
          <button
            onClick={() => handleTabChange("register")}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === "register"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            注册
          </button>
        </div>

        {/* 登录标签页 */}
        {activeTab === "login" && (
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="邮箱"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="密码"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded dark:bg-blue-700 font-medium disabled:opacity-50"
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
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                placeholder="用户名"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="邮箱"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={registerForm.code}
                  onChange={(e) => setRegisterForm({ ...registerForm, code: e.target.value })}
                  placeholder="验证码"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => sendCode(registerForm.email)}
                  disabled={countdown > 0 || isSendingCode || !registerForm.email}
                  className="px-3 py-2 bg-green-600 text-white rounded dark:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                >
                  {countdown > 0 ? `${countdown}s` : isSendingCode ? "发送中..." : "发送"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="密码"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm"
                >
                  {isPasswordVisible ? "隐" : "显"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  placeholder="确认密码"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm"
                >
                  {isConfirmPasswordVisible ? "隐" : "显"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded dark:bg-green-700 font-medium disabled:opacity-50"
              >
                {isLoading ? "注册中..." : "注册"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
