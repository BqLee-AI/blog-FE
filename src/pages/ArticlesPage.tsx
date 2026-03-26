import { useEffect, useMemo, useState } from "react";
import PostCard from "../components/PostCard";
import { usePostStore } from "../store/postStore";

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

  const visiblePosts = useMemo(() => {
    if (activeCategory === "全部") {
      return posts;
    }

    return posts.filter((post) => post.tags.includes(activeCategory));
  }, [activeCategory, posts]);

  return (
    <div>
      <header className="mb-8 space-y-4">
        <div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase mb-2">
            全部内容
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            查看所有文章
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-2">
            浏览博客中的全部文章，按分类筛选你感兴趣的内容
          </p>
        </div>

        <nav className="border-t-2 border-red-500 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap px-2 py-3">
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    isActive
                      ? "text-red-600 dark:text-red-400 font-medium text-lg border-b-2 border-red-500 pb-1"
                      : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium text-lg transition-colors pb-1"
                  }
                >
                  {category}
                </button>
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
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
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