import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MyBlog</span>
          </Link>

          {/* 导航链接 */}
          <ul className="flex items-center gap-8">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                首页
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                文章
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                管理后台
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
