import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { AuthUser, UserRole } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn(),
  mockUseHydration: vi.fn(),
}));

const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

vi.mock("@/store/authStore", () => ({
  useAuthStore: () => mocks.mockUseAuthStore(),
}));

vi.mock("@/hooks/useHydration", () => ({
  useHydration: () => mocks.mockUseHydration(),
}));

function LocationProbe() {
  const location = useLocation();

  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function createUser(role: UserRole): AuthUser {
  return {
    id: 1,
    username: "tester",
    email: "tester@example.com",
    avatar: "https://example.com/avatar.png",
    role,
  };
}

function renderProtectedRoute({
  initialPath,
  allowedRoles,
  isLoggedIn,
  user,
  hasHydrated = true,
}: {
  initialPath: string;
  allowedRoles?: UserRole[];
  isLoggedIn: boolean;
  user: AuthUser | null;
  hasHydrated?: boolean;
}) {
  mocks.mockUseHydration.mockReturnValue(hasHydrated);
  mocks.mockUseAuthStore.mockReturnValue({ isLoggedIn, user });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<LocationProbe />} />
        <Route path="/unauthorized" element={<LocationProbe />} />
        <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
          <Route path="/account" element={<div data-testid="protected-page">account</div>} />
          <Route path="/admin" element={<div data-testid="protected-page">admin</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  mocks.mockUseAuthStore.mockReset();
  mocks.mockUseHydration.mockReset();
  consoleWarnSpy.mockReset();
});

beforeEach(() => {
  consoleWarnSpy.mockImplementation(() => {});
});

describe("ProtectedRoute", () => {
  it("在 hydration 完成前显示统一 loading 占位", () => {
    renderProtectedRoute({
      initialPath: "/account",
      isLoggedIn: false,
      user: null,
      hasHydrated: false,
    });

    expect(screen.getByText("正在恢复登录状态...")).toBeTruthy();
  });

  it("未登录访问 /account 时会携带 redirect 参数跳转", async () => {
    renderProtectedRoute({
      initialPath: "/account",
      isLoggedIn: false,
      user: null,
    });

    const location = await screen.findByTestId("location");

    expect(location.textContent).toBe("/?redirect=%2Faccount");
  });

  it("普通用户访问 /admin 时会跳转到 /unauthorized", async () => {
    renderProtectedRoute({
      initialPath: "/admin",
      isLoggedIn: true,
      user: createUser("user"),
      allowedRoles: ["admin", "superadmin"],
    });

    const location = await screen.findByTestId("location");

    expect(location.textContent).toBe("/unauthorized");
  });

  it("管理员访问 /admin 时允许进入子路由", () => {
    renderProtectedRoute({
      initialPath: "/admin",
      isLoggedIn: true,
      user: createUser("admin"),
      allowedRoles: ["admin", "superadmin"],
    });

    expect(screen.getByTestId("protected-page").textContent).toBe("admin");
  });

  it("user 缺失 role 时按拒绝策略处理", async () => {
    renderProtectedRoute({
      initialPath: "/admin",
      isLoggedIn: true,
      user: { ...createUser("user"), role: undefined } as unknown as AuthUser,
      allowedRoles: ["admin", "superadmin"],
    });

    const location = await screen.findByTestId("location");

    expect(location.textContent).toBe("/unauthorized");
  });
});