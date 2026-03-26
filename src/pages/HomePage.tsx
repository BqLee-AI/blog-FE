import { useEffect } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { usePostStore } from "@/store/postStore";

export default function HomePage() {
  const { posts, isLoading, fetchPosts } = usePostStore();

  // 页面加载时获取文章列表
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      {/* 页面标题 */}
      <header className="mb-12">
        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase mb-2">
          欢迎来到
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          我的个人博客
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          分享技术经验，记录学习笔记
        </p>
      </header>

      {/* 文章列表 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">最新文章</h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载文章中...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
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


