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
    <div>
      <header className="mb-8 space-y-5 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.35em] uppercase mb-3">
              全部内容
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              查看所有文章
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-3xl leading-8">
              浏览博客中的全部文章，按分类筛选你感兴趣的内容，并快速了解当前分类的内容密度。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center md:min-w-[320px]">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">总文章</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">当前分类</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeCategory === "全部" ? categories.length - 1 : 1}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">阅读总时长</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReadingMinutes} 分钟</p>
            </div>
          </div>
        </div>

        <nav className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              const categoryCount = category === "全部" ? posts.length : categoryCounts.get(category) ?? 0;

              return (
                <Button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  variant="ghost"
                  className={
                    isActive
                      ? "inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-600 hover:text-white"
                      : "inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-900 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  }
                >
                  {category}
                  <span
                    className={
                      isActive
                        ? "rounded-full bg-white/20 px-2 py-0.5 text-xs"
                        : "rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-300"
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
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">文章列表</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              当前分类：{activeCategory} · 共 {visiblePosts.length} 篇文章
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              预计阅读总时长：{totalReadingMinutes} 分钟
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
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">当前分类没有内容，试试切换到其他标签。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}