import { create } from 'zustand';
import type { Comment, CommentListResponse } from "@/types/comment";
import { mockComments } from "@/assets/mockComments";

type CommentReaction = 'like' | 'dislike';
type CommentReactionMap = Record<string, CommentReaction>;

interface CommentState {
  // 状态
  comments: Map<number, Comment[]>; // key: postId, value: comments[]
  reactions: CommentReactionMap;
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchComments: (postId: number) => Promise<void>;
  addComment: (postId: number, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'replyCount'>) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
  updateComment: (postId: number, commentId: number, updates: Partial<Comment>) => Promise<void>;
  likeComment: (postId: number, commentId: number) => Promise<void>;
  dislikeComment: (postId: number, commentId: number) => Promise<void>;
  getCommentsByPostId: (postId: number) => Comment[];
  getCommentById: (commentId: number) => Comment | undefined;
  getCommentReplies: (commentId: number, postId: number) => Comment[];
  clearError: () => void;
}

const STORAGE_KEY = 'blog_comments';
const REACTION_STORAGE_KEY = 'blog_comment_reactions';

const getReactionKey = (postId: number, commentId: number): string => `${postId}:${commentId}`;

const normalizeComment = (comment: Comment): Comment => ({
  ...comment,
  isApproved: comment.isApproved ?? true,
  likes: comment.likes ?? 0,
  dislikes: comment.dislikes ?? 0,
  replyCount: comment.replyCount ?? 0,
});

/**
 * 从 localStorage 加载评论数据
 */
const loadCommentsFromStorage = (): Map<number, Comment[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(
        Object.entries(parsed).map(([key, value]) => [
          Number(key),
          (value as Comment[]).map(normalizeComment),
        ])
      );
    }
  } catch (err) {
    console.error('Failed to load comments from localStorage:', err);
  }

  // 如果 localStorage 中没有数据，使用模拟数据
  const initialMap = new Map<number, Comment[]>();
  mockComments.forEach((comment: Comment) => {
    if (!initialMap.has(comment.postId)) {
      initialMap.set(comment.postId, []);
    }
    initialMap.get(comment.postId)!.push(normalizeComment(comment));
  });
  return initialMap;
};

const loadReactionsFromStorage = (): CommentReactionMap => {
  try {
    const stored = localStorage.getItem(REACTION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CommentReactionMap;
    }
  } catch (err) {
    console.error('Failed to load comment reactions from localStorage:', err);
  }

  return {};
};

/**
 * 保存评论数据到 localStorage
 */
const saveCommentsToStorage = (comments: Map<number, Comment[]>) => {
  try {
    const obj: Record<number, Comment[]> = {};
    comments.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.error('Failed to save comments to localStorage:', err);
  }
};

const saveReactionsToStorage = (reactions: CommentReactionMap) => {
  try {
    localStorage.setItem(REACTION_STORAGE_KEY, JSON.stringify(reactions));
  } catch (err) {
    console.error('Failed to save comment reactions to localStorage:', err);
  }
};

export const commentStore = create<CommentState>((set, get) => ({
  // 初始状态
  comments: loadCommentsFromStorage(),
  reactions: loadReactionsFromStorage(),
  isLoading: false,
  error: null,

  /**
   * 获取指定文章的评论列表
   */
  fetchComments: async (postId: number) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 从当前 store 中获取数据
      const comments = get().comments.get(postId) || [];
      set({ isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取评论失败';
      set({ error: errorMessage, isLoading: false });
    }
  },

  /**
   * 添加新评论
   */
  addComment: async (postId: number, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'replyCount'>) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const newComment: Comment = {
        id: Date.now(),
        ...comment,
        createdAt: new Date().toISOString(),
        author: comment.author || '网友',
        likes: 0,
        dislikes: 0,
        replyCount: 0,
      };

      set(state => {
        const comments = new Map(state.comments);
        const postComments = comments.get(postId) || [];
        const updatedComments = [...postComments, newComment];

        if (newComment.replyTo) {
          const parentIndex = updatedComments.findIndex(item => item.id === newComment.replyTo);
          const parentComment = parentIndex >= 0 ? updatedComments[parentIndex] : undefined;
          if (parentComment) {
            updatedComments[parentIndex] = {
              ...parentComment,
              replyCount: (parentComment.replyCount ?? 0) + 1,
            };
          }
        }

        comments.set(postId, updatedComments);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        
        return { comments, isLoading: false };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '添加评论失败';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  /**
   * 删除评论
   */
  deleteComment: async (postId: number, commentId: number) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      set(state => {
        const comments = new Map(state.comments);
        const postComments = comments.get(postId) || [];
        const targetComment = postComments.find(item => item.id === commentId);
        
        // 删除指定评论及其回复
        const filtered = postComments.filter(
          c => c.id !== commentId && c.replyTo !== commentId
        );

        let nextComments = filtered;

        if (targetComment?.replyTo) {
          nextComments = filtered.map(item => {
            if (item.id !== targetComment.replyTo) {
              return item;
            }

            return {
              ...item,
              replyCount: Math.max((item.replyCount ?? 0) - 1, 0),
            };
          });
        }

        comments.set(postId, nextComments);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        
        return { comments, isLoading: false };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除评论失败';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  /**
   * 更新评论
   */
  updateComment: async (postId: number, commentId: number, updates: Partial<Comment>) => {
    set({ isLoading: true, error: null });
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      set(state => {
        const comments = state.comments;
        const postComments = comments.get(postId) || [];
        
        const updated = postComments.map(c =>
          c.id === commentId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        comments.set(postId, updated);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        
        return { comments, isLoading: false };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新评论失败';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  /**
   * 点赞评论
   */
  likeComment: async (postId: number, commentId: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      set(state => {
        const comments = new Map(state.comments);
        const reactions = { ...state.reactions };
        const postComments = comments.get(postId) || [];
        const reactionKey = getReactionKey(postId, commentId);
        const previousReaction = reactions[reactionKey];

        const updated = postComments.map(c => {
          if (c.id !== commentId) {
            return c;
          }

          if (previousReaction === 'like') {
            delete reactions[reactionKey];
            return { ...c, likes: Math.max(c.likes - 1, 0) };
          }

          if (previousReaction === 'dislike') {
            reactions[reactionKey] = 'like';
            return {
              ...c,
              likes: c.likes + 1,
              dislikes: Math.max(c.dislikes - 1, 0),
            };
          }

          reactions[reactionKey] = 'like';
          return { ...c, likes: c.likes + 1 };
        });

        comments.set(postId, updated);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        saveReactionsToStorage(reactions);
        
        return { comments, reactions };
      });
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  },

  /**
   * 踩评论
   */
  dislikeComment: async (postId: number, commentId: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      set(state => {
        const comments = new Map(state.comments);
        const reactions = { ...state.reactions };
        const postComments = comments.get(postId) || [];
        const reactionKey = getReactionKey(postId, commentId);
        const previousReaction = reactions[reactionKey];

        const updated = postComments.map(c => {
          if (c.id !== commentId) {
            return c;
          }

          if (previousReaction === 'dislike') {
            delete reactions[reactionKey];
            return { ...c, dislikes: Math.max(c.dislikes - 1, 0) };
          }

          if (previousReaction === 'like') {
            reactions[reactionKey] = 'dislike';
            return {
              ...c,
              dislikes: c.dislikes + 1,
              likes: Math.max(c.likes - 1, 0),
            };
          }

          reactions[reactionKey] = 'dislike';
          return { ...c, dislikes: c.dislikes + 1 };
        });

        comments.set(postId, updated);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        saveReactionsToStorage(reactions);
        
        return { comments, reactions };
      });
    } catch (err) {
      console.error('Failed to dislike comment:', err);
    }
  },

  /**
   * 获取指定文章的评论列表
   */
  getCommentsByPostId: (postId: number) => {
    return get().comments.get(postId) || [];
  },

  /**
   * 根据ID获取单个评论
   */
  getCommentById: (commentId: number) => {
    const allComments = Array.from(get().comments.values()).flat();
    return allComments.find(c => c.id === commentId);
  },

  /**
   * 获取评论的所有回复
   */
  getCommentReplies: (commentId: number, postId: number) => {
    const postComments = get().comments.get(postId) || [];
    return postComments.filter(c => c.replyTo === commentId);
  },

  /**
   * 清空错误信息
   */
  clearError: () => {
    set({ error: null });
  },
}));
