import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

// 获取初始主题（纯逻辑，不操作 DOM）
const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem("blog-theme");
    return (saved === "light" || saved === "dark") ? saved : "light";
  } catch {
    return "light";
  }
};

/**
 * 极简主题管理 Store
 * 只保持纯逻辑，DOM 操作由 React 组件负责
 */
export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      
      // 保存到 localStorage
      try {
        localStorage.setItem("blog-theme", newTheme);
      } catch (e) {
        console.error("Failed to save theme:", e);
      }
      
      console.log("Theme changed to:", newTheme);
      
      return { theme: newTheme };
    });
  },
}));
