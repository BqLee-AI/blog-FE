import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { articleApi, type ArticleDetail } from "@/api/article";
import { commentStore } from "@/store/commentStore";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentList } from "@/features/comments/components/CommentList";
import type { Comment } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { estimateReadingTime, formatArticleDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiClock, FiCalendar, FiMessageSquare, FiEye } from "react-icons/fi";

const CATEGORY_NAME_PATTERN = /^[\p{Script=Han}\p{L}\p{N}]+$/u;

const getSafeCategoryName = (categoryName: string | null | undefined): string => {
  const trimmedName = categoryName?.trim() || "";

  if (!trimmedName || !CATEGORY_NAME_PATTERN.test(trimmedName)) {
    return "未分类";
  }

  return trimmedName;
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parsedArticleId = id ? parseInt(id, 10) : NaN;
  const isValidArticleId = Number.isInteger(parsedArticleId) && parsedArticleId > 0;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ message: string; retryable: boolean } | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  
  // 评论相关状态
  const articleId = isValidArticleId ? parsedArticleId : null;
  const comments = commentStore((state) => (articleId ? state.comments.get(articleId) || [] : []));
  const { isLoading: commentsLoading, addComment, deleteComment, likeComment, dislikeComment } = commentStore();
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const readingTime = estimateReadingTime(article?.content);
  const publishedAt = formatArticleDate(article?.created_at);
  const safeContent = article ? sanitizeHtml(article.content) : "";
  const topLevelCommentCount = comments.filter((comment) => !comment.replyTo).length;

  useEffect(() => {
    let isActive = true;

    const loadArticle = async () => {
      if (!isValidArticleId) {
        setArticle(null);
        setError(null);
        setIsLoading(false);
        setIsNotFound(true);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const detail = await articleApi.getById(parsedArticleId);

        if (!isActive) return;

        setArticle(detail);
      } catch (requestError) {
        if (!isActive) return;

        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          setIsNotFound(true);
          setError(null);
        } else {
          setError({
            message: requestError instanceof Error ? requestError.message : "获取文章详情失败",
            retryable: true,
          });
        }

        setArticle(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      isActive = false;
    };
  }, [articleId, isValidArticleId, retryToken]);

  // 处理添加评论
  const handleAddComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'email' | 'likes' | 'dislikes' | 'replyCount'>) => {
    setIsSubmittingComment(true);
    try {
      await addComment(articleId ?? 0, commentData);
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
      await deleteComment(articleId ?? 0, commentId);
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
    navigate(`/article/${articleId ?? 0}/comment/${comment.id}/replies`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">文章加载中...</p>
        </div>
      </div>
    );
  }

  if (error || isNotFound || !article) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-8xl mb-8">😕</div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          {error?.message || "文章不存在"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto">
          {isNotFound ? "无法找到您要查看的文章，可能已被移动或删除" : "服务器响应异常，请稍后再次尝试"}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-2xl font-black shadow-lg shadow-blue-500/20"
          >
            返回首页
          </Button>
          {error?.retryable && (
            <Button
              type="button"
              onClick={() => setRetryToken((value) => value + 1)}
              variant="outline"
              className="h-12 px-8 rounded-2xl border-slate-200 dark:border-slate-800 font-black"
            >
              重试加载
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6">
      {/* 返回按钮 */}
      <Button
        type="button"
        onClick={() => navigate("/")}
        variant="ghost"
        className="mb-8 gap-2 px-4 py-6 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-2xl transition-all font-black text-sm uppercase tracking-widest"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        返回文章列表
      </Button>

      {/* 文章头部 - 高保真重写 */}
      <header className="mb-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest rounded-lg border border-blue-100 dark:border-blue-400/20">
            {article.category?.name || "精选内容"}
          </span>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 dark:text-slate-500 text-xs font-bold">
            <span className="flex items-center gap-1.5"><FiCalendar /> {publishedAt}</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
            <span className="flex items-center gap-1.5"><FiClock /> {readingTime} 分钟阅读</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
            <span className="flex items-center gap-1.5"><FiEye /> {article.view_count} 次浏览</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[1.1]">
          {article.title}
        </h1>

        {article.cover_image && (
          <div className="mb-12 overflow-hidden rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-white/40 dark:border-white/5">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* 文章概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 mb-12">
          <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/50 shadow-inner">
            <div className="absolute -left-3 top-10 w-2 h-16 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40" />
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Article Summary</div>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
              “ {article.summary} ”
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 p-6 rounded-[2rem] bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 backdrop-blur-xl flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">评论互动</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{comments.length}</span>
                <span className="text-xs text-slate-500 font-bold">条见解</span>
              </div>
            </div>
            <div className="flex-1 p-6 rounded-[2rem] bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 backdrop-blur-xl flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">内容分类</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">{getSafeCategoryName(article.category?.name)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 文章正文 */}
      <main className="mb-24">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tight prose-a:text-blue-500 prose-img:rounded-[2rem] prose-img:shadow-2xl prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 dark:prose-blockquote:border-blue-400">
          {safeContent ? (
            <article dangerouslySetInnerHTML={{ __html: safeContent }} />
          ) : (
            <div className="py-24 text-center text-slate-400 italic font-medium">暂无正文内容</div>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
            {article.tags.map((tag) => (
              <Badge
                key={tag.id}
                className="bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 transition-all text-xs font-bold"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}
      </main>

      {/* 分解线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-20" />

      {/* 评论区 - B站风格交互 */}
      <section id="comments" className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">评论区</h2>
          <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-black rounded-full border border-slate-200 dark:border-white/5">
            {comments.length}
          </span>
        </div>

        <div className="mb-16">
          <CommentForm
            postId={articleId ?? 0}
            replyTo={replyingTo || undefined}
            isLoading={isSubmittingComment}
            onSubmit={handleAddComment}
            onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
          />
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <FiMessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-slate-400 dark:text-slate-500 font-bold">暂无评论</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 font-medium">写下你的第一个见解吧！</p>
          </div>
        ) : (
          <CommentList
            postId={articleId ?? 0}
            comments={comments}
            isLoading={commentsLoading}
            onReply={setReplyingTo}
            onDelete={handleDeleteComment}
            onLike={handleLike}
            onDislike={handleDislike}
            onViewReplies={handleViewReplies}
          />
        )}
      </section>
    </div>
  );
}
