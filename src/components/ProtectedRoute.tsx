import { Navigate, Outlet, useLocation } from "react-router-dom";
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
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

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

  // 已登录但角色不匹配：重定向到无权限页面
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 通过验证：渲染子路由
  return <Outlet />;
}
