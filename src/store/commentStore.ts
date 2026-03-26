import { create } from 'zustand';
import type { Comment, CommentListResponse, CommentReaction } from "@/types/comment";
import { mockComments } from "@/assets/mockComments";

interface CommentState {
  // 状态
  comments: Map<number, Comment[]>; // key: postId, value: comments[]
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

const normalizeComment = (comment: Comment): Comment => ({
  ...comment,
  isApproved: comment.isApproved ?? true,
  likes: comment.likes ?? 0,
  dislikes: comment.dislikes ?? 0,
  replyCount: comment.replyCount ?? 0,
  currentReaction: comment.currentReaction,
});

const buildMockCommentMap = (): Map<number, Comment[]> => {
  const initialMap = new Map<number, Comment[]>();

  mockComments.forEach((comment: Comment) => {
    if (!initialMap.has(comment.postId)) {
      initialMap.set(comment.postId, []);
    }
    initialMap.get(comment.postId)!.push(normalizeComment(comment));
  });

  return initialMap;
};

const mergeCommentMaps = (
  baseMap: Map<number, Comment[]>,
  fallbackMap: Map<number, Comment[]>
): Map<number, Comment[]> => {
  const merged = new Map<number, Comment[]>();
  const postIds = new Set<number>([
    ...Array.from(baseMap.keys()),
    ...Array.from(fallbackMap.keys()),
  ]);

  postIds.forEach((postId) => {
    const baseComments = baseMap.get(postId) || [];
    const fallbackComments = fallbackMap.get(postId) || [];
    const commentById = new Map<number, Comment>();

    fallbackComments.forEach((comment) => {
      commentById.set(comment.id, comment);
    });

    baseComments.forEach((comment) => {
      commentById.set(comment.id, normalizeComment(comment));
    });

    merged.set(postId, Array.from(commentById.values()));
  });

  return merged;
};

/**
 * 从 localStorage 加载评论数据
 */
const loadCommentsFromStorage = (): Map<number, Comment[]> => {
  const mockCommentMap = buildMockCommentMap();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const storedMap = new Map(
        Object.entries(parsed).map(([key, value]) => [
          Number(key),
          (value as Comment[]).map(normalizeComment),
        ])
      );
      return mergeCommentMaps(storedMap, mockCommentMap);
    }
  } catch (err) {
    console.error('Failed to load comments from localStorage:', err);
  }

  // 如果 localStorage 中没有数据，使用模拟数据
  return mockCommentMap;
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

const loadLegacyReactionsFromStorage = (): Record<string, CommentReaction> => {
  try {
    const stored = localStorage.getItem('blog_comment_reactions');
    if (stored) {
      return JSON.parse(stored) as Record<string, CommentReaction>;
    }
  } catch (err) {
    console.error('Failed to load legacy comment reactions from localStorage:', err);
  }

  return {};
};

const applyLegacyReactions = (
  comments: Map<number, Comment[]>,
  reactions: Record<string, CommentReaction>
): Map<number, Comment[]> => {
  if (Object.keys(reactions).length === 0) {
    return comments;
  }

  const nextComments = new Map<number, Comment[]>();

  comments.forEach((postComments, postId) => {
    nextComments.set(
      postId,
      postComments.map((comment) => {
        const reactionKey = `${postId}:${comment.id}`;
        const reaction = reactions[reactionKey];
        return reaction ? { ...comment, currentReaction: reaction } : comment;
      })
    );
  });

  return nextComments;
};

export const commentStore = create<CommentState>((set, get) => ({
  // 初始状态
  comments: applyLegacyReactions(loadCommentsFromStorage(), loadLegacyReactionsFromStorage()),
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
        currentReaction: undefined,
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
        const postComments = comments.get(postId) || [];

        const updated = postComments.map(c => {
          if (c.id !== commentId) {
            return c;
          }

          if (c.currentReaction === 'like') {
            return { ...c, currentReaction: undefined, likes: Math.max(c.likes - 1, 0) };
          }

          if (c.currentReaction === 'dislike') {
            const nextReaction: CommentReaction = 'like';
            return {
              ...c,
              currentReaction: nextReaction,
              likes: c.likes + 1,
              dislikes: Math.max(c.dislikes - 1, 0),
            };
          }

          const nextReaction: CommentReaction = 'like';
          return { ...c, currentReaction: nextReaction, likes: c.likes + 1 };
        });

        comments.set(postId, updated);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);
        
        return { comments };
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
        const postComments = comments.get(postId) || [];

        const updated = postComments.map(c => {
          if (c.id !== commentId) {
            return c;
          }

          if (c.currentReaction === 'dislike') {
            return { ...c, currentReaction: undefined, dislikes: Math.max(c.dislikes - 1, 0) };
          }

          if (c.currentReaction === 'like') {
            const nextReaction: CommentReaction = 'dislike';
            return {
              ...c,
              currentReaction: nextReaction,
              dislikes: c.dislikes + 1,
              likes: Math.max(c.likes - 1, 0),
            };
          }

          const nextReaction: CommentReaction = 'dislike';
          return { ...c, currentReaction: nextReaction, dislikes: c.dislikes + 1 };
        });

        comments.set(postId, updated);
        
        // 保存到 localStorage
        saveCommentsToStorage(comments);

        return { comments };
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
