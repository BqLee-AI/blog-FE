import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../store/postStore";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPost, fetchPostById, isLoading, error, clearError } =
    usePostStore();

  useEffect(() => {
    if (id) {
      fetchPostById(Number(id));
    }
  }, [id, fetchPostById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {error || "文章不存在"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">无法找到您要查看的文章</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
        {error && (
          <button
            onClick={clearError}
            className="ml-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            清除错误
          </button>
        )}
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* 返回按钮 */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        返回首页
      </Link>

      {/* 文章标题和元信息 */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {currentPost.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {currentPost.author && (
            <span>作者: {currentPost.author}</span>
          )}
          {currentPost.createdAt && (
            <span>发布: {new Date(currentPost.createdAt).toLocaleDateString()}</span>
          )}
        </div>
      </header>

      {/* 摘要 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-4 mb-8 rounded-r">
        <p className="text-gray-700 dark:text-gray-300 text-lg">{currentPost.summary}</p>
      </div>

      {/* 标签 */}
      {currentPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {currentPost.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none mb-12">
        {currentPost.content ? (
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
            <p>暂无详细内容</p>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <div className="border-t dark:border-gray-700 pt-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
        >
          ← 返回文章列表
        </Link>
      </div>
    </article>
  );
}
