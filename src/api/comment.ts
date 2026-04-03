import apiClient from './apiClient';
import type{ Comment, CommentListResponse } from '../types/comment';

// 定义分页参数
interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 获取文章的评论列表
 * @param postId 文章ID
 * @param params 分页参数
 * @returns 评论列表和总数
 */
export const getCommentsByPost = async (
  postId: number | string,
  params?: PaginationParams
): Promise<CommentListResponse> => {
  try {
    const response = await apiClient.get(`/posts/${postId}/comments`, { params });
    return response.data;
  } catch (error) {
    console.error(`获取文章评论失败 (Post ID: ${postId}):`, error);
    throw error;
  }
};

/**
 * 发表评论
 * @param commentData 评论数据
 * @returns 创建的评论信息
 */
export const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'replyCount'>): Promise<Comment> => {
  try {
    const response = await apiClient.post<Comment>('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('发表评论失败:', error);
    throw error;
  }
};

/**
 * 回复评论
 * @param commentId 被回复的评论ID
 * @param content 回复内容
 * @returns 创建的回复信息
 */
export const replyToComment = async (commentId: number | string, content: string): Promise<Comment> => {
  try {
    const response = await apiClient.post<Comment>(`/comments/${commentId}/reply`, { content });
    return response.data;
  } catch (error) {
    console.error(`回复评论失败 (Comment ID: ${commentId}):`, error);
    throw error;
  }
};

/**
 * 删除评论
 * @param commentId 评论ID
 * @returns 是否删除成功
 */
export const deleteComment = async (commentId: number | string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data.success;
  } catch (error) {
    console.error(`删除评论失败 (Comment ID: ${commentId}):`, error);
    throw error;
  }
};

/**
 * 点赞评论
 * @param commentId 评论ID
 * @returns 更新后的评论信息
 */
export const likeComment = async (commentId: number | string): Promise<Comment> => {
  try {
    const response = await apiClient.patch<Comment>(`/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error(`点赞评论失败 (Comment ID: ${commentId}):`, error);
    throw error;
  }
};