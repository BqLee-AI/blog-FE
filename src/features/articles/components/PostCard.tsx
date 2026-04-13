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
    <Link to={`/article/${post.id}`} className="block group">
      <article className="post-card hover-card h-full flex flex-col relative overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform origin-left transition-transform duration-500 group-hover:scale-x-110" />
        
        <div className="flex-1 flex flex-col p-6 lg:p-7">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
              文章推荐
            </span>
            <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-medium">
              {publishedAt}
              <span className="mx-2 opacity-30">•</span>
              <span>{readingTime} 分钟阅读</span>
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold rounded-lg border border-slate-200/50 dark:border-slate-700/50 transition-all group-hover:border-blue-300/50 dark:group-hover:border-blue-700/50 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between mt-auto">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              进入详情
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
