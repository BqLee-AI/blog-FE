import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "@/store/postStore";
import { commentStore } from "@/store/commentStore";
import { CommentManagement } from "@/features/comments/components/CommentManagement";
import type { PostStatus } from "@/types/post";
import { PlusIcon, Pencil1Icon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const POST_STATUS_META: Record<PostStatus, { label: string; className: string }> = {
  published: {
    label: "已发布",
    className: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  draft: {
    label: "草稿",
    className: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
};

const STATUS_FILTERS: Array<{ value: "all" | PostStatus; label: string }> = [
  { value: "all", label: "全部状态" },
  { value: "published", label: "已发布" },
  { value: "draft", label: "草稿" },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { posts, fetchPosts, updatePost, deletePost } = usePostStore();
  const { comments } = commentStore();
  const [activeTab, setActiveTab] = useState<'articles' | 'comments'>('articles');
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const allComments = Array.from(comments.values()).flat();
  const publishedCount = posts.filter((post) => (post.status ?? "published") === "published").length;
  const draftCount = posts.filter((post) => (post.status ?? "published") === "draft").length;
  const pendingCommentCount = allComments.filter((comment) => !comment.isApproved).length;
  const filteredPosts =
    statusFilter === "all"
      ? posts
      : posts.filter((post) => (post.status ?? "published") === statusFilter);

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      deletePost(id);
    }
  };

  const handleToggleStatus = (id: number, currentStatus?: PostStatus) => {
    updatePost(id, {
      status: (currentStatus ?? "published") === "published" ? "draft" : "published",
    });
  };

  return (
    <div>
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">文章管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理和编辑你的所有文章</p>
        </div>
        {activeTab === 'articles' && (
          <Button
            type="button"
            onClick={() => navigate("/admin/create")}
            className="gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            新建文章
          </Button>
        )}
      </div>

      {/* 标签页 */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          onClick={() => setActiveTab('articles')}
          variant="ghost"
          className={`rounded-none border-b-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          文章管理
        </Button>
        <Button
          type="button"
          onClick={() => setActiveTab('comments')}
          variant="ghost"
          className={`rounded-none border-b-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'comments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          评论管理
        </Button>
      </div>

      {/* 文章管理标签页 */}
      {activeTab === 'articles' && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">总文章数</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">最近更新</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {posts[0]?.createdAt 
                  ? new Date(posts[0].createdAt).toLocaleDateString() 
                  : "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">评论待审核</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingCommentCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">总文章数</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">已发布</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{publishedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">草稿</div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{draftCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* 文章列表表格 */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800/60 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    标题
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    状态
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    标签
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    发布日期
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      当前筛选下暂无文章，
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/admin/create")}
                        className="h-auto p-0 text-blue-600 hover:bg-transparent hover:underline dark:text-blue-400"
                      >
                        创建一篇
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const postStatus = post.status ?? "published";
                    const statusMeta = POST_STATUS_META[postStatus];

                    return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {post.summary}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={statusMeta.className}>
                          {statusMeta.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.createdAt 
                          ? new Date(post.createdAt).toLocaleDateString() 
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            onClick={() => handleToggleStatus(post.id, postStatus)}
                            variant="outline"
                            className="gap-2"
                            title={postStatus === "published" ? "切换为草稿" : "发布文章"}
                          >
                            <UpdateIcon className="w-4 h-4" />
                            {postStatus === "published" ? "设为草稿" : "发布"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => navigate(`/admin/edit/${post.id}`)}
                            variant="ghost"
                            className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/40"
                            title="编辑"
                          >
                            <Pencil1Icon className="w-5 h-5" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            variant="ghost"
                            className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                            title="删除"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 评论管理标签页 */}
      {activeTab === 'comments' && (
        <CommentManagement />
      )}
    </div>
  );
}
