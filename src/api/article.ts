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
  category: ArticleCategory;
}

export interface ArticleListParams {
  page?: number;
  page_size?: number;
  sort_by?: 'created_at' | 'view_count';
  keyword?: string;
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
}

const defaultPagination: ArticlePagination = {
  page: 1,
  page_size: 9,
  total: 0,
  total_pages: 0,
};

const normalizeArticleAuthor = (author: Partial<ArticleAuthor> | null | undefined): ArticleAuthor => ({
  id: typeof author?.id === "number" ? author.id : 0,
  username: author?.username?.trim() || "未知作者",
});

const normalizeArticleTag = (tag: Partial<ArticleTag>): ArticleTag => ({
  id: typeof tag.id === "number" ? tag.id : 0,
  name: tag.name?.trim() || "未命名标签",
});

const normalizeArticleCategory = (
  category: Partial<ArticleCategory> | null | undefined
): ArticleCategory => {
  if (!category) {
    return {
      id: 0,
      name: '未分类',
    };
  }

  return {
    id: typeof category.id === "number" ? category.id : 0,
    name: category.name?.trim() || "未分类",
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
  list: async (params: ArticleListParams = {}): Promise<ArticleListResponse> => {
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
    });

    const payload = unwrapResponse(response.data);
    const items = Array.isArray(payload.items) ? payload.items.map(normalizeArticle) : [];
    const pagination = {
      ...defaultPagination,
      page: typeof payload.page === "number" ? payload.page : defaultPagination.page,
      page_size: typeof payload.page_size === "number" ? payload.page_size : defaultPagination.page_size,
      total: typeof payload.total === "number" ? payload.total : defaultPagination.total,
      total_pages:
        typeof payload.total_pages === "number"
          ? payload.total_pages
          : Math.max(1, Math.ceil((typeof payload.total === "number" ? payload.total : defaultPagination.total) / (typeof payload.page_size === "number" ? payload.page_size : defaultPagination.page_size))),
    };

    return {
      items,
      total: pagination.total,
      page: pagination.page,
      page_size: pagination.page_size,
      total_pages: pagination.total_pages,
    };
  },

  getById: async (id: number): Promise<ArticleDetail> => {
    const response = await apiClient.get<ArticleDetail | { data: ArticleDetail }>(`/articles/${id}`);

    return normalizeArticleDetail(unwrapResponse(response.data));
  },
};