import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleForm from "@/features/articles/components/ArticleForm";
import { articleApi } from "@/api/article";
import type { Post } from "@/types";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Post) => {
    setIsSubmitting(true);

    try {
      await articleApi.create({
        title: data.title,
        content: data.content ?? "",
        summary: data.summary,
      });

      alert("文章发布成功！");
      navigate("/admin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "文章发布失败";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-600">创建新文章</h1>
        <p className="text-gray-600 mt-2">填写下面的表单发布一篇新文章</p>
      </div>

      <ArticleForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
