import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { usePostStore } from "../store/postStore";
import type { Post } from "../types";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const { addPost } = usePostStore();

  const handleSubmit = (data: Post) => {
    // 模拟保存（实际开发中这里应该调用后端 API）
    console.log("新建文章:", data);
    addPost(data);

    // 显示成功提示
    alert("文章发布成功！");

    // 返回管理后台
    navigate("/admin");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-600">创建新文章</h1>
        <p className="text-gray-600 mt-2">填写下面的表单发布一篇新文章</p>
      </div>

      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
