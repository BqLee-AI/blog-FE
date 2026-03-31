import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Hook：检查 zustand store 的 hydration 状态
 * hydration 是指从 localStorage 恢复持久化状态的过程
 * 
 * 在某些需要同步检查认证状态的场景中使用（如路由守卫）
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 设置初始 hydration 状态
    const isHydrated = useAuthStore.persist?.hasHydrated?.() ?? true;
    setHydrated(isHydrated);

    // 如果还未 hydrated，监听完成事件
    if (!isHydrated) {
      const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => {
        setHydrated(true);
      });

      return () => {
        unsubscribe?.();
      };
    }
  }, []);

  return hydrated;
}
