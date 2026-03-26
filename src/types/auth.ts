export type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
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
};
