import { type ReactNode, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题提供者组件
 * 订阅 store 中的主题状态，在 useEffect 中同步到 DOM
 * 这样做能避免 SSR Hydration 问题，遵循 React 生命周期最佳实践
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  // 精确订阅 theme 状态，当它改变时组件会重新渲染
  const theme = useThemeStore((state) => state.theme);

  // 在 useEffect 中处理所有 DOM 操作
  // 确保 DOM 操作只在客户端、组件挂载后执行
  useEffect(() => {
    const html = document.documentElement;
    
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    
    console.log("DOM updated with theme:", theme);
  }, [theme]); // 当 theme 改变时执行

  return <>{children}</>;
}
