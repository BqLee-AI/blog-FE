import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { MoonIcon, SunIcon, MagnifyingGlassIcon, PersonIcon, HomeIcon, FileTextIcon, GearIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 全局登录弹窗控制函数
export function setLoginPopoverOpen(open: boolean) {
  const event = new CustomEvent("toggleLoginPopover", { detail: { open } });
  window.dispatchEvent(event);
}

export default function Header() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { user, isLoggedIn } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [scrollThreshold] = useState(80);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > lastScrollPos;
      const hasScrolledEnough = Math.abs(currentScrollPos - lastScrollPos) > scrollThreshold;

      if (isScrollingDown && hasScrolledEnough && isVisible) {
        setIsVisible(false);
      } else if (!isScrollingDown && !isVisible) {
        setIsVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos, isVisible, scrollThreshold]);

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-all duration-300 overflow-visible ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center justify-between h-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MyBlog
            </span>
          </Link>

          {/* 搜索栏 */}
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 pl-10 pr-4"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* 导航链接 */}
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-2 hover-button"
              >
                <HomeIcon className="w-5 h-5" />
                <span>首页</span>
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-2 hover-button"
              >
                <FileTextIcon className="w-5 h-5" />
                <span>文章</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover-button"
              >
                <GearIcon className="w-5 h-5" />
                <span>管理后台</span>
              </Link>
            </li>
            {isLoggedIn && user ? (
              <li>
                <Link
                  to="/account"
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                  title="账号设置"
                >
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email}
                    alt="用户头像"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                </Link>
              </li>
            ) : (
              <li>
                <Button
                  type="button"
                  onClick={() => setLoginPopoverOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PersonIcon className="w-4 h-4" />
                  <span>登录</span>
                </Button>
              </li>
            )}
            {/* 主题切换按钮 */}           
            <li>
              <button
                type="button"
                onClick={toggleTheme}
                className="group p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-md"
                title={theme === "light" ? "切换到暗夜模式" : "切换到日间模式"}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <SunIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
