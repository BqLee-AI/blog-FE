import React, { useState } from 'react';
import { commentStore } from '@/store/commentStore';
import type { Comment } from '@/types';
import { TrashIcon, ChatBubbleIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * 评论管理组件 - 在管理后台中显示
 */
export const CommentManagement: React.FC = () => {
  const { comments: allComments, isLoading, deleteComment, updateComment } = commentStore();
  const [selectedPostId, setSelectedPostId] = useState<number | 'all'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [updatingCommentId, setUpdatingCommentId] = useState<number | null>(null);

  // 获取所有评论
  const allCommentsList = Array.from(allComments.values()).flat();

  // 按选定的文章筛选评论
  const filteredComments =
    selectedPostId === 'all'
      ? allCommentsList
      : allCommentsList.filter(c => c.postId === selectedPostId);

  const reviewFilteredComments =
    reviewFilter === 'all'
      ? filteredComments
      : filteredComments.filter((comment) =>
          reviewFilter === 'approved' ? comment.isApproved : !comment.isApproved
        );

  // 获取所有文章的 ID
  const postIds = Array.from(allComments.keys()).sort((a, b) => a - b);
  const approvedCount = allCommentsList.filter((comment) => comment.isApproved).length;
  const pendingCount = allCommentsList.filter((comment) => !comment.isApproved).length;

  // 处理删除评论
  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!window.confirm('确定要删除这条评论及其回复吗？')) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      await deleteComment(postId, commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('删除失败，请稍后重试');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleReviewAction = async (postId: number, commentId: number, isApproved: boolean) => {
    setUpdatingCommentId(commentId);
    try {
      await updateComment(postId, commentId, { isApproved });
    } catch (err) {
      console.error('Failed to update comment review state:', err);
      alert(isApproved ? '通过失败，请稍后重试' : '驳回失败，请稍后重试');
    } finally {
      setUpdatingCommentId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ChatBubbleIcon className="w-7 h-7" />
          评论管理
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          查看和管理所有文章的评论
        </p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            总评论数
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {allCommentsList.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            有评论的文章
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {postIds.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            已通过
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {approvedCount}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            待审核
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          按文章筛选
        </label>
        <select
          value={selectedPostId}
          onChange={e => setSelectedPostId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">所有文章</option>
          {postIds.map(id => (
            <option key={id} value={id}>
              文章 #{id} ({allComments.get(id)?.length || 0} 条评论)
            </option>
          ))}
        </select>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant={reviewFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setReviewFilter('all')}>
              全部
            </Button>
            <Button type="button" variant={reviewFilter === 'approved' ? 'default' : 'outline'} size="sm" onClick={() => setReviewFilter('approved')}>
              已通过
            </Button>
            <Button type="button" variant={reviewFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setReviewFilter('pending')}>
              待审核
            </Button>
          </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            加载中...
          </div>
        ) : reviewFilteredComments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {allCommentsList.length === 0
              ? '暂无评论'
              : reviewFilter === 'pending'
                ? '当前没有待审核评论'
                : selectedPostId === 'all'
                  ? '当前筛选下暂无评论'
                  : '该文章暂无评论'}
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {reviewFilteredComments.map(comment => (
              <div
                key={`${comment.postId}-${comment.id}`}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <Badge variant={comment.isApproved ? 'secondary' : 'destructive'}>
                        {comment.isApproved ? '已通过' : '待审核'}
                      </Badge>
                      {comment.email && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {comment.email}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      文章 #{comment.postId}
                      {comment.replyTo && ` • 回复评论 #{comment.replyTo}`}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap wrap-break-word">
                      {comment.content}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      onClick={() => handleReviewAction(comment.postId, comment.id, true)}
                      disabled={updatingCommentId === comment.id || comment.isApproved}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      通过
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleReviewAction(comment.postId, comment.id, false)}
                      disabled={updatingCommentId === comment.id || !comment.isApproved}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Cross2Icon className="w-4 h-4" />
                      驳回
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDeleteComment(comment.postId, comment.id)}
                      disabled={deletingCommentId === comment.id}
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="删除评论"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
