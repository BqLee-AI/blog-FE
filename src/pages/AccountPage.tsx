import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import AccountSidebar from "@/features/account/components/AccountSidebar";
import ProfileInfo from "@/features/account/components/ProfileInfo";
import AvatarSettings from "@/features/account/components/AvatarSettings";
import AccountSecurity from "@/features/account/components/AccountSecurity";
import ActivityLog from "@/features/account/components/ActivityLog";
import type { UserProfileForm, PasswordChangeForm } from "@/types";

type AccountTab = "profile" | "avatar" | "security" | "activity";

export default function AccountPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout: authLogout } = useAuthStore();
  const { user, isLoading, fetchUser, updateProfile, updateAvatar, changePassword, logout } =
    useUserStore();

  const [activeTab, setActiveTab] = useState<AccountTab>("profile");

  // 检查是否已登录
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [isLoggedIn, user, fetchUser, navigate]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">账号信息加载失败</p>
      </div>
    );
  }

  // 处理头像变更
  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      await updateAvatar(avatarUrl);
      const { updateAvatar: authUpdateAvatar } = useAuthStore.getState();
      authUpdateAvatar(avatarUrl);
    } catch (err) {
      console.error("更新头像失败:", err);
      throw err;
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    authLogout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 侧边栏 */}
      <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          {/* 我的信息 */}
          {activeTab === "profile" && (
            <ProfileInfo
              username={user.username}
              email={user.email}
              bio={user.bio || ""}
              avatar={user.avatar || ""}
              isLoading={isLoading}
              onSave={updateProfile}
            />
          )}

          {/* 我的头像 */}
          {activeTab === "avatar" && (
            <AvatarSettings
              currentAvatar={user.avatar || ""}
              username={user.username}
              isLoading={isLoading}
              onAvatarChange={handleAvatarChange}
            />
          )}

          {/* 账号安全 */}
          {activeTab === "security" && (
            <AccountSecurity
              email={user.email}
              isLoading={isLoading}
              onPasswordChange={changePassword}
              onLogout={handleLogout}
            />
          )}

          {/* 我的记录 */}
          {activeTab === "activity" && <ActivityLog />}
        </div>
      </main>
    </div>
  );
}
