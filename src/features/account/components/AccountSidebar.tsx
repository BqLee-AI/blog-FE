import { Link, useLocation } from "react-router-dom";
import { HomeIcon, PersonIcon, ImageIcon, LockClosedIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

type AccountTab = "profile" | "avatar" | "security" | "activity";

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const location = useLocation();

  const navItems = [
    {
      id: "profile" as AccountTab,
      label: "我的信息",
      icon: PersonIcon,
      description: "管理个人资料和基本信息",
    },
    {
      id: "avatar" as AccountTab,
      label: "我的头像",
      icon: ImageIcon,
      description: "上传和更改头像",
    },
    {
      id: "security" as AccountTab,
      label: "账号安全",
      icon: LockClosedIcon,
      description: "修改密码和安全设置",
    },
    {
      id: "activity" as AccountTab,
      label: "我的记录",
      icon: ActivityLogIcon,
      description: "查看账号活动记录",
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/60">
      {/* 用户卡片 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900/60"
        >
          <HomeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span>返回首页</span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              variant="ghost"
              className={`w-full h-auto justify-start gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
                isActive
                  ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-900/60"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} />
              <div className="text-left min-w-0">
                <p className={`font-medium text-sm leading-tight ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}>
                  {item.label}
                </p>
                <p className={`text-xs transition-colors hidden xl:block truncate ${isActive ? "text-blue-500 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>
                  {item.description}
                </p>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-950/40">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          需要帮助？查看{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            常见问题
          </a>
        </p>
      </div>
    </aside>
  );
}
