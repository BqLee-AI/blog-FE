import React from 'react';
import type { Comment } from '@/types';
import { CommentCard } from "@/features/comments/components/CommentCard";
import { cn } from '@/lib/utils';

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
  const [sortBy, setSortBy] = React.useState<'time' | 'heat'>('time');
  
  const totalCount = comments.length;

  const getSubReplies = (commentId: number) => {
    return comments.filter((comment) => comment.replyTo === commentId);
  };

  const sortedTopLevelComments = React.useMemo(() => {
    const topLevel = comments.filter((comment) => !comment.replyTo);
    
    if (sortBy === 'time') {
      return [...topLevel].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return [...topLevel].sort((a, b) => {
        const heatA = (a.likes || 0) - (a.dislikes || 0) + (getSubReplies(a.id).length * 2);
        const heatB = (b.likes || 0) - (b.dislikes || 0) + (getSubReplies(b.id).length * 2);
        return heatB - heatA;
      });
    }
  }, [comments, sortBy]);

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

  const handleReplyClick = (comment: Comment) => {
    setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
    onReply?.(comment);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-6 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          评论
          <span className="text-sm font-normal text-slate-400 dark:text-slate-500">{totalCount}</span>
        </h3>
        <div className="flex items-center gap-6 text-[13px] font-bold text-slate-400 dark:text-slate-500 relative">
          <button 
            onClick={() => setSortBy('time')}
            className={cn(
              "transition-colors hover:text-blue-500 cursor-pointer pb-4 -mb-4.5",
              sortBy === 'time' && "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
            )}
          >
            按时间排序
          </button>
          <button 
            onClick={() => setSortBy('heat')}
            className={cn(
              "transition-colors hover:text-blue-500 cursor-pointer pb-4 -mb-4.5",
              sortBy === 'heat' && "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
            )}
          >
            按热度排序
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {sortedTopLevelComments.map((comment) => {
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
