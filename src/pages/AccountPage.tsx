import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import type { UserProfileForm, PasswordChangeForm } from "../types/index";

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isLoading, error, fetchUser, updateProfile, changePassword, logout, clearError } = useUserStore();

  // 个人信息编辑状态
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfileForm>({
    username: "",
    email: "",
    bio: "",
  });

  // 密码修改状态
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 初始化用户数据
  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {
      // 初始化表单数据
      setProfileForm({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      });
    }
  }, [user, fetchUser]);

  // 处理个人信息表单变化
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 提交个人信息
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("更新个人信息失败:", err);
    }
  };

  // 处理密码修改表单变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清空错误提示
    if (passwordError) setPasswordError(null);
  };

  // 提交密码修改
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await changePassword(passwordForm);
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // 3 秒后关闭成功提示
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "修改密码失败");
    }
  };

  // 处理登出
  const handleLogout = () => {
    if (window.confirm("确定要退出登录吗？")) {
      logout();
      navigate("/");
    }
  };

  if (!user && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">账号信息加载失败</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 页面标题 */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">账号设置</h1>
        <p className="text-gray-600 dark:text-gray-400">管理您的个人信息和账号安全</p>
      </header>

      {/* 全局错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 用户信息卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-6 mb-6">
          {/* 头像 */}
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-700 object-cover"
          />

          {/* 基本信息 */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-1">📧 {user.email}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              注册时间：{new Date(user.createdAt || "").toLocaleDateString("zh-CN")}
            </p>
          </div>
        </div>

        {/* 生物信息 */}
        {user.bio && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}
      </div>

      {/* 个人信息编辑区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">个人信息</h3>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="hover-button px-4 py-2 bg-blue-600 text-white rounded-lg dark:bg-blue-700"
            >
              编辑
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit}>
            {/* 用户名 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 邮箱 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                邮箱
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 生物信息 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                个人简介
              </label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows={4}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="分享一点关于你自己的信息..."
              />
            </div>

            {/* 按钮区 */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="hover-button px-6 py-2 bg-blue-600 text-white rounded-lg dark:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "保存中..." : "保存更改"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="hover-button px-6 py-2 bg-gray-200 text-gray-900 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">用户名</p>
              <p className="text-lg text-gray-900 dark:text-white">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">邮箱</p>
              <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">个人简介</p>
              <p className="text-lg text-gray-900 dark:text-white">{user.bio || "暂无"}</p>
            </div>
          </div>
        )}
      </div>

      {/* 密码修改区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">密码管理</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="hover-button px-4 py-2 bg-yellow-600 text-white rounded-lg dark:bg-yellow-700"
            >
              修改密码
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit}>
            {/* 成功提示 */}
            {passwordSuccess && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-600 dark:text-green-400">✓ 密码修改成功</p>
              </div>
            )}

            {/* 错误提示 */}
            {passwordError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            {/* 当前密码 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                当前密码
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* 新密码 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                新密码
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* 确认新密码 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                确认新密码
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="hover-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* 按钮区 */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="hover-button px-6 py-2 bg-yellow-600 text-white rounded-lg dark:bg-yellow-700 disabled:opacity-50"
              >
                {isLoading ? "修改中..." : "确认修改"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordError(null);
                }}
                className="hover-button px-6 py-2 bg-gray-200 text-gray-900 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-600 dark:text-gray-400">
            <p className="mb-4">最后修改时间：{new Date(user.updatedAt || "").toLocaleDateString("zh-CN")}</p>
            <p className="text-sm">定期修改密码可以保护您的账号安全。为保证账号安全，建议每 3 个月修改一次密码。</p>
          </div>
        )}
      </div>

      {/* 危险操作区 */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-4">危险操作</h3>
        <button
          onClick={handleLogout}
          className="hover-button px-6 py-2 bg-red-600 text-white rounded-lg dark:bg-red-700"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
