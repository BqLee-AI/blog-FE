import { type Article } from "@/api/article";
import type { Post } from "@/types";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";

export type ArticleSourcePost = Post | Article;

export interface PostCardViewModel {
  id: number;
  title: string;
  summary: string;
  coverImage: string | null;
  publishedAt: string | null;
  authorName: string | null;
  tags: string[];
  metaItems: string[];
  ctaLabel: string;
  sourceLabel: string;
  isBackendArticle: boolean;
}

const isBackendArticle = (post: ArticleSourcePost): post is Article => {
  return "cover_image" in post && "author" in post && typeof post.author === "object";
};

const getTags = (post: ArticleSourcePost): string[] => {
  if (!("tags" in post) || !Array.isArray(post.tags)) {
    return [];
  }

  const rawTags = post.tags as Array<string | { name?: string | null }>;

  return rawTags
    .map((tag) => (typeof tag === "string" ? tag.trim() : tag.name?.trim() || ""))
    .filter((tag): tag is string => Boolean(tag));
};

export const createPostCardViewModel = (post: ArticleSourcePost): PostCardViewModel => {
  const backendArticle = isBackendArticle(post);
  const publishedAt = formatArticleDate(backendArticle ? post.created_at : post.createdAt);
  const authorName = backendArticle ? post.author.username : post.author ?? null;
  const coverImage = backendArticle && post.cover_image ? post.cover_image : null;
  const readingTime = estimateReadingTime(backendArticle ? undefined : post.content);

  return {
    id: post.id,
    title: post.title,
    summary: post.summary,
    coverImage,
    publishedAt,
    authorName: authorName?.trim() || null,
    tags: getTags(post),
    metaItems: [
      !coverImage ? publishedAt : null,
      authorName ? `作者：${authorName}` : null,
      backendArticle ? `${post.view_count} 次阅读` : `${readingTime} 分钟阅读`,
    ].filter((item): item is string => Boolean(item)),
    ctaLabel: backendArticle ? `阅读量 ${post.view_count}` : "进入详情",
    sourceLabel: backendArticle ? "后端文章" : "文章推荐",
    isBackendArticle: backendArticle,
  };
};