export type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserProfileForm = {
  username: string;
  email: string;
  bio: string;
};

export type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
