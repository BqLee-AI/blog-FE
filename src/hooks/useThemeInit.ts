import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore.ts";

/**
 * 初始化主题的 Hook
 * 在应用启动时在 App.tsx 中调用，确保保存的主题被正确恢复
 */
export function useThemeInit() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    // 应用启动时，立即同步主题到 DOM
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // 监听浏览器主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // 只有当用户没有手动设置过主题时，才跟随系统主题
      const savedTheme = localStorage.getItem("blog-theme");
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
      }
    };

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleThemeChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleThemeChange);
    }

    // 清理监听器
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleThemeChange);
      } else {
        // 兼容旧版浏览器
        mediaQuery.removeListener(handleThemeChange);
      }
    };
  }, [setTheme]);
}
