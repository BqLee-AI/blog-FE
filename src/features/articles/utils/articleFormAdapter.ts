import { type ArticleDetail } from "@/api/article";
import type { Post } from "@/types";

export const toArticleFormPost = (article: ArticleDetail): Post => {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    tags: Array.isArray(article.tags) ? article.tags.map((tag) => tag.name) : [],
    createdAt: article.created_at ? article.created_at.slice(0, 10) : undefined,
    author: article.author?.username,
  };
};