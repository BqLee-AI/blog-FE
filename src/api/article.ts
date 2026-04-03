import apiClient from './index';

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
  pagination: ArticlePagination;
}

const defaultPagination: ArticlePagination = {
  page: 1,
  page_size: 9,
  total: 0,
  total_pages: 0,
};

const normalizeArticle = (article: Article): Article => ({
  ...article,
  cover_image: article.cover_image ?? "",
});

const normalizeArticleDetail = (article: ArticleDetail): ArticleDetail => ({
  ...normalizeArticle(article),
  content: article.content ?? "",
  tags: Array.isArray(article.tags) ? article.tags : [],
  category: article.category ?? { id: 0, name: "" },
});

const unwrapResponse = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

export const articleApi = {
  list: async (params: ArticleListParams = {}): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse | { data: ArticleListResponse }>('/articles', {
      params,
    });

    const payload = unwrapResponse(response.data);
    const items = Array.isArray(payload.items) ? payload.items : [];
    const pagination = {
      ...defaultPagination,
      ...(payload.pagination ?? {}),
    };

    return {
      items: items.map(normalizeArticle),
      pagination,
    };
  },

  getById: async (id: number): Promise<ArticleDetail> => {
    const response = await apiClient.get<ArticleDetail | { data: ArticleDetail }>(`/articles/${id}`);

    return normalizeArticleDetail(unwrapResponse(response.data));
  },
};