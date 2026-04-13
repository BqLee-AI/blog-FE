import { Link } from "react-router-dom";
import type { Post } from "@/types";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";
import { FiClock, FiCalendar, FiArrowRight } from "react-icons/fi";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const readingTime = estimateReadingTime(post.content);
  const publishedAt = formatArticleDate(post.createdAt);

  return (
    <Link to={`/article/${post.id}`} className="block group">
      <article className="relative h-full flex flex-col rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-800/40 backdrop-blur-2xl shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/10 hover:border-blue-500/30 overflow-hidden">
        {/* 指示条 */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex-1 flex flex-col p-8 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
              {post.tags[0] || "精彩内容"}
            </span>
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-sm" />
                {publishedAt}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="flex items-center gap-1">
                <FiClock className="text-sm" />
                {readingTime} 分钟阅读
              </span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-500 transition-colors">
            {post.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 flex-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-2.5 mb-8">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 text-[11px] font-bold rounded-lg border border-slate-200/50 dark:border-slate-700/50 transition-all group-hover:border-blue-400/30 group-hover:text-blue-500"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between mt-auto">
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              阅读全文
              <FiArrowRight className="text-lg" />
            </span>
            
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
