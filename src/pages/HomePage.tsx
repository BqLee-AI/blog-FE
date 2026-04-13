import { useEffect, useMemo } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { usePostStore } from "@/store/postStore";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";

export default function HomePage() {
  const { posts, isLoading, fetchPosts } = usePostStore();

  const articleOverview = useMemo(() => {
    const tagSet = new Set<string>();
    let totalReadingMinutes = 0;

    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
      totalReadingMinutes += estimateReadingTime(post.content);
    });

    const latestPost = [...posts].sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return rightTime - leftTime;
    })[0];

    return {
      articleCount: posts.length,
      tagCount: tagSet.size,
      averageReadingTime: posts.length > 0 ? Math.max(1, Math.round(totalReadingMinutes / posts.length)) : 0,
      latestTitle: latestPost?.title ?? "暂无文章",
      latestDate: formatArticleDate(latestPost?.createdAt),
    };
  }, [posts]);

  // 页面加载时获取文章列表
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="animate-fade-in">
      {/* 页面标题 */}
      <header className="mb-16 grid gap-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-8 shadow-xl shadow-blue-500/5 backdrop-blur-xl md:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)] md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col justify-center">
          <p className="text-blue-600 dark:text-blue-400 font-extrabold text-xs tracking-[0.4em] uppercase mb-4 opacity-80">
            欢迎来到
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            我的个人博客
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
            分享技术经验，记录学习笔记，用更清晰的结构浏览每一篇文章。
          </p>
        </div>

        <div className="relative z-10 rounded-3xl bg-neutral-900/5 dark:bg-white/5 p-1 backdrop-blur-sm">
          <div className="rounded-[1.25rem] bg-white/60 dark:bg-slate-950/60 p-6 shadow-inner border border-white/40 dark:border-slate-800/40">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-400 dark:text-slate-500 mb-6 text-center">
              内容概览
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">文章数量</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{articleOverview.articleCount}</p>
              </div>
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">标签数量</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{articleOverview.tagCount}</p>
              </div>
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">平均阅读</p>
                <p className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{articleOverview.averageReadingTime} 分钟</p>
              </div>
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">最新文章</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{articleOverview.latestTitle}</p>
                {articleOverview.latestDate && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{articleOverview.latestDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 文章列表 */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">最新文章</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              当前展示 {articleOverview.articleCount} 篇内容，均可直接进入详情阅读。
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-14 h-14 border-[3px] border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">加载文章中...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-xl font-bold">暂无文章</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">先准备一篇内容，页面就会立刻活起来。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


