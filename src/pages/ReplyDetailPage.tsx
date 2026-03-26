import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostStore } from "@/store/postStore";
import { commentStore } from "@/store/commentStore";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentCard } from "@/features/comments/components/CommentCard";
import type { Comment } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

/**
 * 回复详情页 - 显示某条评论的所有回复
 */
export default function ReplyDetailPage() {
  const { commentId, postId } = useParams<{ commentId: string; postId: string }>();
  const navigate = useNavigate();
  const rootCommentRef = useRef<HTMLDivElement | null>(null);
  const replyFormRef = useRef<HTMLDivElement | null>(null);
  
  const { currentPost, fetchPostById, isLoading: postLoading } = usePostStore();
  const threadComments = commentStore((state) => state.comments.get(postId ? Number(postId) : 0) || []);
  const { addComment, deleteComment, likeComment, dislikeComment } = commentStore();
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
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

  const buildReplyTree = (parentId: number, depth = 0): ReactElement[] => {
    const directReplies = threadComments
      .filter(item => item.replyTo === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return directReplies.flatMap((reply) => {
      const nextDepth = depth + 1;

      return [
        <div key={reply.id} className={nextDepth > 0 ? 'ml-4 pl-4 border-l border-gray-200 dark:border-gray-700' : ''}>
          <CommentCard
            comment={reply}
            postId={postIdNum}
            isAdmin={false}
            onReply={setReplyTarget}
            onDelete={handleDeleteReply}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>,
        ...buildReplyTree(reply.id, nextDepth),
      ];
    });
  };

  // 加载文章和评论
  useEffect(() => {
    if (postIdNum) {
      fetchPostById(postIdNum);
    }
  }, [postIdNum, fetchPostById]);

  // 加载评论和回复
  useEffect(() => {
    if (commentIdNum) {
      if (comment) {
        setReplyTarget((currentTarget: Comment | null) => currentTarget || comment);
      }
    }
  }, [commentIdNum, comment]);

  // 处理添加回复
  const handleAddReply = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => {
    setIsSubmittingComment(true);
    try {
      await addComment(postIdNum, commentData);
      if (comment) {
        setReplyTarget(comment);
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 处理删除回复
  const handleDeleteReply = async (replyId: number) => {
    try {
      await deleteComment(postIdNum, replyId);
    } catch (err) {
      console.error('Failed to delete reply:', err);
    }
  };

  // 处理点赞
  const handleLike = async (commentPostId: number, replyId: number) => {
    try {
      await likeComment(commentPostId, replyId);
    } catch (err) {
      console.error('Failed to like reply:', err);
    }
  };

  // 处理踩
  const handleDislike = async (commentPostId: number, replyId: number) => {
    try {
      await dislikeComment(commentPostId, replyId);
    } catch (err) {
      console.error('Failed to dislike reply:', err);
    }
  };
 
  const handleBackToOriginalComment = () => {
    if (comment) {
      setReplyTarget(comment);
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!comment || !currentPost) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">评论不存在</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">无法找到您要查看的评论</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        回到原评论区
      </button>

      {/* 文章标题 */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {currentPost.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">评论回复详情</p>
      </header>

      {/* 主评论 */}
      <div ref={rootCommentRef} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">原评论</h2>
          <button
            onClick={handleBackToOriginalComment}
            className="text-sm px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            回到原评论区
          </button>
        </div>
        <CommentCard
          comment={comment}
          postId={postIdNum}
          onReply={setReplyTarget}
          onLike={likeComment}
          onDislike={dislikeComment}
        />
      </div>

      {/* 回复列表 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          回复 ({sortedReplies.length})
        </h2>

        {sortedReplies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无回复
          </div>
        ) : (
          <div className="space-y-4">
            {buildReplyTree(comment.id)}
          </div>
        )}
      </div>

      {/* 新增回复表单 */}
      <div ref={replyFormRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">添加回复</h2>
          {replyTarget && replyTarget.id !== comment.id && (
            <button
              onClick={() => setReplyTarget(comment)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              回到原评论区
            </button>
          )}
        </div>

        {replyTarget && (
          <div className="mb-4 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
            正在回复：{replyTarget.author || '匿名用户'}
            <span className="block mt-1 text-gray-500 dark:text-gray-400">
              点击其他回复也可以切换回复目标。
            </span>
          </div>
        )}

        <CommentForm
          postId={postIdNum}
          replyTo={replyTarget || comment}
          isLoading={isSubmittingComment}
          onSubmit={handleAddReply}
        />
      </div>
    </div>
  );
}
