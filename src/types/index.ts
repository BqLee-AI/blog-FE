/**
 * 文章类型定义
 */
export type Post = {
  id: number;
  title: string;
  summary: string;
  content?: string; // 详细内容，详情页面使用
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  author?: string;
};

/**
 * 分页信息类型
 */
export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * API 响应类型
 */
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

/**
 * 列表响应类型
 */
export type ListResponse<T> = {
  items: T[];
  pagination: PaginationInfo;
};
