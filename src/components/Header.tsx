import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchStore } from "@/store/searchStore";
import { MoonIcon, SunIcon, MagnifyingGlassIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function setLoginPopoverOpen(open: boolean) {
  const event = new CustomEvent("toggleLoginPopover", { detail: { open } });
  window.dispatchEvent(event);
}

export default function Header() {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { user, isLoggedIn } = useAuthStore();
  const { keyword, setKeyword } = useSearchStore();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > lastScrollPos && currentScrollPos > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const navLinks = [
    { name: "首页", path: "/" },
    { name: "文章", path: "/articles" },
    { name: "管理", path: "/admin" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isVisible ? "translate-y-0" : "-translate-y-full",
      lastScrollPos > 50 
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/5 py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 max-w-7xl">
        <nav className="grid grid-cols-3 items-center">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-lg">B</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter hidden md:block">
                MyBlog
              </span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="flex justify-center">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "text-[13px] font-black uppercase tracking-widest transition-all hover:text-blue-500",
                      location.pathname === link.path 
                        ? "text-blue-500" 
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools - Right */}
          <div className="flex items-center justify-end gap-4">
             {/* 实时搜索框 */}
            <div className="relative group hidden sm:block">
              <MagnifyingGlassIcon className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                keyword ? "text-blue-500" : "text-slate-400"
              )} />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索..."
                className="h-9 w-40 md:w-56 pl-9 bg-slate-100/50 dark:bg-white/5 border-none rounded-full text-xs font-bold focus-visible:ring-1 focus-visible:ring-blue-500/50 transition-all"
              />
            </div>

            {/* 用户/登录 */}
            {isLoggedIn && user ? (
              <Link to="/account" className="shrink-0">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                />
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLoginPopoverOpen(true)}
                className="rounded-full text-slate-500"
              >
                <PersonIcon className="w-5 h-5" />
              </Button>
            )}

            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-yellow-400"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
