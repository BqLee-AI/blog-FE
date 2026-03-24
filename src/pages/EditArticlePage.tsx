import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { usePostStore } from "../store/postStore";
import type { Post } from "../types";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPost, fetchPostById, updatePost, isLoading, error } =
    usePostStore();

  useEffect(() => {
    if (id) {
      fetchPostById(Number(id));
    }
  }, [id, fetchPostById]);

  const handleSubmit = (data: Post) => {
    if (!id) return;

    // 模拟保存（实际开发中这里应该调用后端 API）
    console.log("更新文章:", data);
    updatePost(Number(id), data);

    // 显示成功提示
    alert("文章更新成功！");

    // 返回管理后台
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || "文章不存在"}
        </h2>
        <p className="text-gray-600 mb-6">无法找到您要编辑的文章</p>
        <button
          onClick={() => navigate("/admin")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回后台管理
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">编辑文章</h1>
        <p className="text-gray-600 mt-2">修改文章内容并保存更改</p>
      </div>

      <ArticleForm initialData={currentPost} onSubmit={handleSubmit} />
    </div>
  );
}
