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
    <header className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-all duration-300 ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              MyBlog
            </span>
          </Link>

          {/* 搜索栏 */}
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-72 pl-10 pr-4 bg-gray-100/50 dark:bg-gray-800/50 border-transparent hover-input transition-all focus:w-80"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* 导航链接 */}
          <ul className="flex items-center gap-1 md:gap-4 lg:gap-6">
            <li>
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <HomeIcon className="w-5 h-5" />
                <span className="hidden sm:inline">首页</span>
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <FileTextIcon className="w-5 h-5" />
                <span className="hidden sm:inline">文章</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                <GearIcon className="w-5 h-5" />
                <span className="hidden lg:inline">管理后台</span>
              </Link>
            </li>
            
            {isLoggedIn && user ? (
              <li>
                <Link
                  to="/account"
                  className="flex items-center justify-center transition-all hover-avatar"
                  title="账号设置"
                >
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email}
                    alt="用户头像"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                </Link>
              </li>
            ) : (
              <li>
                <Button
                  type="button"
                  onClick={() => setLoginPopoverOpen(true)}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition-all px-5 rounded-xl border-none h-10"
                >
                  <PersonIcon className="w-4 h-4" />
                  <span>登录</span>
                </Button>
              </li>
            )}

            {/* 主题切换按钮 */}           
            <li className="ml-1 border-l border-gray-200 dark:border-gray-800 pl-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
                title={theme === "light" ? "切换到暗夜模式" : "切换到日间模式"}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                ) : (
                  <SunIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
