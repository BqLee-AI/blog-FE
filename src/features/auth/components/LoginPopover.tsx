import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import type { LoginForm, RegisterForm } from "@/types/auth";

interface LoginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "login" | "register";

export default function LoginPopover({ isOpen, onClose }: LoginPopoverProps) {
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
    verificationCode: "",
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
    setRegisterForm({ username: "", email: "", password: "", confirmPassword: "", verificationCode: "" });
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  // 处理登录
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm);
      // 登录成功
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 300);
    } catch (err) {
      console.error("登录失败:", err);
    }
  };

  // 处理注册
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerForm);
      // 注册成功
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 300);
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
          <div className="p-8">
            {/* 权益说明 */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">登录后的权益：</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>管理个人账号和发布内容</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>创建和编辑文章</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>查看和管理账户信息</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <span>获得更多权限和特性</span>
                </li>
              </ul>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="邮箱地址"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="密码"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hover-button w-full px-4 py-2 bg-blue-600 text-white rounded-lg dark:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isLoading ? "登录中..." : "立即登录"}
              </button>
            </form>

            {/* 测试账号提示 */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-2">💡 测试账号：</p>
              <p>邮箱：test@example.com</p>
              <p>密码：password123</p>
            </div>
          </div>
        )}

        {/* 注册标签页 */}
        {activeTab === "register" && (
          <div className="p-8">
            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* 注册表单 */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  placeholder="用户名（至少 2 个字符）"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="邮箱地址"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={registerForm.verificationCode}
                  onChange={(e) => setRegisterForm({ ...registerForm, verificationCode: e.target.value })}
                  placeholder="邮箱验证码"
                  className="hover-input flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => sendCode(registerForm.email)}
                  disabled={countdown > 0 || isSendingCode || !registerForm.email}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg dark:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}秒后重试` : isSendingCode ? "发送中..." : "发送验证码"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="密码（至少 6 个字符）"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {isPasswordVisible ? "隐" : "显"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  placeholder="再次输入密码"
                  className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {isConfirmPasswordVisible ? "隐" : "显"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="hover-button w-full px-4 py-2 bg-green-600 text-white rounded-lg dark:bg-green-700 font-medium disabled:opacity-50"
              >
                {isLoading ? "注册中..." : "立即注册"}
              </button>
            </form>

            {/* 测试账号提示 */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-2">💡 注册说明：</p>
              <p>用户名至少 2 个字符</p>
              <p>密码至少 6 个字符</p>
              <p>请输入有效的邮箱地址以接收验证码</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
