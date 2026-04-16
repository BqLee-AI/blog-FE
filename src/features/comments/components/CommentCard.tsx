import React, { useState } from 'react';
import type { Comment } from '@/types';
import { ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import { cn, formatArticleDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CommentForm } from './CommentForm';

interface CommentCardProps {
  comment: Comment;
  postId: number;
  replyCount?: number;
  repliesPreview?: Comment[];
  isReplying?: boolean;
  isAdmin?: boolean;
  onReply?: (comment: Comment) => void;
  onCancelReply?: () => void;
  onSubmitReply?: (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => Promise<void>;
  onLike?: (postId: number, commentId: number) => Promise<void>;
  onDislike?: (postId: number, commentId: number) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onViewReplies?: (comment: Comment) => void;
}

/**
 * 评论卡片组件 - 参考B站评论设计
 * 显示单条评论及操作按钮，集成就地回复表单
 */
export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  replyCount = 0,
  repliesPreview = [],
  isReplying = false,
  isAdmin = false,
  onReply,
  onCancelReply,
  onSubmitReply,
  onLike,
  onDislike,
  onDelete,
  onViewReplies,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const currentReaction = comment.currentReaction ?? null;
  const displayName = comment.author || '匿名用户';
  const avatarLabel = displayName.trim().charAt(0).toUpperCase() || 'U';
  const createdAt = formatArticleDate(comment.createdAt);

  // 基于作者名称生成确定性等级 (LV1-LV6)
  const getLevel = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 6) + 1;
  };

  const level = getLevel(displayName);

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

  const handleReplySubmit = async (data: any) => {
    if (!onSubmitReply) return;
    setIsSubmittingReply(true);
    try {
      await onSubmitReply(data);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className={cn(
      "group py-6 transition-all duration-300",
      Boolean(comment.replyTo) && "pl-4 md:pl-10"
    )}>
      {/* 评论主体 */}
      <div className="flex gap-4">
        {/* 头像 */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/10">
            {avatarLabel}
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-black text-slate-900 dark:text-white hover:text-blue-500 transition-colors cursor-pointer">
              {displayName}
            </span>
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-400/10 text-[9px] font-black text-blue-500 border border-blue-200/50 dark:border-blue-400/20">
              LV{level}
            </span>
            {comment.replyTo && (
              <span className="text-xs text-slate-400 font-bold mx-1">回复了评论</span>
            )}
          </div>

          <div className="text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-200 mb-3 whitespace-pre-wrap break-words">
            {comment.content}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-400 dark:text-slate-500 font-medium">{createdAt}</span>
            
            <div className="flex items-center gap-4">
              {/* 点赞 */}
              <button 
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  "flex items-center gap-1 transition-all hover:scale-105 active:scale-95 disabled:opacity-50",
                  currentReaction === 'like' ? "text-blue-500 scale-110" : "text-slate-400 hover:text-blue-500"
                )}
              >
                <span className="text-[13px]">👍</span>
                <span>{comment.likes || 0}</span>
              </button>

              {/* 踩 */}
              <button 
                onClick={handleDislike}
                disabled={isDisliking}
                className={cn(
                  "flex items-center gap-1 transition-all hover:scale-105 active:scale-95 disabled:opacity-50",
                  currentReaction === 'dislike' ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500"
                )}
              >
                <span className="text-[13px]">👎</span>
              </button>

              {/* 回复按钮 */}
              <button 
                onClick={() => onReply?.(comment)}
                className={cn(
                  "text-slate-400 hover:text-blue-500 transition-colors",
                  isReplying && "text-blue-500"
                )}
              >
                回复
              </button>

              {/* 管理员删除 */}
              {isAdmin && (
                <div className="relative">
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 hover:underline">确认</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="text-slate-400">取消</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowDeleteConfirm(true)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <TrashIcon />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 就地回复表单 */}
          {isReplying && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 animate-in slide-in-from-top-4 duration-300">
              <CommentForm
                postId={postId}
                replyTo={comment}
                isNested={true}
                isLoading={isSubmittingReply}
                onSubmit={handleReplySubmit}
                onCancel={onCancelReply}
              />
            </div>
          )}

          {/* 回复预览 - 仅对主评论显示 */}
          {!comment.replyTo && repliesPreview.length > 0 && (
            <div className="mt-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/20">
              {repliesPreview.map((reply) => (
                <div key={reply.id} className="text-[13px] leading-relaxed">
                  <span className="font-bold text-blue-500 dark:text-blue-400">{reply.author || '匿名用户'}</span>
                  <span className="mx-2 text-slate-700 dark:text-slate-300">{reply.content}</span>
                </div>
              ))}
              {replyCount > repliesPreview.length && onViewReplies && (
                <button 
                  onClick={() => onViewReplies(comment)}
                  className="text-[12px] font-black text-blue-500 hover:text-blue-600 transition-colors mt-2"
                >
                  共 {replyCount} 条回复，点击查看全文 →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
