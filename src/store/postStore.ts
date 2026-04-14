import { create } from "zustand";
import type { Post, PostStatus } from "@/types/post";
import { mockPosts } from "@/assets/mockPosts";

const STORAGE_KEY = "blog_posts";
const DEFAULT_STATUS: PostStatus = "published";

const isPostStatus = (value: unknown): value is PostStatus => {
  return value === "published" || value === "draft";
};

const normalizePost = (post: Post): Post => ({
  ...post,
  status: isPostStatus(post.status) ? post.status : DEFAULT_STATUS,
});

const seedPosts = (): Post[] =>
  mockPosts.map((post, index) =>
    normalizePost({
      ...post,
      status: index === 1 ? "draft" : DEFAULT_STATUS,
    })
  );

const loadPostsFromStorage = (): Post[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Post[];
    return Array.isArray(parsed) ? parsed.map(normalizePost) : null;
  } catch (error) {
    console.error("Failed to load posts from localStorage:", error);
    return null;
  }
};

const savePostsToStorage = (posts: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to save posts to localStorage:", error);
  }
};

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
      const posts = loadPostsFromStorage() ?? seedPosts();

      // 模拟网络延迟
      setTimeout(() => {
        set({ posts, isLoading: false });
      }, 300);
    } catch (err) {
      set({ error: "获取文章列表失败", isLoading: false });
    }
  },

  // 根据 ID 获取单个文章
  fetchPostById: (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const posts = loadPostsFromStorage() ?? seedPosts();
      const post = posts.find((p) => p.id === id);
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
      posts: [...state.posts, normalizePost(post)],
    }));

    savePostsToStorage([...usePostStore.getState().posts]);
  },

  // 更新文章（模拟）
  updatePost: (id: number, updates: Partial<Post>) => {
    set((state) => {
      const nextPosts = state.posts.map((p) =>
        p.id === id ? normalizePost({ ...p, ...updates, id: p.id }) : p
      );

      const nextCurrentPost =
        state.currentPost?.id === id
          ? normalizePost({ ...state.currentPost, ...updates, id: state.currentPost.id })
          : state.currentPost;

      savePostsToStorage(nextPosts);

      return {
        posts: nextPosts,
        currentPost: nextCurrentPost,
      };
    });
  },

  // 删除文章（模拟）
  deletePost: (id: number) => {
    set((state) => {
      const nextPosts = state.posts.filter((p) => p.id !== id);
      savePostsToStorage(nextPosts);

      return {
        posts: nextPosts,
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
      };
    });
  },

  // 清除错误信息
  clearError: () => {
    set({ error: null });
  },
}));
