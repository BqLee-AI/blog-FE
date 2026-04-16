import { useEffect, useState } from "react";
import PostCard from "@/features/articles/components/PostCard";
import { Button } from "@/components/ui/button";
import { articleApi, type Article, type ArticleListParams } from "@/api/article";
import { useSearchStore } from "@/store/searchStore";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

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
  const [sortBy, setSortBy] = useState<ArticleListParams["sort_by"]>("created_at");
  const [page, setPage] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);

  // 获取全局搜索关键字
  const { keyword } = useSearchStore();

  // 当搜索关键词变化时，重置页码为 1
  useEffect(() => {
    setPage(1);
  }, [keyword]);

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

  const totalPages = pagination.total_pages || 1;

  const handleResetFilters = () => {
    setSortBy("created_at");
    setPage(1);
    setRefreshToken((value) => value + 1);
  };

  return (
    <div className="animate-fade-in">
      {/* 内容区 */}
      <section className="space-y-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
            <span className="w-12 h-1.5 bg-blue-600 rounded-full" />
            {(keyword && keyword.trim() !== "") ? "搜索结果" : "全部文章"}
          </h2>
          
          <div className="flex items-center gap-4">
            <select
              aria-label="排序方式"
              value={sortBy}
              onChange={(event) => {
                setPage(1);
                setSortBy(event.target.value as ArticleListParams["sort_by"]);
              }}
              className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-black text-slate-500 dark:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="created_at">按最新发布</option>
              <option value="view_count">按阅读热度</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-2 border-blue-100 dark:border-blue-900/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase text-[10px]">Filtering Knowledge...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-red-50/50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 dark:border-red-900/20">
            <p className="text-sm font-black text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button
              type="button"
              onClick={() => setRefreshToken((value) => value + 1)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black px-8"
            >
              重试
            </Button>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Results</p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-600 font-bold">未找到与 &quot;{keyword}&quot; 匹配的内容。</p>
            <Button variant="outline" className="mt-10 rounded-xl font-black border-slate-200 dark:border-slate-800 px-8" onClick={handleResetFilters}>
              返回全部文章
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article) => (
                <PostCard key={article.id} post={article} />
              ))}
            </div>

            {/* 分页器 */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-10 border-t border-slate-100 dark:border-slate-800/50">
              <div className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">
                Page {page} of {totalPages} — Total {pagination.total} articles
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="h-11 px-5 text-slate-400 hover:text-blue-500 font-black text-xs uppercase transition-all disabled:opacity-10 cursor-pointer"
                >
                  <FiChevronLeft className="mr-2" /> Pre
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-[11px] font-black transition-all cursor-pointer",
                        page === i + 1 
                          ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110" 
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="h-11 px-5 text-slate-400 hover:text-blue-500 font-black text-xs uppercase transition-all disabled:opacity-10 cursor-pointer"
                >
                  Next <FiChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
