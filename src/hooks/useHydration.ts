import { useAuthStore } from "@/store/authStore";

export function useHydration() {
  return useAuthStore((state) => state.hasHydrated);
}