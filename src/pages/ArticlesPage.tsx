import { useEffect, useMemo, useState } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { usePostStore } from "@/store/postStore";
import { cn } from "@/lib/utils";
import { ProfileCard } from "@/components/ProfileCard";

export default function ArticlesPage() {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const [activeCategory, setActiveCategory] = useState("全部");

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts.length, fetchPosts]);

  // 计算所有标签及其出现次数
  const tagData = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    
    const sortedTags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tags: sortedTags, counts };
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "全部") return posts;
    return posts.filter((post) => post.tags.includes(activeCategory));
  }, [activeCategory, posts]);

  return (
    <div className="animate-fade-in pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* 左侧侧边栏 */}
        <aside className="lg:col-span-1 space-y-8">
          {/* 装饰性 Profile Card */}
          <ProfileCard />

          {/* 标签云卡片 */}
          <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-white/40 dark:border-white/5 backdrop-blur-xl p-6 shadow-xl shadow-blue-500/5">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Tags Cloud
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {tagData.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveCategory(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    activeCategory === tag
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                      : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:text-indigo-500"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 右侧主内容区 */}
        <main className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-6 ml-2 lg:ml-0">
             <div className="flex items-center gap-4">
                <span className="w-8 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                  {activeCategory === "全部" ? "Latest Articles" : `In ${activeCategory}`}
                </h2>
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Show {visiblePosts.length} Results
             </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-2 border-blue-100 dark:border-blue-900/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
              <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase text-[10px]">Preparing Articles...</p>
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 dark:text-slate-500 text-lg font-black uppercase tracking-widest">No Content Found</p>
              <button 
                onClick={() => setActiveCategory("全部")}
                className="mt-8 text-xs font-black text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
              >
                ← Back to all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}