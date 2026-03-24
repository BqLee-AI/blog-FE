import { Link } from "react-router-dom";
import { useThemeStore } from "../store/themeStore.ts";
import { useUserStore } from "../store/userStore.ts";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function Header() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useUserStore((state) => state.user);

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
                className="hover-button px-4 py-2 bg-blue-600 text-white rounded-lg dark:bg-blue-700 font-medium"
              >
                管理后台
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full"
                title="账号设置"
              >
                <img
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                  alt="用户头像"
                  className="hover-avatar w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              </Link>
            </li>
            {/* 主题切换按钮 */}           
            <li>
              <button
                onClick={toggleTheme}
                className="hover-button p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400"
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
