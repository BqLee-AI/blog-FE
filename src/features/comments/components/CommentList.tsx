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
}

/**
 * 评论列表组件
 */
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
}) => {
  const topLevelComments = comments.filter((comment) => !comment.replyTo);
  const replyCount = comments.length - topLevelComments.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        加载评论中...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        <p className="text-sm font-medium">暂无评论</p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          来发表第一条评论吧，让内容区更有讨论感。
        </p>
      </div>
    );
  }

  const getReplyCount = (commentId: number): number => {
    return comments.filter((comment) => comment.replyTo === commentId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">评论列表</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {topLevelComments.length} 条主评论 · {replyCount} 条回复
          </p>
        </div>
        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          共 {comments.length} 条
        </div>
      </div>

      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            postId={postId}
            replyCount={getReplyCount(comment.id)}
            isAdmin={isAdmin}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
            onDislike={onDislike}
            onViewReplies={onViewReplies}
          />
        ))}
      </div>
    </div>
  );
};
