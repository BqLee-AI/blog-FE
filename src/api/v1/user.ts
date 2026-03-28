import { API_DELAY, ApiError, readJson, request, writeJson } from "./client";
import type { PasswordChangeForm, User, UserProfileForm } from "@/types/user";

const USER_PROFILE_KEY = "blog-user-profile";
const USER_PASSWORD_KEY = "blog-user-password";

const DEFAULT_PROFILE: User = {
  id: 1,
  username: "张三",
  email: "zhangsan@example.com",
  bio: "热爱编程和技术分享的开发者",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  createdAt: "2024-01-15",
  updatedAt: "2024-03-20",
};

const DEFAULT_PASSWORD = "123456";

const loadProfile = (): User => readJson<User>(USER_PROFILE_KEY, DEFAULT_PROFILE);

const saveProfile = (profile: User): void => {
  writeJson(USER_PROFILE_KEY, profile);
};

const loadPassword = (): string => readJson<string>(USER_PASSWORD_KEY, DEFAULT_PASSWORD);

const savePassword = (password: string): void => {
  writeJson(USER_PASSWORD_KEY, password);
};

export const getProfile = () =>
  request(
    () => loadProfile(),
    {
      delay: API_DELAY.fast,
      message: "用户信息获取成功",
    }
  );

export const updateProfile = (profile: UserProfileForm) =>
  request(
    () => {
      if (!profile.username || !profile.email) {
        throw new ApiError("用户名和邮箱不能为空", 400, "USER_INVALID_INPUT");
      }

      const currentProfile = loadProfile();
      const nextProfile: User = {
        ...currentProfile,
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
        updatedAt: new Date().toISOString(),
      };

      saveProfile(nextProfile);
      return nextProfile;
    },
    {
      delay: API_DELAY.normal,
      message: "个人信息更新成功",
    }
  );

export const updateAvatar = (avatarUrl: string) =>
  request(
    () => {
      if (!avatarUrl) {
        throw new ApiError("头像地址不能为空", 400, "USER_INVALID_AVATAR");
      }

      const currentProfile = loadProfile();
      const nextProfile: User = {
        ...currentProfile,
        avatar: avatarUrl,
        updatedAt: new Date().toISOString(),
      };

      saveProfile(nextProfile);
      return nextProfile;
    },
    {
      delay: API_DELAY.normal,
      message: "头像更新成功",
    }
  );

export const changePassword = (passwordForm: PasswordChangeForm) =>
  request(
    () => {
      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        throw new ApiError("密码不能为空", 400, "USER_INVALID_PASSWORD");
      }

      if (passwordForm.currentPassword !== loadPassword()) {
        throw new ApiError("当前密码不正确", 400, "USER_CURRENT_PASSWORD_INVALID");
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new ApiError("新密码和确认密码不一致", 400, "USER_PASSWORD_MISMATCH");
      }

      if (passwordForm.newPassword.length < 6) {
        throw new ApiError("新密码至少需要 6 个字符", 400, "USER_WEAK_PASSWORD");
      }

      savePassword(passwordForm.newPassword);
      return null;
    },
    {
      delay: API_DELAY.normal,
      message: "密码修改成功",
    }
  );
