import { useEffect, useMemo, useState, type FormEvent } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articleApi, type Article, type ArticleListParams } from "@/api/article";
import { formatArticleDate } from "@/lib/utils";
import { FiSearch, FiRotateCcw, FiChevronLeft, FiChevronRight, FiFilter, FiTrendingUp } from "react-icons/fi";

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
    const controller = new AbortController();

    const loadArticles = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await articleApi.list({
          page,
          page_size: PAGE_SIZE,
          sort_by: sortBy,
          keyword: keyword || undefined,
        }, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setArticles(Array.isArray(response.items) ? response.items : []);
        const nextPagination = {
          page: typeof response.page === "number" ? response.page : 1,
          page_size: typeof response.page_size === "number" ? response.page_size : PAGE_SIZE,
          total: typeof response.total === "number" ? response.total : 0,
          total_pages: typeof response.total_pages === "number" ? response.total_pages : 0,
        };

        setPagination(nextPagination);

        if (nextPagination.page !== page) {
          setPage(nextPagination.page);
        }
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        const message = requestError instanceof Error ? requestError.message : "获取文章列表失败";
        setError(message);
        setArticles([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      controller.abort();
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
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* 页面标题 - 高保真玻璃拟态重构 */}
      <header className="mb-12 grid gap-8 rounded-[3rem] border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/60 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur-2xl md:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl -mr-40 -mt-40 animate-pulse" />
        
        <div className="relative z-10 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 dark:bg-blue-400/10 border border-blue-100/30 dark:border-blue-400/20 w-fit shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Personal Tech Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-[1.1]">
            探索 · 记录 · 分享
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium opacity-90 border-l-4 border-blue-500/30 pl-6 py-2">
            集成全站动态搜索与排序筛选，支持分页浏览，为您带来更接近真实生产环境的项目体验。
          </p>
        </div>

        <div className="relative z-10 rounded-[2.5rem] bg-slate-900/5 dark:bg-white/5 p-1 backdrop-blur-md">
          <div className="h-full rounded-[2.25rem] bg-white/70 dark:bg-slate-950/70 p-6 md:p-8 shadow-inner border border-white/50 dark:border-white/5 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-5 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-blue-500/20 transition-all">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">文章总数</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{pagination.total}</p>
                  <p className="text-[10px] text-slate-400 font-bold">篇</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-5 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-blue-500/20 transition-all">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">当前进度</p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                  {page} <span className="text-sm text-slate-400">/ {totalPages}</span>
                </p>
              </div>
              <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-5 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-blue-500/20 transition-all">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">本页热度</p>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500" />
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{totalViews}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 p-5 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-blue-500/20 transition-all overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">NEWEST</p>
                <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {latestArticle?.title ?? "暂无文章"}
                </p>
                {latestArticle && (
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                    {formatArticleDate(latestArticle.created_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 搜索与筛选工具栏 */}
      <section className="mb-12">
        <div className="p-4 md:p-6 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-white/40 dark:border-white/5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-4 lg:flex-row lg:items-center"
          >
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                aria-label="搜索标题、摘要或作者"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="探索感兴趣的标题、摘要或作者..."
                className="h-12 pl-12 pr-4 bg-white/60 dark:bg-slate-950/60 border-slate-200/60 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 h-12">
                <FiFilter className="text-slate-400" />
                <select
                  aria-label="排序方式"
                  value={sortBy}
                  onChange={(event) => {
                    setPage(1);
                    setSortBy(event.target.value as ArticleListParams["sort_by"]);
                  }}
                  className="bg-transparent border-none text-sm font-black text-slate-700 dark:text-slate-300 outline-none focus:ring-0"
                >
                  <option value="created_at">按发布时间</option>
                  <option value="view_count">按阅读热度</option>
                </select>
              </div>
              
              <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                立即查找
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetFilters}
                className="h-12 px-6 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-black transition-all"
              >
                <FiRotateCcw className="mr-2" /> 重置
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 文章列表区 */}
      <section className="mb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border border-white/40 dark:border-white/5">
            <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-500 dark:text-slate-400 font-black tracking-widest uppercase text-xs">Loading Articles...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-red-50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 dark:border-red-900/20">
            <div className="text-5xl mb-6">🔌</div>
            <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-2">服务通信异常</h3>
            <p className="text-sm text-red-500/60 dark:text-red-400/60 mb-8 max-w-sm mx-auto">{error}</p>
            <Button
              type="button"
              onClick={() => setRefreshToken((value) => value + 1)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black px-8"
            >
              尝试恢复连接
            </Button>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-6 opacity-20">🔍</div>
            <p className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Results Found</p>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-600 font-medium tracking-tight">尝试更换关键词，或者放宽筛选条件后再试。</p>
            <Button variant="outline" className="mt-10 rounded-2xl font-black border-slate-200 dark:border-slate-800 px-8" onClick={handleResetFilters}>
              清空搜索条件
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article) => (
                <PostCard key={article.id} post={article} />
              ))}
            </div>

            {/* 精美分页器 */}
            <div className="p-5 flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-white/40 dark:border-white/5 backdrop-blur-xl">
              <div className="px-6 text-sm font-bold text-slate-500 dark:text-slate-500 italic">
                第 {page} 页 <span className="mx-2 opacity-20">|</span> 共 {totalPages} 页 <span className="mx-2 opacity-20">|</span> 当前页展示 {articles.length} 篇
              </div>
              <div className="flex items-center gap-3 pr-2">
                <Button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="h-12 w-12 p-0 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-700 disabled:opacity-20 transition-all active:scale-90"
                >
                  <FiChevronLeft className="text-xl" />
                </Button>
                <div className="h-12 px-6 flex items-center justify-center bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20">
                  {page}
                </div>
                <Button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="h-12 w-12 p-0 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-700 disabled:opacity-20 transition-all active:scale-90"
                >
                  <FiChevronRight className="text-xl" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
