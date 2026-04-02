import { ClockIcon, CheckCircledIcon } from "@radix-ui/react-icons";

interface ActivityItem {
  id: string;
  type: "login" | "profile_update" | "avatar_update" | "password_change";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning";
  ip?: string;
  device?: string;
}

interface ActivityLogProps {
  activities?: ActivityItem[];
}

const STAT_CARDS = [
  {
    label: "总登录次数",
    value: "12",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
  },
  {
    label: "最后登录",
    value: "今天",
    className: "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300",
  },
  {
    label: "信息修改",
    value: "3次",
    className: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300",
  },
  {
    label: "安全事件",
    value: "0",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
  },
];

const ACTIVITY_CARD_STYLES: Record<string, string> = {
  login: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20",
  profile_update: "border-purple-200 bg-purple-50/70 dark:border-purple-900 dark:bg-purple-950/20",
  avatar_update: "border-pink-200 bg-pink-50/70 dark:border-pink-900 dark:bg-pink-950/20",
  password_change: "border-yellow-200 bg-yellow-50/70 dark:border-yellow-900 dark:bg-yellow-950/20",
};

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "login",
    title: "登录成功",
    description: "用浏览器登录到您的账账号",
    timestamp: "2026-03-26 14:30:00",
    status: "success",
    ip: "192.168.1.100",
    device: "Chrome (Windows)",
  },
  {
    id: "2",
    type: "avatar_update",
    title: "更新头像",
    description: "上传新的头像图片",
    timestamp: "2026-03-26 12:15:00",
    status: "success",
  },
  {
    id: "3",
    type: "profile_update",
    title: "更新个人信息",
    description: "修改用户名和个人简介",
    timestamp: "2026-03-25 18:45:00",
    status: "success",
  },
  {
    id: "4",
    type: "password_change",
    title: "修改密码",
    description: "密码已成功更新",
    timestamp: "2026-03-25 10:20:00",
    status: "success",
  },
  {
    id: "5",
    type: "login",
    title: "登录成功",
    description: "用浏览器登录到您的账号",
    timestamp: "2026-03-24 16:00:00",
    status: "success",
    ip: "192.168.1.101",
    device: "Safari (MacOS)",
  },
];

export default function ActivityLog({ activities = MOCK_ACTIVITIES }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    return <CheckCircledIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
  };

  const getActivityColor = (type: string) => {
    return ACTIVITY_CARD_STYLES[type] || "border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/20";
  };

  const getActivityTitle = (type: string) => {
    const titles: Record<string, string> = {
      login: "登录",
      profile_update: "资料更新",
      avatar_update: "头像更新",
      password_change: "密码修改",
    };
    return titles[type] || "活动";
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的记录</h2>
        <p className="text-gray-600 dark:text-gray-400">查看您的账号活动历史</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-4 shadow-sm ${stat.className}`}>
            <p className="text-sm opacity-90">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 活动时间线 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          最近活动
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">暂无活动记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`rounded-lg border border-l-4 p-4 ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start gap-4">
                  {/* 图标 */}
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-500 whitespace-nowrap dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>

                    {/* 额外信息 */}
                    {(activity.ip || activity.device) && (
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {activity.device && <p>📱 设备：{activity.device}</p>}
                        {activity.ip && <p>🔗 IP：{activity.ip}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 安全建议 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          💡 安全建议
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>✓ 定期检查您的登录记录，确保账号安全</li>
          <li>✓ 如果发现异常登录，建议立即修改密码</li>
          <li>✓ 不要在公共设备上勾选"记住我"</li>
          <li>✓ 定期更新您的个人信息和隐私设置</li>
        </ul>
      </div>
    </div>
  );
}
