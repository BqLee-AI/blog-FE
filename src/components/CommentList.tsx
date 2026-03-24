import React, { useState } from 'react';
import type { Comment } from '../types';
import { CommentCard } from './CommentCard';

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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500 dark:text-gray-400">加载评论中...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        暂无评论，来发表第一条评论吧！
      </div>
    );
  }

  // 只显示顶级评论（replyTo 为 undefined）
  const topLevelComments = comments.filter(c => !c.replyTo);

  // 获取评论的回复数
  const getReplyCount = (commentId: number): number => {
    return comments.filter(c => c.replyTo === commentId).length;
  };

  return (
    <div className="space-y-4">
      {topLevelComments.map(comment => (
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
  );
};
