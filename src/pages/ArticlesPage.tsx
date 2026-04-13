import { useEffect, useMemo, useState } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { usePostStore } from "@/store/postStore";
import { estimateReadingTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-20 space-y-12">
        <div className="relative group">
          {/* 装饰性背景 */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Knowledge Base</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                探索<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">深度洞察</span><br />
                发现技术之美
              </h1>
              
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
                在这里，我们分享关于前端架构、AI 驱动开发以及设计工程的深度思考。通过分类筛选，精准触达你感兴趣的知识领域。
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:min-w-[450px]">
              {[
                { label: "全部文章", value: posts.length, icon: "📚" },
                { label: "当前筛选", value: visiblePosts.length, icon: "🏷️" },
                { label: "阅读时长", value: totalReadingMinutes, unit: "Min", icon: "⌛" },
              ].map((stat, i) => (
                <div key={i} className="group/stat relative p-6 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-100 dark:shadow-none hover:border-blue-500/30 transition-all">
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                    {stat.unit && <span className="text-[10px] font-bold text-slate-400">{stat.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav className="sticky top-4 z-50 py-3 px-4 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/5 shadow-2xl shadow-blue-500/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap",
                    isActive 
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-lg scale-105" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {category}
                  <span className={cn(
                    "ml-2 text-[10px] opacity-50",
                    isActive ? "text-blue-300 dark:text-blue-600" : ""
                  )}>
                    {category === "全部" ? posts.length : categoryCounts.get(category) ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <section className="relative">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full" />
              文章精选
            </h2>
            <p className="text-sm text-slate-400 font-bold ml-11">
              {activeCategory} · 展示 {visiblePosts.length} 篇
            </p>
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