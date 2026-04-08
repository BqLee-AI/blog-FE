/**
 * 通用 API 响应类型定义
 */

/**
 * 后端标准响应格式
 * 支持两种格式：
 * 1. { code: 0, data: T, message?: string }（推荐）
 * 2. 直接返回 T（简化格式）
 */
export interface StandardApiResponse<T = any> {
  code?: number;
  data?: T;
  message?: string;
}

/**
 * 分页响应信息
 */
export interface PaginationInfo {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * 分页数据响应
 */
export interface PagedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * 列表响应（简化版）
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
}

/**
 * 单项数据响应（通常用于 GET /api/v1/resource/:id）
 */
export interface ItemResponse<T> {
  data: T;
}

/**
 * 操作结果响应（不含主要数据）
 * 用于 POST/PUT/DELETE 操作返回的确认消息
 */
export interface OperationResponse {
  code: number;
  message: string;
  data?: any;
}

/**
 * 通用 API 错误响应
 */
export interface ApiErrorResponse {
  code: number;
  message: string;
  details?: Record<string, any>;
}

/**
 * 网络错误信息
 */
export interface NetworkError {
  type: 'network' | 'timeout' | 'auth' | 'permission' | 'notfound' | 'server' | 'unknown';
  message: string;
  code?: number;
  originalError?: Error;
}
