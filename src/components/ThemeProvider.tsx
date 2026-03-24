import { type ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "../store/themeStore.ts";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题提供者组件
 * 1. 订阅 store 中的主题状态
 * 2. 同步主题到 DOM (添加/移除 dark 类)
 * 3. 监听系统主题变化（当用户未手动设置时）
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [mounted, setMounted] = useState(false);

  // 同步主题到 DOM
  useEffect(() => {
    setMounted(true); // 标记组件已挂载（避免 hydration 问题）
    
    const html = document.documentElement;
    
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    
    console.log("Theme synced to DOM:", theme);
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // 只有当用户没有手动设置过主题时，才跟随系统主题
      const savedTheme = localStorage.getItem("blog-theme");
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        console.log("📱 System theme changed to:", newTheme);
        setTheme(newTheme);
      }
    };

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleThemeChange);
      return () => mediaQuery.removeEventListener("change", handleThemeChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleThemeChange);
      return () => mediaQuery.removeListener(handleThemeChange);
    }
  }, [mounted, setTheme]);

  return <>{children}</>;
}
