import { Link } from "react-router-dom";
import { FiClock, FiCalendar, FiArrowRight } from "react-icons/fi";
import { createPostCardViewModel, type ArticleSourcePost } from "../utils/postCardViewModel";

type PostCardProps = {
  post: ArticleSourcePost;
};

export default function PostCard({ post }: PostCardProps) {
  const viewModel = createPostCardViewModel(post);

  return (
    <Link to={`/article/${viewModel.id}`} className="block group">
      <article className="relative h-full flex flex-col rounded-[2.5rem] bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 backdrop-blur-2xl shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/10 hover:border-blue-500/30 overflow-hidden">
        {/* 指示条 */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 封面图支持 (如果有) */}
        {viewModel.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={viewModel.coverImage}
              alt={viewModel.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex-1 flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-400/10 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100/50 dark:border-blue-400/20 whitespace-nowrap">
              {viewModel.sourceLabel}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-slate-400 dark:text-slate-500 text-[10px] font-bold">
              {viewModel.publishedAt && (
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <FiCalendar className="text-xs" />
                  {viewModel.publishedAt}
                </span>
              )}
              {viewModel.publishedAt && viewModel.isBackendArticle && (
                <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              )}
              {viewModel.isBackendArticle && (
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <FiClock className="text-xs" />
                  {viewModel.ctaLabel}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-500 transition-colors">
            {viewModel.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 flex-1 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {viewModel.summary}
          </p>

          {viewModel.tags.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-8">
              {viewModel.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-500 text-[11px] font-bold rounded-lg border border-slate-200/50 dark:border-white/5 transition-all group-hover:border-blue-400/30 group-hover:text-blue-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100/50 dark:border-white/5 flex items-center justify-between mt-auto">
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              阅读全文
              <FiArrowRight className="text-lg" />
            </span>
            
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                {viewModel.authorName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
