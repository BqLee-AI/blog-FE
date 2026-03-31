import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          访问被拒绝
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          您没有权限访问此页面。
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          返回上一页
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          返回首页
        </button>
      </div>

      <div className="mt-12 max-w-md p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 提示：如果您认为这是一个错误，请联系管理员。
        </p>
      </div>
    </div>
  );
}
