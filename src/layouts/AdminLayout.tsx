import { Outlet, Link, useLocation } from "react-router-dom";
import { DashboardIcon, PlusIcon, ExitIcon } from "@radix-ui/react-icons";

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "仪表板", path: "/admin", icon: DashboardIcon },
    { label: "新建文章", path: "/admin/create", icon: PlusIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 侧边栏 - 固定位置 */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span>A</span>
            </div>
            Admin
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  active
                    ? "bg-blue-600 border-r-4 border-blue-400"
                    : "hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 底部返回 */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ExitIcon className="w-5 h-5" />
            <span>返回博客</span>
          </Link>
        </div>
      </aside>

      {/* 主内容区 - 跳过侧边栏宽度 */}
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
