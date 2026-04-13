import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostStore } from "@/store/postStore";
import { commentStore } from "@/store/commentStore";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentList } from "@/features/comments/components/CommentList";
import type { Comment } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPost, fetchPostById, isLoading, error, clearError } =
    usePostStore();
  
  // 评论相关状态
  const comments = commentStore((state) => state.comments.get(id ? Number(id) : 0) || []);
  const { isLoading: commentsLoading, addComment, deleteComment, likeComment, dislikeComment } = commentStore();
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const postId = id ? Number(id) : 0;
  const readingTime = estimateReadingTime(currentPost?.content);
  const publishedAt = formatArticleDate(currentPost?.createdAt);
  const topLevelCommentCount = comments.filter((comment) => !comment.replyTo).length;

  useEffect(() => {
    if (id) {
      fetchPostById(Number(id));
    }
  }, [id, fetchPostById]);

  // 处理添加评论
  const handleAddComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => {
    setIsSubmittingComment(true);
    try {
      await addComment(postId, commentData);
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 处理删除评论
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(postId, commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  // 处理点赞
  const handleLike = async (commentPostId: number, commentId: number) => {
    try {
      await likeComment(commentPostId, commentId);
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  // 处理踩
  const handleDislike = async (commentPostId: number, commentId: number) => {
    try {
      await dislikeComment(commentPostId, commentId);
    } catch (err) {
      console.error('Failed to dislike comment:', err);
    }
  };

  // 处理查看回复
  const handleViewReplies = (comment: Comment) => {
    navigate(`/article/${postId}/comment/${comment.id}/replies`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {error || "文章不存在"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">无法找到您要查看的文章</p>
        <Button
          type="button"
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          返回首页
        </Button>
        {error && (
          <Button
            type="button"
            onClick={clearError}
            variant="outline"
            className="ml-2"
          >
            清除错误
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* 返回按钮 */}
      <Button
        type="button"
        onClick={() => navigate("/")}
        variant="ghost"
        className="mb-8 gap-2 px-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        返回列表
      </Button>

      {/* 文章头部 */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {currentPost.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[11px] font-bold rounded-lg border border-blue-100/50 dark:border-blue-800/50">
              #{tag}
            </span>
          ))}
          <span className="text-slate-400 dark:text-slate-500 text-xs font-medium ml-2">
            发布于 {publishedAt} · {readingTime} 分钟阅读
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
          {currentPost.title}
        </h1>

        {/* 摘要区 */}
        <div className="relative p-6 md:p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 shadow-inner">
          <div className="absolute -left-3 top-8 w-1.5 h-12 bg-blue-500 rounded-full" />
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
            “ {currentPost.summary} ”
          </p>
        </div>
      </header>

      {/* 文章正文 */}
      <main className="mb-20">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-500 prose-img:rounded-3xl prose-img:shadow-2xl prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10">
          {currentPost.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
          ) : (
            <div className="py-20 text-center text-slate-400">暂无内容</div>
          )}
        </div>
      </main>

      {/* 分解线 */}
      <div className="h-px bg-slate-100 dark:bg-slate-800/50 mb-16" />

      {/* 评论区 - 移至下方，B站风格更适配宽屏 */}
      <section id="comments" className="mb-20">
        <div className="mb-10">
          <CommentForm
            postId={postId}
            replyTo={replyingTo || undefined}
            isLoading={isSubmittingComment}
            onSubmit={handleAddComment}
            onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
          />
        </div>

        <CommentList
          postId={postId}
          comments={comments}
          isLoading={commentsLoading}
          onReply={setReplyingTo}
          onDelete={handleDeleteComment}
          onLike={handleLike}
          onDislike={handleDislike}
          onViewReplies={handleViewReplies}
        />
      </section>
    </div>
  );
}
