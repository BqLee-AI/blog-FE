import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePostStore } from "@/store/postStore";
import { commentStore } from "@/store/commentStore";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentList } from "@/features/comments/components/CommentList";
import type { Comment } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const formatArticleDate = (dateStr: string | undefined): string => {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const estimateReadingTime = (content?: string): number => {
  if (!content) {
    return 1;
  }

  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const cjkCharacters = plainText.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords = plainText.match(/[a-zA-Z0-9]+/g)?.length ?? 0;

  return Math.max(1, Math.ceil((cjkCharacters + latinWords * 2) / 300));
};

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
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
        {error && (
          <button
            onClick={clearError}
            className="ml-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            清除错误
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 左侧：文章内容 */}
      <article className="lg:col-span-2">
        {/* 返回按钮 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          返回首页
        </Link>

        {/* 文章标题和元信息 */}
        <header className="mb-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5">
            {currentPost.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            {currentPost.author && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                作者: {currentPost.author}
              </span>
            )}
            {publishedAt && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                发布: {publishedAt}
              </span>
            )}
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
              {readingTime} 分钟阅读
            </span>
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
              {currentPost.tags.length} 个标签
            </span>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-2">
              阅读
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{readingTime} 分钟</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">预计完整阅读时长</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-2">
              标签
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPost.tags.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">文章分类标签数</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-2">
              评论
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{comments.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {topLevelCommentCount} 条主评论
            </p>
          </div>
        </section>

        {/* 摘要 */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/10 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-900/30 p-5 mb-8 rounded-2xl shadow-sm">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-8">{currentPost.summary}</p>
        </div>

        {/* 标签 */}
        {currentPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {currentPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-12">
          {currentPost.content ? (
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:leading-8 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
              <p>暂无详细内容</p>
            </div>
          )}
        </div>

        {/* 底部导航 */}
        <div className="border-t dark:border-gray-700 pt-8">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            ← 返回文章列表
          </Link>
        </div>
      </article>

      {/* 右侧：评论区 */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          {/* 评论区标题 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              评论 ({comments.length})
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {topLevelCommentCount} 条主评论 · {comments.length - topLevelCommentCount} 条回复
            </p>
          </div>

          {/* 评论表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CommentForm
              postId={postId}
              replyTo={replyingTo || undefined}
              isLoading={isSubmittingComment}
              onSubmit={handleAddComment}
              onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
            />
          </div>

          {/* 评论列表 - 可滚动 */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                暂无评论，来发表第一条吧！
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
