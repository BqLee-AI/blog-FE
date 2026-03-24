import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 获取初始主题（纯逻辑，不操作 DOM）
const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem("blog-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    // 如果没有保存的主题，则使用系统主题
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
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

  setTheme: (newTheme: Theme) => {
    set(() => {
      // 保存到 localStorage
      try {
        localStorage.setItem("blog-theme", newTheme);
      } catch (e) {
        console.error("Failed to save theme:", e);
      }

      console.log("Theme set to:", newTheme);

      return { theme: newTheme };
    });
  },
}));

// 监听浏览器主题变化
if (typeof window !== "undefined" && window.matchMedia) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleThemeChange = (e: MediaQueryListEvent) => {
    // 只有当用户没有手动设置过主题时，才跟随系统主题
    const savedTheme = localStorage.getItem("blog-theme");
    if (!savedTheme) {
      const newTheme = e.matches ? "dark" : "light";
      useThemeStore.getState().setTheme(newTheme);
    }
  };

  // 添加监听器
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleThemeChange);
  } else {
    // 兼容旧版浏览器
    mediaQuery.addListener(handleThemeChange);
  }
}
