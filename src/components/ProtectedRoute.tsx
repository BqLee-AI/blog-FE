import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useHydration } from "@/hooks/useHydration";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * 路由守卫组件 - 保护需要登录的页面
 * @param allowedRoles - 允许访问的角色列表，不提供则只需登录
 * @param redirectTo - 未授权时重定向的路径，默认为 /
 */
export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const hasHydrated = useHydration();
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">正在恢复登录状态...</p>
        </div>
      </div>
    );
  }

  // 未登录：重定向到首页，保存当前路径用于登录后跳转
  if (!isLoggedIn) {
    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // 🛡️ 兜底检查：isLoggedIn=true 但 user 为 null（异常状态）
  if (!user) {
    console.warn(
      "[ProtectedRoute] 异常状态检测：isLoggedIn=true 但 user 为 null，重定向至登录",
      { isLoggedIn, user }
    );
    return (
      <Navigate
        to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // 🛡️ 需要特定角色时的权限检查（显式处理）
  if (allowedRoles) {
    // 兜底检查：user.role 缺失（值为 undefined 或其他异常值）
    if (!user.role) {
      console.warn(
        "[ProtectedRoute] 权限异常：已登录但 user.role 缺失，拒绝访问",
        { user, allowedRoles, path: location.pathname }
      );
      return <Navigate to="/unauthorized" replace />;
    }

    // 显式检查权限是否匹配
    if (!allowedRoles.includes(user.role as UserRole)) {
      console.warn(
        "[ProtectedRoute] 权限不足：用户角色不在允许列表中",
        { userRole: user.role, allowedRoles, path: location.pathname }
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 通过验证：渲染子路由
  return <Outlet />;
}
