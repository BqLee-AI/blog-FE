import { Link, useLocation } from "react-router-dom";
import { HomeIcon, PersonIcon, ImageIcon, LockClosedIcon, ActivityLogIcon } from "@radix-ui/react-icons";

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
    <aside className="hidden lg:flex w-48 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col flex-shrink-0">
      {/* 用户卡片 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          to="/"
          className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HomeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">返回首页</span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full px-4 py-3 flex items-start gap-3 border-l-4 transition-all ${
                isActive
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
              <div className="text-left min-w-0">
                <p
                  className={`font-medium text-xs leading-tight ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-xs transition-colors hidden xl:block truncate ${
                    isActive
                      ? "text-blue-500 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
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
