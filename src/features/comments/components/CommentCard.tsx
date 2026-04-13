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
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="group relative flex gap-4 py-6 first:pt-2">
      {/* 左侧头像 */}
      <div className="shrink-0 pt-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-base font-black text-slate-500 dark:text-slate-400 shadow-sm transition-transform group-hover:rotate-12">
          {avatarLabel}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="font-bold text-[13px] text-blue-500 dark:text-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
            {displayName}
          </span>
          {comment.replyTo && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              回复 <span className="text-blue-400/80">@{comment.replyTo}</span>
            </span>
          )}
        </div>

        <div className="text-[14px] leading-relaxed text-slate-800 dark:text-slate-200 mb-3 whitespace-pre-wrap break-words">
          {comment.content}
        </div>

        {/* 底部操作行 - B站经典三键客 */}
        <div className="flex items-center gap-6 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
          <span className="text-slate-400/70">{createdAt}</span>

          <div className="flex items-center gap-4">
            <button
              onClick={() => !isLiking && onLike?.(postId, comment.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-blue-500",
                currentReaction === 'like' && "text-blue-500"
              )}
            >
              <span className="text-base">👍</span>
              <span className={comment.likes > 0 ? "" : "hidden"}>{comment.likes}</span>
            </button>

            <button
              onClick={() => !isDisliking && onDislike?.(postId, comment.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-red-500",
                currentReaction === 'dislike' && "text-red-500"
              )}
            >
              <span className="text-base">👎</span>
            </button>

            <button
              onClick={() => onReply?.(comment)}
              className="hover:text-blue-500 transition-colors"
            >
              回复
            </button>
            
            {!comment.replyTo && replyCount > 0 && onViewReplies && (
              <button
                onClick={() => onViewReplies(comment)}
                className="text-blue-500/80 hover:text-blue-500 transition-colors bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md"
              >
                查看 {replyCount} 条回复
              </button>
            )}

            {isAdmin && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ml-2"
              >
                删除
              </button>
            )}
          </div>
        </div>

        {/* 删除确认提示 */}
        {showDeleteConfirm && (
          <div className="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs text-red-500 font-bold">坚持删除该评论吗？</span>
            <button onClick={() => { onDelete?.(comment.id); setIsDeleting(true); }} disabled={isDeleting} className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-md hover:bg-red-600">确定</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">取消</button>
          </div>
        )}
      </div>
    </div>
  );
};
