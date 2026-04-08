export type UserRole = "user" | "admin" | "superadmin";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
};
