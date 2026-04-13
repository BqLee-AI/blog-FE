import apiClient from './apiClient';

export interface ArticleAuthor {
  id: number;
  username: string;
}

export interface ArticleCategory {
  id: number;
  name: string;
}

export interface ArticleTag {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  cover_image: string;
  author: ArticleAuthor;
  view_count: number;
  created_at: string;
}

export interface ArticleDetail extends Article {
  content: string;
  tags: ArticleTag[];
  category: ArticleCategory | null;
}

export interface ArticleListParams {
  page?: number;
  page_size?: number;
  sort_by?: 'created_at' | 'view_count';
  keyword?: string;
}

export interface ArticleListRequestOptions {
  signal?: AbortSignal;
}

export type ArticlePublishStatus = 'draft' | 'published';

export type ArticleEditableStatus = ArticlePublishStatus | 'archived';

export interface ArticleCreateRequest {
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  status?: ArticlePublishStatus;
}

export interface ArticleUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  cover_image?: string;
  status?: ArticleEditableStatus;
}

export interface ArticleMutationRequestOptions {
  signal?: AbortSignal;
}

export interface ArticlePagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ArticleListResponse {
  items: Article[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  pagination?: ArticlePagination;
}

const defaultPagination: ArticlePagination = {
  page: 1,
  page_size: 9,
  total: 0,
  total_pages: 0,
};

const normalizeEntityId = (id: number | undefined): number => (typeof id === "number" ? id : 0);

const normalizeLabeledEntity = <T extends { id?: number }>(
  entity: T | null | undefined,
  getLabel: (entity: T) => string | undefined,
  fallbackLabel: string
): { id: number; label: string } | null => {
  if (!entity) {
    return null;
  }

  return {
    id: normalizeEntityId(entity.id),
    label: getLabel(entity)?.trim() || fallbackLabel,
  };
};

const normalizeArticleAuthor = (author: Partial<ArticleAuthor> | null | undefined): ArticleAuthor => {
  const normalizedAuthor = normalizeLabeledEntity(author, (value) => value.username, "未知作者");

  return {
    id: normalizedAuthor?.id ?? 0,
    username: normalizedAuthor?.label ?? "未知作者",
  };
};

const normalizeArticleTag = (tag: Partial<ArticleTag>): ArticleTag => {
  const normalizedTag = normalizeLabeledEntity(tag, (value) => value.name, "未命名标签");

  return {
    id: normalizedTag?.id ?? 0,
    name: normalizedTag?.label ?? "未命名标签",
  };
};

const normalizeArticleCategory = (
  category: Partial<ArticleCategory> | null | undefined
): ArticleCategory | null => {
  const normalizedCategory = normalizeLabeledEntity(category, (value) => value.name, "未分类");

  if (!normalizedCategory) {
    return null;
  }

  return {
    id: normalizedCategory.id,
    name: normalizedCategory.label,
  };
};

const normalizeArticle = (article: Partial<Article> & { author?: Partial<ArticleAuthor> | null }): Article => ({
  ...article,
  id: typeof article.id === "number" ? article.id : 0,
  title: article.title?.trim() || "未命名文章",
  summary: article.summary?.trim() || "",
  cover_image: article.cover_image ?? "",
  author: normalizeArticleAuthor(article.author),
  view_count: typeof article.view_count === "number" ? article.view_count : 0,
  created_at: article.created_at?.trim() || "",
});

const normalizeArticleDetail = (
  article: Partial<ArticleDetail> & { author?: Partial<ArticleAuthor> | null }
): ArticleDetail => ({
  ...normalizeArticle(article),
  content: article.content ?? "",
  tags: Array.isArray(article.tags) ? article.tags.map(normalizeArticleTag) : [],
  category: normalizeArticleCategory(article.category),
});

const unwrapResponse = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

export const articleApi = {
  list: async (
    params: ArticleListParams = {},
    options: ArticleListRequestOptions = {}
  ): Promise<ArticleListResponse> => {
    const response = await apiClient.get<
      ArticleListResponse | {
        data: ArticleListResponse;
      } | {
        items?: Article[];
        total?: number;
        page?: number;
        page_size?: number;
        total_pages?: number;
        pagination?: ArticlePagination;
      }
    >('/articles', {
      params,
      signal: options.signal,
    });

    const payload = unwrapResponse(response.data);
    const items = Array.isArray(payload.items) ? payload.items.map(normalizeArticle) : [];
    const paginationPayload = payload.pagination;
    const resolvedPageSize =
      typeof paginationPayload?.page_size === "number"
        ? paginationPayload.page_size
        : typeof payload.page_size === "number"
          ? payload.page_size
          : defaultPagination.page_size;
    const resolvedTotal =
      typeof paginationPayload?.total === "number"
        ? paginationPayload.total
        : typeof payload.total === "number"
          ? payload.total
          : defaultPagination.total;
    const pagination = {
      ...defaultPagination,
      page:
        typeof paginationPayload?.page === "number"
          ? paginationPayload.page
          : typeof payload.page === "number"
            ? payload.page
            : defaultPagination.page,
      page_size: resolvedPageSize,
      total: resolvedTotal,
      total_pages:
        typeof paginationPayload?.total_pages === "number"
          ? paginationPayload.total_pages
          : typeof payload.total_pages === "number"
            ? payload.total_pages
            : Math.max(1, Math.ceil(resolvedTotal / resolvedPageSize)),
    };

    return {
      items,
      total: pagination.total,
      page: pagination.page,
      page_size: pagination.page_size,
      total_pages: pagination.total_pages,
    };
  },

  getById: async (id: number, options: ArticleListRequestOptions = {}): Promise<ArticleDetail> => {
    const response = await apiClient.get<ArticleDetail | { data: ArticleDetail }>(`/articles/${id}`, {
      signal: options.signal,
    });

    return normalizeArticleDetail(unwrapResponse(response.data));
  },

  create: async (
    payload: ArticleCreateRequest,
    options: ArticleMutationRequestOptions = {}
  ): Promise<ArticleDetail> => {
    const response = await apiClient.post<ArticleDetail | { data: ArticleDetail }>('/articles', payload, {
      signal: options.signal,
    });

    return normalizeArticleDetail(unwrapResponse(response.data));
  },

  update: async (
    id: number,
    payload: ArticleUpdateRequest,
    options: ArticleMutationRequestOptions = {}
  ): Promise<void> => {
    await apiClient.put(`/articles/${id}`, payload, {
      signal: options.signal,
    });
  },

  delete: async (id: number, options: ArticleMutationRequestOptions = {}): Promise<void> => {
    await apiClient.delete(`/articles/${id}`, {
      signal: options.signal,
    });
  },
};