import { create } from "zustand";
import type { Post } from "../types";
import { mockPosts } from "../assets/mockPosts";

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
  fetchPosts: () => void;
  fetchPostById: (id: number) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, post: Partial<Post>) => void;
  deletePost: (id: number) => void;
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

  // 获取所有文章（模拟 API 调用）
  fetchPosts: () => {
    set({ isLoading: true, error: null });
    try {
      // 模拟网络延迟
      setTimeout(() => {
        set({ posts: mockPosts, isLoading: false });
      }, 300);
    } catch (err) {
      set({ error: "获取文章列表失败", isLoading: false });
    }
  },

  // 根据 ID 获取单个文章
  fetchPostById: (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const post = mockPosts.find((p) => p.id === id);
      setTimeout(() => {
        if (post) {
          set({ currentPost: post, isLoading: false });
        } else {
          set({ error: "文章不存在", isLoading: false });
        }
      }, 300);
    } catch (err) {
      set({ error: "获取文章失败", isLoading: false });
    }
  },

  // 添加新文章（模拟）
  addPost: (post: Post) => {
    set((state) => ({
      posts: [...state.posts, post],
    }));
  },

  // 更新文章（模拟）
  updatePost: (id: number, updates: Partial<Post>) => {
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentPost:
        state.currentPost?.id === id
          ? { ...state.currentPost, ...updates }
          : state.currentPost,
    }));
  },

  // 删除文章（模拟）
  deletePost: (id: number) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },

  // 清除错误信息
  clearError: () => {
    set({ error: null });
  },
}));
