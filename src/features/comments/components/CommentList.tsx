import React from 'react';
import type { Comment } from '@/types';
import { CommentCard } from "@/features/comments/components/CommentCard";

interface CommentListProps {
  postId: number;
  comments: Comment[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onReply?: (comment: Comment) => void;
  onDelete?: (commentId: number) => Promise<void>;
  onLike?: (postId: number, commentId: number) => Promise<void>;
  onDislike?: (postId: number, commentId: number) => Promise<void>;
  onViewReplies?: (comment: Comment) => void;
  onSubmitReply?: (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  comments,
  isLoading = false,
  isAdmin = false,
  onReply,
  onDelete,
  onLike,
  onDislike,
  onViewReplies,
  onSubmitReply,
}) => {
  const [activeReplyId, setActiveReplyId] = React.useState<number | null>(null);
  const topLevelComments = comments.filter((comment) => !comment.replyTo);
  const totalCount = comments.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-slate-400 dark:text-slate-500 animate-pulse">
        加载评论中...
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="py-20 text-center text-slate-400 dark:text-slate-500 border-y border-slate-100 dark:border-slate-800/50 my-8">
        <p className="text-sm font-bold">暂无评论</p>
        <p className="mt-2 text-xs opacity-70">来发表第一条评论吧，让讨论活起来。</p>
      </div>
    );
  }

  const getSubReplies = (commentId: number) => {
    return comments.filter((comment) => comment.replyTo === commentId);
  };

  const handleReplyClick = (comment: Comment) => {
    setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
    onReply?.(comment);
  };

  const handleSubmitReply = async (commentData: any) => {
    if (onReply) {
       // 这里实际上由上层 ArticleDetailPage 处理添加逻辑
       // 我们只需确保添加成功后关闭回复框
       const originalOnReply = onReply;
       // 注意：这里我们其实是复用了 Page 层的 handleAddComment
       // 为了简洁，我们假设上层会处理好状态更新
    }
    setActiveReplyId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-6 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          评论
          <span className="text-sm font-normal text-slate-400 dark:text-slate-500">{totalCount}</span>
        </h3>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <button className="text-slate-900 dark:text-white border-b-2 border-blue-500 pb-4 -mb-4.5 cursor-pointer">按时间排序</button>
          <button className="hover:text-blue-500 transition-colors cursor-pointer">按热度排序</button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {topLevelComments.map((comment) => {
          const subReplies = getSubReplies(comment.id);
          return (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              replyCount={subReplies.length}
              repliesPreview={subReplies.slice(0, 2)}
              isReplying={activeReplyId === comment.id}
              isAdmin={isAdmin}
              onReply={() => handleReplyClick(comment)}
              onCancelReply={() => setActiveReplyId(null)}
              onSubmitReply={async (data) => {
                await onSubmitReply?.(data);
                setActiveReplyId(null);
              }}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
              onViewReplies={onViewReplies}
            />
          );
        })}
      </div>
    </div>
  );
};
