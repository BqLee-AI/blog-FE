import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { articleApi, type ArticleDetail } from "@/api/article";
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
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 评论相关状态
  const postId = id ? Number(id) : 0;
  const comments = commentStore((state) => state.comments.get(postId) || []);
  const { isLoading: commentsLoading, addComment, deleteComment, likeComment, dislikeComment } = commentStore();
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const readingTime = estimateReadingTime(article?.content);
  const publishedAt = formatArticleDate(article?.created_at);
  const topLevelCommentCount = comments.filter((comment) => !comment.replyTo).length;

  const handleRetry = () => {
    if (!id) {
      return;
    }

    setError(null);
    setIsLoading(true);
    setArticle(null);
    articleApi
      .getById(Number(id))
      .then((result) => setArticle(result))
      .catch((requestError) => {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          setError("文章不存在");
        } else {
          setError(requestError instanceof Error ? requestError.message : "文章加载失败");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isActive = true;

    if (!id || Number.isNaN(Number(id))) {
      setArticle(null);
      setError("文章不存在");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    articleApi
      .getById(Number(id))
      .then((result) => {
        if (isActive) {
          setArticle(result);
        }
      })
      .catch((requestError) => {
        if (!isActive) {
          return;
        }

        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          setError("文章不存在");
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "文章加载失败");
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

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

  if (error || !article) {
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
        {error && error !== "文章不存在" && (
          <Button
            type="button"
            onClick={handleRetry}
            variant="outline"
            className="ml-2"
          >
            重试
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 左侧：文章内容 */}
      <article className="lg:col-span-2">
        {/* 返回按钮 */}
        <Button
          type="button"
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-8 gap-2 px-0 text-blue-600 hover:bg-transparent hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          返回首页
        </Button>

        {/* 文章标题和元信息 */}
        <header className="mb-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            {article.author && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                作者: {article.author.username}
              </span>
            )}
            {publishedAt && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">发布: {publishedAt}</span>
            )}
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">{readingTime} 分钟阅读</span>
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">阅读量: {article.view_count}</span>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-2">
              阅读
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{readingTime} 分钟</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">预计完整阅读时长</p>
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
        <section className="mb-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-linear-to-r from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/10 dark:to-cyan-900/10 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase text-blue-700 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            文章摘要
          </div>
          <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">{article.summary}</p>
        </section>

        {/* 标签 */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-sm font-medium"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 shadow-sm">
          <span className="font-semibold text-gray-900 dark:text-white">分类:</span>
          <span>{article.category.name}</span>
        </div>

        {/* 文章内容 */}
        <section className="mb-12 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <p className="text-xs font-bold tracking-[0.35em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                正文
              </p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">文章内容</h2>
            </div>
            <p className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">
              建议先看摘要，再顺着正文往下读
            </p>
          </div>

          {article.content ? (
            <article
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:leading-8 prose-p:mb-5 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-6 prose-blockquote:border-blue-400 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400">
              <p>暂无详细内容</p>
            </div>
          )}
        </section>

        {/* 底部导航 */}
        <div className="border-t dark:border-gray-700 pt-8">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            ← 返回文章列表
          </Button>
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
