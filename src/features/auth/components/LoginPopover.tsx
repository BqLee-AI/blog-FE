import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import type { LoginForm, RegisterForm } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { FiMail, FiLock, FiUser, FiCheckCircle, FiEye, FiEyeOff, FiX, FiShield } from "react-icons/fi";
import { cn } from "@/lib/utils";

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

export default function LoginPopover({ isOpen, onClose }: LoginPopoverProps) {
  const { login, register, isLoading, error, clearError, sendCode, isSendingCode, countdown, setCountdown, clearCountdownTimer } = useAuthStore();

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
      onClose();
    } catch (err) {
      console.error("登录失败:", err);
    }
  });

  // 处理注册
  const handleRegisterSubmit = registerMethods.handleSubmit(async (data) => {
    try {
      await register(data);
      onClose();
    } catch (err) {
      console.error("注册失败:", err);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-[420px] bg-white/90 dark:bg-slate-900/90 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 dark:border-white/5 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
        {/* 顶部 Branding */}
        <div className="relative pt-12 pb-8 px-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-2">
              <span className="text-white font-black text-2xl tracking-tighter">B</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === "login" ? "欢迎回来" : "加入我们"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {activeTab === "login" 
                ? "继续您的创意之旅" 
                : "开启一段全新的技术探索"}
            </p>
          </div>
        </div>

        {/* 关键优化：滑动 Tab 切换 */}
        <div className="px-8 mb-6">
          <div className="relative p-1 bg-slate-100 dark:bg-white/5 rounded-2xl flex gap-1 items-center">
            {/* 滑动背景 */}
            <div 
              className={cn(
                "absolute h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all duration-300 ease-out",
                activeTab === "login" ? "w-[48%] left-1" : "w-[48%] left-[51%]"
              )}
            />
            
            <button
              onClick={() => handleTabChange("login")}
              className={cn(
                "relative z-10 flex-1 h-10 text-[13px] font-black transition-colors duration-300",
                activeTab === "login" ? "text-blue-600 dark:text-white" : "text-slate-500"
              )}
            >
              登录
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={cn(
                "relative z-10 flex-1 h-10 text-[13px] font-black transition-colors duration-300",
                activeTab === "register" ? "text-blue-600 dark:text-white" : "text-slate-500"
              )}
            >
              注册
            </button>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-8 z-20 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* 登录标签页 */}
        {activeTab === "login" && (
          <div className="p-8 pb-10 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            {error && (
              <div className="flex items-center gap-3 p-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl animate-shake">
                <FiShield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative group/input">
                  <FiMail className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    loginErrors.email ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  <input
                    type="email"
                    placeholder="邮箱地址"
                    {...loginMethods.register("email")}
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      loginErrors.email 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{loginErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative group/input">
                  <FiLock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    loginErrors.password ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  {/* 密码可见性切换 */}
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="账号密码"
                    {...loginMethods.register("password")}
                    className={cn(
                      "w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      loginErrors.password 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{loginErrors.password.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  {isLoading ? "确认认证中..." : "立即登录系统"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 注册标签页 */}
        {activeTab === "register" && (
          <div className="p-8 pb-10 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            {error && (
              <div className="flex items-center gap-3 p-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <FiShield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative group/input">
                  <FiUser className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    registerErrors.username ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  <input
                    type="text"
                    placeholder="设置您的用户名"
                    {...registerMethods.register("username")}
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      registerErrors.username 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {registerErrors.username && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{registerErrors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative group/input">
                  <FiMail className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    registerErrors.email ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  <input
                    type="email"
                    placeholder="您的安全邮箱"
                    {...registerMethods.register("email")}
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      registerErrors.email 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{registerErrors.email.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <div className="relative group/input">
                    <FiShield className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                      registerErrors.code ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                    )} />
                    <input
                      type="text"
                      placeholder="验证码"
                      {...registerMethods.register("code")}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                        registerErrors.code 
                          ? "border-red-500/50 ring-red-500/10" 
                          : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                      )}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sendCode(registerMethods.watch("email"))}
                  disabled={countdown > 0 || isSendingCode || !registerMethods.watch("email")}
                  className="px-5 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : isSendingCode ? "发送中..." : "获取代码"}
                </button>
              </div>
              {registerErrors.code && (
                <p className="text-[10px] font-bold text-red-500 pl-4">{registerErrors.code.message}</p>
              )}

              <div className="space-y-2">
                <div className="relative group/input">
                  <FiLock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    registerErrors.password ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {isPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="设置密码 (6位以上)"
                    {...registerMethods.register("password")}
                    className={cn(
                      "w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      registerErrors.password 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {registerErrors.password && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{registerErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative group/input">
                  <FiCheckCircle className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    registerErrors.confirmPassword ? "text-red-400" : "text-slate-400 group-focus-within/input:text-blue-500"
                  )} />
                  <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {isConfirmPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="再次确认您的密码"
                    {...registerMethods.register("confirmPassword")}
                    className={cn(
                      "w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-slate-400",
                      registerErrors.confirmPassword 
                        ? "border-red-500/50 ring-red-500/10" 
                        : "focus:border-blue-500/50 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800"
                    )}
                  />
                </div>
                {registerErrors.confirmPassword && (
                  <p className="text-[10px] font-bold text-red-500 pl-4">{registerErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? "正在创建账户..." : "开启探索之旅"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
