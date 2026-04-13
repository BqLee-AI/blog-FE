import React, { useState } from 'react';
import type { Comment } from '@/types';
import { FiMessageSquare, FiTrash2, FiThumbsUp, FiThumbsDown, FiMoreHorizontal } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { CommentForm } from './CommentForm';

interface CommentCardProps {
  comment: Comment;
  postId: number;
  replyCount?: number;
  isAdmin?: boolean;
  repliesPreview?: Comment[];
  isReplying?: boolean;
  onReply?: (comment: Comment) => void;
  onLike?: (postId: number, commentId: number) => Promise<void>;
  onDislike?: (postId: number, commentId: number) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onViewReplies?: (comment: Comment) => void;
  onCancelReply?: () => void;
  onSubmitReply?: (commentData: any) => Promise<void>;
}

/**
 * 评论卡片组件 - 深度定制 B 站交互体验
 */
export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  replyCount = 0,
  isAdmin = false,
  repliesPreview = [],
  isReplying = false,
  onReply,
  onLike,
  onDislike,
  onDelete,
  onViewReplies,
  onCancelReply,
  onSubmitReply,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    <div className="group relative flex gap-4 py-5 first:pt-2 transition-all">
      {/* 左侧头像 */}
      <div className="shrink-0 pt-1 cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-base font-black text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm transition-transform hover:scale-105">
          {avatarLabel}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="font-bold text-[13px] text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer">
            {displayName}
          </span>
          <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-[9px] font-black text-orange-600 dark:text-orange-400 rounded uppercase tracking-tighter">LV{Math.floor(Math.random() * 5) + 1}</span>
        </div>

        <div className="text-[14px] leading-relaxed text-slate-800 dark:text-slate-200 mb-3 whitespace-pre-wrap break-words">
          {comment.content}
        </div>

        {/* 底部操作行 */}
        <div className="flex items-center gap-6 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
          <span className="text-slate-400/70">{createdAt}</span>

          <div className="flex items-center gap-5">
            <button
              onClick={() => onLike?.(postId, comment.id)}
              className={cn(
                "flex items-center gap-1 transition-all cursor-pointer hover:text-blue-500",
                currentReaction === 'like' && "text-blue-500 scale-110"
              )}
            >
              <FiThumbsUp className={cn("text-base", currentReaction === 'like' && "fill-current")} />
              <span className={comment.likes > 0 ? "font-bold" : "hidden"}>{comment.likes}</span>
            </button>

            <button
              onClick={() => onDislike?.(postId, comment.id)}
              className={cn(
                "flex items-center gap-1 transition-all cursor-pointer hover:text-red-400",
                currentReaction === 'dislike' && "text-red-400 scale-110"
              )}
            >
              <FiThumbsDown className={cn("text-base", currentReaction === 'dislike' && "fill-current")} />
            </button>

            <button
              onClick={() => onReply?.(comment)}
              className="hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <FiMessageSquare className="text-sm" />
              回复
            </button>

            {isAdmin && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ml-2 cursor-pointer"
              >
                <FiTrash2 />
              </button>
            )}
            
            <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-500 cursor-pointer">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        {/* 就地回复框 */}
        {isReplying && onSubmitReply && (
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 animate-in slide-in-from-top-2">
            <CommentForm
              postId={postId}
              replyTo={comment}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              isNested={true}
            />
          </div>
        )}

        {/* 子评论预览区域 - 深度复刻 B 站样式 */}
        {!isReplying && repliesPreview.length > 0 && (
          <div className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-100/50 dark:border-slate-800/30">
            {repliesPreview.map((reply) => (
              <div key={reply.id} className="text-[13px] leading-relaxed group/reply cursor-pointer" onClick={() => onViewReplies?.(comment)}>
                <span className="font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 transition-colors">
                  {reply.author}
                </span>
                <span className="text-slate-700 dark:text-slate-300 mx-1.5">:</span>
                <span className="text-slate-600 dark:text-slate-400 group-hover/reply:text-slate-900 dark:group-hover/reply:text-slate-200 transition-colors break-words">
                  {reply.content}
                </span>
              </div>
            ))}
            
            {replyCount > 0 && (
              <div 
                onClick={() => onViewReplies?.(comment)}
                className="text-[12px] text-slate-400 hover:text-blue-500 transition-all flex items-center gap-1.5 pt-1 cursor-pointer font-bold group/more"
              >
                <span className="group-hover/more:translate-x-0.5 transition-transform">共 {replyCount} 条回复 &gt;</span>
              </div>
            )}
          </div>
        )}

        {/* 删除确认提示 */}
        {showDeleteConfirm && (
          <div className="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs text-red-500 font-bold">确定删除吗？</span>
            <button onClick={() => { onDelete?.(comment.id); setShowDeleteConfirm(false); }} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 cursor-pointer shadow-lg shadow-red-500/20">确定</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">取消</button>
          </div>
        )}
      </div>
    </div>
  );
};
