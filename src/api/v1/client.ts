import type { ApiResponse, ListResponse, PaginationInfo } from "@/types/post";

export const API_DELAY = {
  fast: 120,
  normal: 240,
  slow: 360,
} as const;

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status = 500, code = "API_ERROR", details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const sleep = (ms = API_DELAY.normal): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isStorageAvailable = (): boolean => typeof localStorage !== "undefined";

export const readJson = <T>(key: string, fallback: T): T => {
  if (!isStorageAvailable()) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeJson = <T>(key: string, value: T): void => {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures in the mock API layer.
  }
};

export const toApiResponse = <T>(data: T, message = "success"): ApiResponse<T> => ({
  code: 0,
  message,
  data,
});

export const normalizeError = (
  error: unknown,
  fallbackMessage: string,
  status = 500,
  code = "API_ERROR"
): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallbackMessage, status, code);
  }

  return new ApiError(fallbackMessage, status, code);
};

export const request = async <T>(
  handler: () => T | Promise<T>,
  options?: {
    delay?: number;
    message?: string;
  }
): Promise<ApiResponse<T>> => {
  await sleep(options?.delay ?? API_DELAY.normal);

  try {
    const data = await handler();
    return toApiResponse(data, options?.message ?? "success");
  } catch (error) {
    throw normalizeError(error, options?.message ?? "请求失败");
  }
};

export const paginate = <T>(
  items: T[],
  page = 1,
  pageSize = 10
): ListResponse<T> => {
  const currentPage = Math.max(1, page);
  const currentPageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));
  const start = (currentPage - 1) * currentPageSize;

  return {
    items: items.slice(start, start + currentPageSize),
    pagination: {
      page: currentPage,
      pageSize: currentPageSize,
      total,
      totalPages,
    },
  };
};

export const buildPagination = (
  total: number,
  page: number,
  pageSize: number
): PaginationInfo => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / Math.max(1, pageSize))),
});

export const generateId = (ids: number[]): number => {
  if (ids.length === 0) {
    return Date.now();
  }

  return Math.max(...ids) + 1;
};
