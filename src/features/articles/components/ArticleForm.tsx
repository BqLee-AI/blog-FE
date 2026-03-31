import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/types";
import { TrashIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleFormProps {
  initialData?: Post;
  onSubmit: (data: Post) => void;
  isLoading?: boolean;
}

export default function ArticleForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ArticleFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Post>({
    id: initialData?.id || Math.floor(Math.random() * 10000),
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
    author: initialData?.author || "",
    createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "标题不能为空";
    }
    if (!formData.summary.trim()) {
      newErrors.summary = "摘要不能为空";
    }
    if (!formData.content?.trim()) {
      newErrors.content = "内容不能为空";
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "至少需要一个标签";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // 删除标签
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // 清除该字段的错误
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <Card className="transition-colors">
        <CardContent className="p-8">
        {/* 标题 */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            文章标题 <span className="text-red-600">*</span>
          </label>
          <Input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="输入文章标题"
            className={errors.title ? "border-red-500 focus-visible:ring-red-500" : undefined}
          />
          {errors.title && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* 作者 */}
        <div className="mb-6">
          <label htmlFor="author" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            作者
          </label>
          <Input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="输入作者名称"
          />
        </div>

        {/* 摘要 */}
        <div className="mb-6">
          <label htmlFor="summary" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            摘要 <span className="text-red-600">*</span>
          </label>
          <Textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            placeholder="输入文章摘要（简短描述）"
            rows={3}
            className={errors.summary ? "border-red-500 focus-visible:ring-red-500" : undefined}
          />
          {errors.summary && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.summary}</p>
          )}
        </div>

        {/* 内容 */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            文章内容 <span className="text-red-600">*</span>
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="输入文章内容（支持 HTML）"
            rows={12}
            className={`font-mono text-sm ${errors.content ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.content && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* 标签输入 */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            标签 <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="输入标签后按 Enter 或点击添加"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              className="gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              添加
            </Button>
          </div>

          {/* 标签列表 */}
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <span className="text-sm font-medium">{tag}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  variant="ghost"
                  className="h-auto p-0 text-blue-600 hover:bg-transparent hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </Badge>
            ))}
          </div>
          {errors.tags && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.tags}</p>
          )}
        </div>

        {/* 发布日期 */}
        <div className="mb-8">
          <label htmlFor="createdAt" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            发布日期
          </label>
          <Input
            id="createdAt"
            type="date"
            name="createdAt"
            value={formData.createdAt || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3"
          >
            {isLoading ? "保存中..." : initialData ? "更新文章" : "发布文章"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6 py-3"
          >
            取消
          </Button>
        </div>
        </CardContent>
      </Card>
    </form>
  );
}
