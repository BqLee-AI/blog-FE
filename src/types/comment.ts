export interface Comment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isApproved: boolean;
  replyTo?: number;
  author?: string;
  email?: string;
  likes: number;
  dislikes: number;
  replyCount: number;
}

export type CommentListResponse = {
  items: Comment[];
  total: number;
  postId: number;
};
