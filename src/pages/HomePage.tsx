import { useEffect, useMemo, useState, type FormEvent } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articleApi, type Article, type ArticleListParams } from "@/api/article";
import { formatArticleDate } from "@/lib/utils";

const PAGE_SIZE = 9;

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    total: 0,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<ArticleListParams["sort_by"]>("created_at");
  const [page, setPage] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadArticles = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await articleApi.list({
          page,
          page_size: PAGE_SIZE,
          sort_by: sortBy,
          keyword: keyword || undefined,
        });

        if (!isActive) return;

        setArticles(Array.isArray(response.items) ? response.items : []);
        const nextPagination = response.pagination ?? {
          page: 1,
          page_size: PAGE_SIZE,
          total: 0,
          total_pages: 0,
        };

        setPagination(nextPagination);

        if (nextPagination.page !== page) {
          setPage(nextPagination.page);
        }
      } catch (requestError) {
        if (!isActive) return;

        const message = requestError instanceof Error ? requestError.message : "获取文章列表失败";
        setError(message);
        setArticles([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      isActive = false;
    };
  }, [keyword, page, sortBy, refreshToken]);

  const totalViews = useMemo(
    () => (Array.isArray(articles) ? articles : []).reduce((total, article) => total + (article.view_count ?? 0), 0),
    [articles]
  );

  const latestArticle = useMemo(() => {
    if (!Array.isArray(articles) || articles.length === 0) return null;

    return [...articles].sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    )[0];
  }, [articles]);

  const totalPages = pagination.total_pages || 1;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setKeyword(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setKeyword("");
    setSortBy("created_at");
    setPage(1);
    setRefreshToken((value) => value + 1);
  };

  return (
    <div>
      <header className="mb-12 grid gap-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-6 shadow-sm backdrop-blur md:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] md:p-8">
        <div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-[0.35em] uppercase mb-3">
            欢迎来到
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            我的个人博客
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-8">
            现在首页文章列表已经切换为后端数据，支持分页、搜索和排序筛选，浏览体验更接近真实场景。
          </p>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/10 dark:to-cyan-900/10 p-5 border border-blue-100 dark:border-blue-900/30">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 dark:text-blue-300 mb-4">
            内容概览
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">文章总数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">当前页</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {page} / {totalPages}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">当前页阅读量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-950/40 p-4 border border-white/70 dark:border-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">最新文章</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                {latestArticle?.title ?? "暂无文章"}
              </p>
              {latestArticle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatArticleDate(latestArticle.created_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="mb-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm backdrop-blur">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="搜索标题、摘要或作者"
                className="h-11 min-w-0 flex-1"
              />
              <Button type="submit" className="h-11 px-5">
                搜索
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-5"
                onClick={handleResetFilters}
              >
                重置
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                排序
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(event) => {
                  setPage(1);
                  setSortBy(event.target.value as ArticleListParams["sort_by"]);
                }}
                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm text-gray-900 dark:text-white shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="created_at">最新发布</option>
                <option value="view_count">最热阅读</option>
              </select>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-75 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />
              <p className="text-gray-600 dark:text-gray-400">加载文章中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 p-8 text-center">
            <p className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">加载失败</p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button
              type="button"
              onClick={() => setRefreshToken((value) => value + 1)}
            >
              重新加载
            </Button>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-16 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">暂无文章</p>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">尝试清空搜索条件或切换排序方式后再查看。</p>
            <Button type="button" variant="outline" className="mt-6" onClick={handleResetFilters}>
              清空筛选
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <PostCard key={article.id} post={article} />
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                第 {page} 页，共 {totalPages} 页 · 当前显示 {articles.length} 篇文章
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  上一页
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
