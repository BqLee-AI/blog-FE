import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

/**
 * 初始化主题的 Hook
 * 在应用启动时在 App.tsx 中调用，确保保存的主题被正确恢复
 */
export function useThemeInit() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // 应用启动时，立即同步主题到 DOM
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);
}
