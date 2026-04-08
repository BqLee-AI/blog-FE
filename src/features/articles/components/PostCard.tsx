import { Link } from "react-router-dom";
import type { Post } from "@/types";
import type { Article } from "@/api/article";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";

type PostCardProps = {
  post: Post | Article;
};

const isBackendArticle = (post: Post | Article): post is Article => {
  return "cover_image" in post && "author" in post && typeof post.author === "object";
};

export default function PostCard({ post }: PostCardProps) {
  const readingTime = estimateReadingTime("content" in post ? post.content : undefined);
  const publishedAt = formatArticleDate(isBackendArticle(post) ? post.created_at : post.createdAt);
  const authorName = isBackendArticle(post) ? post.author.username : post.author;
  const backendArticle = isBackendArticle(post) ? post : null;
  const metaItems = [
    publishedAt,
    authorName ? `作者：${authorName}` : null,
    isBackendArticle(post) ? `${post.view_count} 次阅读` : `${readingTime} 分钟阅读`,
  ].filter(Boolean) as string[];
  const tags = "tags" in post && Array.isArray(post.tags)
    ? post.tags.map((tag) => (typeof tag === "string" ? tag : (tag as { name: string }).name))
    : [];
  const hasCoverImage = Boolean(backendArticle?.cover_image);

  return (
    <Link to={`/article/${post.id}`} className="block">
      <article className="hover-card group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {backendArticle?.cover_image ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={backendArticle.cover_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
            {publishedAt && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                {publishedAt}
              </span>
            )}
          </div>
        ) : (
          <div className="h-1 bg-linear-to-r from-blue-500 via-cyan-500 to-emerald-500" />
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-blue-600 dark:text-blue-300">
              {hasCoverImage ? "后端文章" : "文章推荐"}
            </span>
            {metaItems.map((item, index) => (
              <span key={`${item}-${index}`}>
                {index > 0 && <span className="mx-1">·</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-5 line-clamp-3">
            {post.summary}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-full transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span>点击阅读全文</span>
            {isBackendArticle(post) ? (
              <span className="font-medium text-blue-600 dark:text-blue-400">阅读量 {post.view_count}</span>
            ) : (
              <span className="font-medium text-blue-600 dark:text-blue-400">进入详情</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
