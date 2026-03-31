import apiClient from './index';
import type{ Post, PaginationInfo, ApiResponse, ListResponse } from '../types/post';

// 定义文章查询参数
interface PostQuery {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  authorId?: string;
  tag?: string;
}

/**
 * 获取文章列表
 * @param params 查询参数
 * @returns 文章列表和总数
 */
export const getPosts = async (params?: PostQuery): Promise<ListResponse<Post>> => {
  try {
    const response = await apiClient.get<ApiResponse<ListResponse<Post>>>('/posts', { params });
    return response.data.data;
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取单篇文章
 * @param id 文章ID
 * @returns 文章详情
 */
export const getPostById = async (id: number | string): Promise<Post> => {
  try {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`获取文章详情失败 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 创建新文章
 * @param postData 文章数据
 * @returns 创建的文章信息
 */
export const createPost = async (postData: Omit<Post, 'id' | 'author' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
  try {
    const response = await apiClient.post<ApiResponse<Post>>('/posts', postData);
    return response.data.data;
  } catch (error) {
    console.error('创建文章失败:', error);
    throw error;
  }
};

/**
 * 更新文章
 * @param id 文章ID
 * @param postData 更新的数据
 * @returns 更新后的文章信息
 */
export const updatePost = async (id: number | string, postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, postData);
    return response.data.data;
  } catch (error) {
    console.error(`更新文章失败 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 删除文章
 * @param id 文章ID
 * @returns 是否删除成功
 */
export const deletePost = async (id: number | string): Promise<boolean> => {
  try {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/posts/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`删除文章失败 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 发布文章
 * @param id 文章ID
 * @returns 更新后的文章信息
 */
export const publishPost = async (id: number | string): Promise<Post> => {
  try {
    const response = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/publish`);
    return response.data.data;
  } catch (error) {
    console.error(`发布文章失败 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 草稿文章
 * @param id 文章ID
 * @returns 更新后的文章信息
 */
export const draftPost = async (id: number | string): Promise<Post> => {
  try {
    const response = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/draft`);
    return response.data.data;
  } catch (error) {
    console.error(`草稿文章失败 (ID: ${id}):`, error);
    throw error;
  }
};