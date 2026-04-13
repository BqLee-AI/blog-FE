import { useEffect, useMemo, useState } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { usePostStore } from "@/store/postStore";
import { estimateReadingTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ArticlesPage() {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const [activeCategory, setActiveCategory] = useState("全部");

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts.length, fetchPosts]);

  const categories = useMemo(() => {
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });

    return ["全部", ...Array.from(tagSet).sort((left, right) => left.localeCompare(right))];
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    return counts;
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "全部") {
      return posts;
    }

    return posts.filter((post) => post.tags.includes(activeCategory));
  }, [activeCategory, posts]);

  const totalReadingMinutes = useMemo(
    () => visiblePosts.reduce((total, post) => total + estimateReadingTime(post.content), 0),
    [visiblePosts]
  );

  return (
    <div className="animate-fade-in">
      <header className="mb-12 space-y-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-8 shadow-xl shadow-blue-500/5 backdrop-blur-xl md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-extrabold text-xs tracking-[0.4em] uppercase mb-4 opacity-80">
              全部内容
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              查看所有文章
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl leading-relaxed font-medium">
              浏览博客中的全部文章，按分类筛选你感兴趣的内容，并快速了解当前分类的内容密度。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center md:min-w-[360px]">
            <div className="rounded-[1.25rem] bg-white/60 dark:bg-slate-900/60 p-5 border border-white dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">总文章</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{posts.length}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/60 dark:bg-slate-900/60 p-5 border border-white dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">当前分类</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {activeCategory === "全部" ? categories.length - 1 : 1}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white/60 dark:bg-slate-900/60 p-5 border border-white dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">阅读总时长</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalReadingMinutes}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">分钟</p>
            </div>
          </div>
        </div>

        <nav className="relative z-10 rounded-2xl bg-slate-950/5 dark:bg-white/5 p-2 backdrop-blur-sm mt-8 border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-2 py-1 no-scrollbar">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              const categoryCount = category === "全部" ? posts.length : categoryCounts.get(category) ?? 0;

              return (
                <Button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  variant={isActive ? "default" : "ghost"}
                  className={
                    isActive
                      ? "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-all scale-105"
                      : "inline-flex items-center gap-2 rounded-xl bg-transparent px-5 py-2.5 text-slate-600 dark:text-slate-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  }
                >
                  {category}
                  <span
                    className={
                      isActive
                        ? "rounded-lg bg-white/20 px-2 py-0.5 text-[10px]"
                        : "rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900"
                    }
                  >
                    {categoryCount}
                  </span>
                </Button>
              );
            })}
          </div>
        </nav>
      </header>

      <section>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">文章列表</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                当前分类：<span className="text-blue-600 dark:text-blue-400 font-bold">{activeCategory}</span> · 共 {visiblePosts.length} 篇文章
              </p>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                预计阅读总时长：<span className="text-slate-900 dark:text-white font-bold">{totalReadingMinutes}</span> 分钟
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-14 h-14 border-[3px] border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">加载文章中...</p>
            </div>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-xl font-bold">暂无文章</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">当前分类没有内容，试试切换到其他标签。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}