import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostStore } from "@/store/postStore";
import { commentStore } from "@/store/commentStore";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentCard } from "@/features/comments/components/CommentCard";
import type { Comment } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 回复详情页 - 显示某条评论的所有回复
 */
export default function ReplyDetailPage() {
  const { commentId, postId } = useParams<{ commentId: string; postId: string }>();
  const navigate = useNavigate();
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  
  const { currentPost, fetchPostById, isLoading: postLoading } = usePostStore();
  const threadComments = commentStore((state) => state.comments.get(postId ? Number(postId) : 0) || []);
  const { addComment, deleteComment, likeComment, dislikeComment } = commentStore();
  
  const postIdNum = postId ? Number(postId) : 0;
  const commentIdNum = commentId ? Number(commentId) : 0;

  const comment = useMemo(() => {
    return threadComments.find((item) => item.id === commentIdNum) || null;
  }, [threadComments, commentIdNum]);

  const sortedReplies = useMemo(() => {
    return [...threadComments]
      .filter(item => item.replyTo === commentIdNum)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [threadComments, commentIdNum]);

  // 加载页面数据
  useEffect(() => {
    if (postIdNum) fetchPostById(postIdNum);
  }, [postIdNum, fetchPostById]);

  // 处理回复提交
  const handleAddReply = async (commentData: any) => {
    try {
      await addComment(postIdNum, commentData);
      setActiveReplyId(null);
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  const buildReplyTree = (parentId: number, depth = 0): ReactElement[] => {
    const directReplies = threadComments
      .filter(item => item.replyTo === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return directReplies.flatMap((reply) => {
      const nextDepth = depth + 1;
      return [
        <div key={reply.id} className={cn("transition-all", nextDepth > 0 && "ml-8 pl-4 border-l border-slate-100 dark:border-slate-800")}>
          <CommentCard
            comment={reply}
            postId={postIdNum}
            isReplying={activeReplyId === reply.id}
            onReply={() => setActiveReplyId(activeReplyId === reply.id ? null : reply.id)}
            onSubmitReply={handleAddReply}
            onCancelReply={() => setActiveReplyId(null)}
            onLike={likeComment}
            onDislike={dislikeComment}
            onDelete={async (id) => { await deleteComment(postIdNum, id); }}
          />
        </div>,
        ...buildReplyTree(reply.id, nextDepth),
      ];
    });
  };

  if (postLoading) return <div className="py-20 text-center animate-pulse">加载中...</div>;

  if (!comment || !currentPost) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">内容不存在</h2>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-8 gap-2 px-2 text-slate-500 hover:text-blue-500 font-bold cursor-pointer"
      >
        <ArrowLeftIcon />
        返回文章评论区
      </Button>

      {/* 主评论详情 */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 mb-10">
        <div className="text-xs font-bold text-blue-500 mb-4 tracking-widest uppercase">
          正查看的主评论
        </div>
        <CommentCard
          comment={comment}
          postId={postIdNum}
          isReplying={activeReplyId === comment.id}
          onReply={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
          onSubmitReply={handleAddReply}
          onCancelReply={() => setActiveReplyId(null)}
          onLike={likeComment}
          onDislike={dislikeComment}
          onDelete={async (id) => { await deleteComment(postIdNum, id); }}
        />
      </div>

      {/* 回复列表 */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
          所有回复
          <span className="text-sm font-normal text-slate-400">{sortedReplies.length}</span>
        </h2>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {buildReplyTree(comment.id)}
        </div>
      </div>
    </div>
  );
}
