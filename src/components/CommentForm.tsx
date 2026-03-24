import React, { useState } from 'react';
import type { Comment } from '../types';

interface CommentFormProps {
  postId: number;
  replyTo?: Comment; // 要回复的评论
  isLoading?: boolean;
  onSubmit: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => Promise<void>;
  onCancel?: () => void;
}

interface FormError {
  content?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  replyTo,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<FormError>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    if (!content.trim()) {
      newErrors.content = '请输入评论内容';
    } else if (content.trim().length < 2) {
      newErrors.content = '评论内容至少需要2个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'> = {
        postId,
        content: content.trim(),
        isApproved: true,
        replyTo: replyTo?.id,
      };

      await onSubmit(commentData);

      // 清空表单
      setContent('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发表评论失败，请稍后重试';
      setSubmitError(errorMessage);
    }
  };

  const placeholder = replyTo 
    ? `回复 ${replyTo.author || '用户'} 的评论`
    : '请在评论区留下见解或问题...';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* 错误提示 */}
      {submitError && (
        <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded text-sm">
          {submitError}
        </div>
      )}

      {/* 评论内容字段 */}
      <div className="mb-3">
        <textarea
          value={content}
          onChange={e => {
            setContent(e.target.value);
            if (errors.content) setErrors({});
          }}
          placeholder={placeholder}
          disabled={isLoading}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:border-gray-600 resize-none text-sm ${
            errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.content}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {content.length} 字符
        </p>
      </div>

      {/* 按钮 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-gray-400 transition-colors font-medium"
        >
          {isLoading ? '发送中...' : '发表评论'}
        </button>
        {replyTo && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 disabled:bg-gray-200 transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
};
