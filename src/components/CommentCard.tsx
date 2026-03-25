import React, { useState } from 'react';
import type { Comment } from '../types';
import { ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import { commentStore } from '../store/commentStore';
import { cn } from '../lib/utils';

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
  const currentReaction = commentStore(
    state => state.reactions[`${postId}:${comment.id}`] ?? null
  );

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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* 评论头部 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {comment.author || '匿名用户'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {createdAt}
            </p>
          </div>
          {comment.replyTo && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              回复评论 #{comment.replyTo}
            </p>
          )}
        </div>

        {/* 删除按钮 */}
        {isAdmin && (
          <div>
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                >
                  确定
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="删除评论"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 评论内容 */}
      <p className="text-gray-800 dark:text-gray-200 text-sm mb-4 whitespace-pre-wrap break-words leading-relaxed">
        {comment.content}
      </p>

      {/* 操作按钮 - 参考B站设计 */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 点赞 */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={currentReaction === 'like'}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors disabled:opacity-50',
            currentReaction === 'like'
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          )}
          title="点赞"
        >
          <span className={cn('text-base transition-transform', currentReaction === 'like' && 'scale-110')}>👍</span>
          <span>{comment.likes}</span>
        </button>

        {/* 踩 */}
        <button
          onClick={handleDislike}
          disabled={isDisliking}
          aria-pressed={currentReaction === 'dislike'}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors disabled:opacity-50',
            currentReaction === 'dislike'
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
          )}
          title="踩"
        >
          <span className={cn('text-base transition-transform', currentReaction === 'dislike' && 'scale-110')}>👎</span>
          <span>{comment.dislikes}</span>
        </button>

        {/* 回复 */}
        {onReply && (
          <button
            onClick={() => onReply(comment)}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="回复"
          >
            <ChatBubbleIcon className="w-4 h-4" />
            <span>回复</span>
          </button>
        )}

        {/* 查看回复 */}
        {!comment.replyTo && replyCount > 0 && onViewReplies && (
          <button
            onClick={() => onViewReplies(comment)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            title="查看回复"
          >
            <ChatBubbleIcon className="w-4 h-4" />
            <span>{replyCount} 条回复</span>
          </button>
        )}
      </div>
    </div>
  );
};
