import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePostStore } from "../store/postStore";
import { PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

export default function AdminDashboardPage() {
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      // 调用 store 的 deletePost，但我们需要更新 store
      // 这里先提示用户
      alert("删除功能需要后端 API 支持");
    }
  };

  return (
    <div>
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-600">文章管理</h1>
          <p className="text-gray-600 mt-2">管理和编辑你的所有文章</p>
        </div>
        <Link
          to="/admin/create"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          新建文章
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">总文章数</div>
          <div className="text-3xl font-bold text-gray-900">{posts.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">最近更新</div>
          <div className="text-lg font-semibold text-gray-900">
            {posts[0]?.createdAt 
              ? new Date(posts[0].createdAt).toLocaleDateString() 
              : "-"}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">总标签数</div>
          <div className="text-3xl font-bold text-gray-900">
            {new Set(posts.flatMap((p) => p.tags)).size}
          </div>
        </div>
      </div>

      {/* 文章列表表格 */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                标题
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                标签
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                发布日期
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  暂无文章，
                  <Link to="/admin/create" className="text-blue-600 hover:underline">
                    创建一篇
                  </Link>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {post.summary}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.createdAt 
                      ? new Date(post.createdAt).toLocaleDateString() 
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/edit/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Pencil1Icon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
