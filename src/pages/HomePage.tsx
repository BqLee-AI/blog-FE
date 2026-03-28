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
    <div>
      {/* 页面标题 */}
      <header className="mb-12 grid gap-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm backdrop-blur md:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] md:p-8">
        <div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.35em] uppercase mb-3">
            欢迎来到
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            我的个人博客
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-8">
            分享技术经验，记录学习笔记，用更清晰的结构阅读每一篇文章。
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/10 dark:to-cyan-900/10 p-5 border border-blue-100 dark:border-blue-900/30">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 dark:text-blue-300 mb-4">
            内容概览
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">文章数量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{articleOverview.articleCount}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">标签数量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{articleOverview.tagCount}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">平均阅读</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{articleOverview.averageReadingTime} 分钟</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">最新文章</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{articleOverview.latestTitle}</p>
              {articleOverview.latestDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{articleOverview.latestDate}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 文章列表 */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">最新文章</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              当前展示 {articleOverview.articleCount} 篇内容，均可直接进入详情阅读。
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载文章中...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">先准备一篇内容，页面就会立刻活起来。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


