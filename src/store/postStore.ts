import { create } from "zustand";
import type { Post } from "@/types/post";
import { getPosts, getPostById, createPost, updatePost as updatePostApi, deletePost as deletePostApi } from "@/api/post";
import { mockPosts } from "@/assets/mockPosts";

/**
 * 文章 Store 状态接口
 */
type PostStoreState = {
  // 状态
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchPosts: () => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  clearError: () => void;
};

/**
 * 文章全局状态管理
 * 使用 Zustand 实现轻量级状态管理
 * 
 * 典型用法：
 * const { posts, fetchPosts } = usePostStore();
 */
export const usePostStore = create<PostStoreState>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  // 获取所有文章
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPosts();
      set({ posts: response.items || [], isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "获取文章列表失败";
      console.error("fetchPosts error:", err);
      // Fallback to mock data when API fails
      set({ posts: mockPosts, error: errorMessage, isLoading: false });
    }
  },

  // 根据 ID 获取单个文章
  fetchPostById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const post = await getPostById(id);
      set({ currentPost: post, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "获取文章失败";
      console.error("fetchPostById error:", err);
      // Fallback to mock data when API fails
      const fallbackPost = mockPosts.find((p) => p.id === id);
      if (fallbackPost) {
        set({ currentPost: fallbackPost, error: errorMessage, isLoading: false });
      } else {
        set({ error: errorMessage, isLoading: false });
      }
    }
  },

  // 添加新文章
  addPost: async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await createPost(post);
      set((state) => ({
        posts: [...state.posts, newPost],
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "创建文章失败";
      console.error("addPost error:", err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // 更新文章
  updatePost: async (id: number, updates: Partial<Post>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPost = await updatePostApi(id, updates);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        currentPost:
          state.currentPost?.id === id ? updatedPost : state.currentPost,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新文章失败";
      console.error("updatePost error:", err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // 删除文章
  deletePost: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await deletePostApi(id);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost:
          state.currentPost?.id === id ? null : state.currentPost,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "删除文章失败";
      console.error("deletePost error:", err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // 清除错误信息
  clearError: () => {
    set({ error: null });
  },
}));
