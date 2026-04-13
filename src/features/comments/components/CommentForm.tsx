import React, { useState } from 'react';
import type { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 2) return;

    try {
      const commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'> = {
        postId,
        content: content.trim(),
        isApproved: true,
        replyTo: replyTo?.id,
      };
      await onSubmit(commentData);
      setContent('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '发表失败');
    }
  };

  const placeholder = replyTo 
    ? `回复 @${replyTo.author || '用户'}:`
    : '发一条友善的评论吧...';

  return (
    <form onSubmit={handleSubmit} className="relative group">
      {submitError && (
        <div className="mb-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs rounded-lg animate-in fade-in slide-in-from-top-1">
          {submitError}
        </div>
      )}

      <div className="relative flex gap-4">
        {/* 占位头像 */}
        <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-slate-400 font-bold border border-slate-200/50 dark:border-slate-700/50">
          ?
        </div>

        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full min-h-[85px] p-3 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:outline-none focus:border-blue-400/50 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none leading-relaxed placeholder:text-slate-400"
          />
          
          <div className="flex items-center justify-end gap-3 mt-2">
            {replyTo && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                取消
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !content.trim() || content.trim().length < 2}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/10 active:scale-95"
            >
              {isLoading ? '发送中...' : '发表评论'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
