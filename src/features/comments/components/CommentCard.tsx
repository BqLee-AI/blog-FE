import React, { useState } from 'react';
import type { Comment } from '@/types';
import { ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CommentCardProps {
  comment: Comment;
  postId: number;
  replyCount?: number;
  isAdmin?: boolean;
  onReply?: (comment: Comment) => void;
  onLike?: (postId: number, commentId: number) => Promise<void>;
  onDislike?: (postId: number, commentId: number) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onViewReplies?: (comment: Comment) => void;
}

/**
 * 评论卡片组件 - 参考B站评论设计
 * 显示单条评论及操作按钮
 */
export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  replyCount = 0,
  isAdmin = false,
  onReply,
  onLike,
  onDislike,
  onDelete,
  onViewReplies,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentReaction = comment.currentReaction ?? null;
  const displayName = comment.author || '匿名用户';
  const avatarLabel = displayName.trim().charAt(0).toUpperCase() || 'U';

  const createdAt = new Date(comment.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    setIsLiking(true);
    try {
      await onLike(postId, comment.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (isDisliking || !onDislike) return;
    setIsDisliking(true);
    try {
      await onDislike(postId, comment.id);
    } finally {
      setIsDisliking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/90 dark:hover:border-blue-800/60">
      {/* 评论头部 */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
          {avatarLabel}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-gray-900 dark:text-white text-sm">
              {displayName}
            </p>
            {comment.replyTo ? (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                回复 #{comment.replyTo}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                主评论
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {createdAt}
          </p>
        </div>

        {/* 删除按钮 */}
        {isAdmin && (
          <div className="shrink-0">
            {showDeleteConfirm ? (
              <div className="flex gap-2 rounded-full bg-gray-50 p-1 dark:bg-gray-700/70">
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 rounded-full bg-red-500 px-3 text-xs font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  确定
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  variant="outline"
                  className="h-8 rounded-full px-3 text-xs font-medium"
                >
                  取消
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                variant="ghost"
                className="rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="删除评论"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 评论内容 */}
      <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-800 shadow-inner dark:bg-gray-900/70 dark:text-gray-200">
        <p className="whitespace-pre-wrap break-words">{comment.content}</p>
      </div>

      {/* 操作按钮 - 参考B站设计 */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700/80">
        {/* 点赞 */}
        <Button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={currentReaction === 'like'}
          variant="ghost"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50',
            currentReaction === 'like'
              ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300'
          )}
          title="点赞"
        >
          <span className={cn('text-base transition-transform', currentReaction === 'like' && 'scale-110')}>👍</span>
          <span>{comment.likes}</span>
        </Button>

        {/* 踩 */}
        <Button
          type="button"
          onClick={handleDislike}
          disabled={isDisliking}
          aria-pressed={currentReaction === 'dislike'}
          variant="ghost"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50',
            currentReaction === 'dislike'
              ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800'
              : 'text-gray-600 hover:bg-red-50 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
          )}
          title="踩"
        >
          <span className={cn('text-base transition-transform', currentReaction === 'dislike' && 'scale-110')}>👎</span>
          <span>{comment.dislikes}</span>
        </Button>

        {/* 回复 */}
        {onReply && (
          <Button
            type="button"
            onClick={() => onReply(comment)}
            variant="ghost"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300"
            title="回复"
          >
            <ChatBubbleIcon className="w-4 h-4" />
            <span>回复</span>
          </Button>
        )}

        {/* 查看回复 */}
        {!comment.replyTo && replyCount > 0 && onViewReplies && (
          <Button
            type="button"
            onClick={() => onViewReplies(comment)}
            variant="ghost"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/35"
            title="查看回复"
          >
            <ChatBubbleIcon className="w-4 h-4" />
            <span>{replyCount} 条回复</span>
          </Button>
        )}
      </div>
    </div>
  );
};
