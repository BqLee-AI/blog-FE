import { Link } from "react-router-dom";
import type { Post } from "@/types";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const readingTime = estimateReadingTime(post.content);
  const publishedAt = formatArticleDate(post.createdAt);

  return (
    <Link to={`/article/${post.id}`} className="block">
      <article className="hover-card group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-blue-600 dark:text-blue-300">
              文章推荐
            </span>
            {publishedAt && <span>{publishedAt}</span>}
            <span>·</span>
            <span>{readingTime} 分钟阅读</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-5 line-clamp-3">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-full transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span>点击阅读全文</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">进入详情</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
