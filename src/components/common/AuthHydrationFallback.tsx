import { AUTH_HYDRATION_FALLBACK_COPY } from "@/constants/auth";
import { cn } from "@/components/ui/utils";

interface AuthHydrationFallbackProps {
  className?: string;
}

export function AuthHydrationFallback({ className }: AuthHydrationFallbackProps) {
  return (
    <div
      className={cn("flex min-h-[60vh] items-center justify-center px-4", className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {AUTH_HYDRATION_FALLBACK_COPY.label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {AUTH_HYDRATION_FALLBACK_COPY.description}
          </p>
        </div>
      </div>
    </div>
  );
}
