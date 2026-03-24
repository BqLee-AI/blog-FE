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

/**
 * 用户类型定义
 */
export type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * 用户个人信息编辑表单类型
 */
export type UserProfileForm = {
  username: string;
  email: string;
  bio: string;
};

/**
 * 密码修改表单类型
 */
export type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * 评论类型定义
 */
export interface Comment {
  id: number;
  postId: number; // 关联的文章 ID
  content: string; // 评论内容
  createdAt: string; // 创建时间
  updatedAt?: string; // 更新时间
  isApproved: boolean; // 是否通过审核（默认 true，前端不审核）
  replyTo?: number; // 回复的评论 ID（用于嵌套评论）
  author?: string; // 评论者名称（后端数据，前端暂时不用）
  email?: string; // 评论者邮箱（后端数据，前端暂时不用）
  likes: number; // 点赞数
  dislikes: number; // 踩数
  replyCount: number; // 回复数
}

/**
 * 评论列表响应类型
 */
export type CommentListResponse = {
  items: Comment[];
  total: number;
  postId: number;
};
