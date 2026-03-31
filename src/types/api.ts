export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  code?: number;
  message: string;
  data?: unknown;
};

export type ApiErrorPayload = {
  message: string;
  status?: number;
};