import React, { useState } from 'react';
import type { Comment } from '@/types';

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

  const characterCount = content.trim().length;

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl bg-white dark:bg-gray-800/90">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-gray-700">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 dark:text-blue-300 mb-2">
            评论输入
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {replyTo ? '回复这条评论' : '写下你的看法'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            评论会直接显示在文章下方，保持简洁更容易被阅读。
          </p>
        </div>

        {replyTo && (
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            回复 {replyTo.author || '用户'}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {submitError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {submitError}
        </div>
      )}

      {/* 评论内容字段 */}
      <div className="mb-4">
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>评论内容</span>
          <span className={characterCount < 2 ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'}>
            {characterCount} 字
          </span>
        </label>
        <div
          className={`rounded-2xl border bg-white p-2 shadow-sm transition-colors dark:bg-gray-900/60 ${
            errors.content
              ? 'border-red-300 ring-1 ring-red-200 dark:border-red-700 dark:ring-red-900/40'
              : 'border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-700 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-900/30'
          }`}
        >
        <textarea
          value={content}
          onChange={e => {
            setContent(e.target.value);
            if (errors.content) setErrors({});
          }}
          placeholder={placeholder}
          disabled={isLoading}
          rows={3}
          className="min-h-[120px] w-full resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm leading-6 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
        />
        </div>
        {errors.content && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{errors.content}</p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          支持换行，尽量把观点说完整一些。
        </p>
      </div>

      {/* 按钮 */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? '发送中...' : '发表评论'}
        </button>
        {replyTo && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
};
