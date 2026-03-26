import { useState } from "react";
import type { UserProfileForm } from "@/types";

interface ProfileInfoProps {
  username: string;
  email: string;
  bio: string;
  avatar: string;
  isLoading?: boolean;
  onSave: (data: UserProfileForm) => Promise<void>;
}

export default function ProfileInfo({
  username,
  email,
  bio,
  avatar,
  isLoading = false,
  onSave,
}: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileForm>({
    username,
    email,
    bio,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 基础验证
      if (!formData.username.trim()) {
        throw new Error("用户名不能为空");
      }
      if (formData.username.length < 2) {
        throw new Error("用户名至少需要 2 个字符");
      }
      if (!formData.email.includes("@")) {
        throw new Error("邮箱格式不正确");
      }

      await onSave(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败，请重试");
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的信息</h2>
        <p className="text-gray-600 dark:text-gray-400">管理您的个人账号资料</p>
      </div>

      {/* 用户卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={username}
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{username}</h3>
            <p className="text-blue-100">{email}</p>
          </div>
        </div>
      </div>

      {/* 信息编辑区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                邮箱
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                个人简介
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="分享一点关于你自己的信息..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {isLoading ? "保存中..." : "保存更改"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* 用户名 */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">用户名</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{username}</p>
            </div>

            {/* 邮箱 */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">邮箱地址</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{email}</p>
            </div>

            {/* 个人简介 */}
            <div className="pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">个人简介</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {bio || "暂无简介"}
              </p>
            </div>

            {/* 编辑按钮 */}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              编辑信息
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
