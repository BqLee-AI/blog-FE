export type Post = {
  id: number;
  title: string;
  summary: string;
  content?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  author?: string;
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListResponse<T> = {
  items: T[];
  pagination: PaginationInfo;
};
