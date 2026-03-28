import { mockComments } from "@/assets/mockComments";
import type { Comment, CommentListResponse, CommentReaction } from "@/types/comment";
import {
  API_DELAY,
  ApiError,
  generateId,
  readJson,
  request,
  writeJson,
} from "./client";

const STORAGE_KEY = "blog-api-v1-comments";

export type CreateCommentInput = Omit<
  Comment,
  "id" | "createdAt" | "updatedAt" | "likes" | "dislikes" | "replyCount" | "isApproved"
>;

export type UpdateCommentInput = Partial<Omit<Comment, "id" | "postId" | "createdAt">>;

const normalizeComment = (comment: Comment): Comment => ({
  ...comment,
  isApproved: comment.isApproved ?? true,
  likes: comment.likes ?? 0,
  dislikes: comment.dislikes ?? 0,
  replyCount: comment.replyCount ?? 0,
  currentReaction: comment.currentReaction,
});

const cloneComment = (comment: Comment): Comment => ({
  ...normalizeComment(comment),
});

const seedCommentMap = (): Record<string, Comment[]> => {
  const grouped: Record<string, Comment[]> = {};

  mockComments.forEach((comment) => {
    const key = String(comment.postId);
    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(cloneComment(comment));
  });

  return grouped;
};

const loadCommentMap = (): Map<number, Comment[]> => {
  const raw = readJson<Record<string, Comment[]>>(STORAGE_KEY, seedCommentMap());
  const map = new Map<number, Comment[]>();

  Object.entries(raw).forEach(([postId, comments]) => {
    map.set(
      Number(postId),
      comments.map((comment) => normalizeComment(comment))
    );
  });

  return map;
};

const saveCommentMap = (comments: Map<number, Comment[]>): void => {
  const raw: Record<string, Comment[]> = {};

  comments.forEach((commentList, postId) => {
    raw[String(postId)] = commentList.map((comment) => normalizeComment(comment));
  });

  writeJson(STORAGE_KEY, raw);
};

const getAllComments = (comments: Map<number, Comment[]>): Comment[] =>
  Array.from(comments.values()).flat();

const updateReplyCount = (
  commentList: Comment[],
  parentId: number,
  delta: number
): Comment[] =>
  commentList.map((comment) =>
    comment.id === parentId
      ? {
          ...comment,
          replyCount: Math.max((comment.replyCount ?? 0) + delta, 0),
        }
      : comment
  );

const applyReaction = (
  comment: Comment,
  reaction: CommentReaction
): Comment => {
  if (reaction === "like") {
    if (comment.currentReaction === "like") {
      return {
        ...comment,
        currentReaction: undefined,
        likes: Math.max(comment.likes - 1, 0),
      };
    }

    if (comment.currentReaction === "dislike") {
      return {
        ...comment,
        currentReaction: "like",
        likes: comment.likes + 1,
        dislikes: Math.max(comment.dislikes - 1, 0),
      };
    }

    return {
      ...comment,
      currentReaction: "like",
      likes: comment.likes + 1,
    };
  }

  if (comment.currentReaction === "dislike") {
    return {
      ...comment,
      currentReaction: undefined,
      dislikes: Math.max(comment.dislikes - 1, 0),
    };
  }

  if (comment.currentReaction === "like") {
    return {
      ...comment,
      currentReaction: "dislike",
      dislikes: comment.dislikes + 1,
      likes: Math.max(comment.likes - 1, 0),
    };
  }

  return {
    ...comment,
    currentReaction: "dislike",
    dislikes: comment.dislikes + 1,
  };
};

export const listComments = (postId: number) =>
  request(
    () => {
      const comments = loadCommentMap().get(postId) ?? [];
      const response: CommentListResponse = {
        items: comments,
        total: comments.length,
        postId,
      };

      return response;
    },
    {
      delay: API_DELAY.normal,
      message: "评论获取成功",
    }
  );

export const createComment = (postId: number, input: CreateCommentInput) =>
  request(
    () => {
      const comments = loadCommentMap();
      const postComments = comments.get(postId) ?? [];
      const allComments = getAllComments(comments);

      if (input.replyTo && !allComments.some((comment) => comment.id === input.replyTo)) {
        throw new ApiError("回复目标不存在", 404, "COMMENT_PARENT_NOT_FOUND");
      }

      const now = new Date().toISOString();
      const newComment: Comment = {
        id: generateId(allComments.map((comment) => comment.id)),
        postId,
        content: input.content,
        createdAt: now,
        updatedAt: undefined,
        isApproved: true,
        replyTo: input.replyTo,
        author: input.author || "网友",
        email: input.email,
        likes: 0,
        dislikes: 0,
        replyCount: 0,
        currentReaction: undefined,
      };

      const nextComments = [...postComments, newComment];

      if (newComment.replyTo) {
        const updated = updateReplyCount(nextComments, newComment.replyTo, 1);
        comments.set(postId, updated);
      } else {
        comments.set(postId, nextComments);
      }

      saveCommentMap(comments);
      return newComment;
    },
    {
      delay: API_DELAY.normal,
      message: "评论创建成功",
    }
  );

export const updateComment = (postId: number, commentId: number, input: UpdateCommentInput) =>
  request(
    () => {
      const comments = loadCommentMap();
      const postComments = comments.get(postId) ?? [];
      const index = postComments.findIndex((comment) => comment.id === commentId);

      if (index === -1) {
        throw new ApiError("评论不存在", 404, "COMMENT_NOT_FOUND");
      }

      const currentComment = postComments[index];
      const updatedComment: Comment = {
        ...currentComment,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      const nextComments = [...postComments];
      nextComments[index] = updatedComment;
      comments.set(postId, nextComments);
      saveCommentMap(comments);

      return updatedComment;
    },
    {
      delay: API_DELAY.fast,
      message: "评论更新成功",
    }
  );

export const deleteComment = (postId: number, commentId: number) =>
  request(
    () => {
      const comments = loadCommentMap();
      const postComments = comments.get(postId) ?? [];
      const targetComment = postComments.find((comment) => comment.id === commentId);

      if (!targetComment) {
        throw new ApiError("评论不存在", 404, "COMMENT_NOT_FOUND");
      }

      const filteredComments = postComments.filter(
        (comment) => comment.id !== commentId && comment.replyTo !== commentId
      );

      const nextComments = targetComment.replyTo
        ? updateReplyCount(filteredComments, targetComment.replyTo, -1)
        : filteredComments;

      comments.set(postId, nextComments);
      saveCommentMap(comments);

      return targetComment;
    },
    {
      delay: API_DELAY.fast,
      message: "评论删除成功",
    }
  );

export const likeComment = (postId: number, commentId: number) =>
  request(
    () => {
      const comments = loadCommentMap();
      const postComments = comments.get(postId) ?? [];

      const nextComments = postComments.map((comment) =>
        comment.id === commentId ? applyReaction(comment, "like") : comment
      );

      comments.set(postId, nextComments);
      saveCommentMap(comments);

      const targetComment = nextComments.find((comment) => comment.id === commentId);
      if (!targetComment) {
        throw new ApiError("评论不存在", 404, "COMMENT_NOT_FOUND");
      }

      return targetComment;
    },
    {
      delay: API_DELAY.fast,
      message: "点赞成功",
    }
  );

export const dislikeComment = (postId: number, commentId: number) =>
  request(
    () => {
      const comments = loadCommentMap();
      const postComments = comments.get(postId) ?? [];

      const nextComments = postComments.map((comment) =>
        comment.id === commentId ? applyReaction(comment, "dislike") : comment
      );

      comments.set(postId, nextComments);
      saveCommentMap(comments);

      const targetComment = nextComments.find((comment) => comment.id === commentId);
      if (!targetComment) {
        throw new ApiError("评论不存在", 404, "COMMENT_NOT_FOUND");
      }

      return targetComment;
    },
    {
      delay: API_DELAY.fast,
      message: "踩成功",
    }
  );

export const getCommentsByPostId = (postId: number) =>
  request(
    () => loadCommentMap().get(postId) ?? [],
    {
      delay: API_DELAY.fast,
      message: "评论列表获取成功",
    }
  );
