import { Link } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center justify-between h-0.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MyBlog
            </span>
          </Link>

          {/* 导航链接 */}
          <ul className="flex items-center gap-8">
            <li>
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                首页
              </Link>
            </li>
            <li>
              <a
                href="#articles"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                文章
              </a>
            </li>
            <li>
              <Link
                to="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
              >
                管理后台
              </Link>
            </li>

            {/* 主题切换按钮 */}
            <li>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={theme === "light" ? "切换到暗夜模式" : "切换到日间模式"}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
