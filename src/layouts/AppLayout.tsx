import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import LoginPopover from "@/features/auth/components/LoginPopover";

export default function AppLayout() {
  const [isLoginPopoverOpen, setIsLoginPopoverOpen] = useState(false);

  // 监听登录弹窗事件
  useEffect(() => {
    const handleToggleLoginPopover = (event: any) => {
      setIsLoginPopoverOpen(event.detail.open);
    };

    window.addEventListener("toggleLoginPopover", handleToggleLoginPopover);
    return () => window.removeEventListener("toggleLoginPopover", handleToggleLoginPopover);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* 顶部导航栏 */}
      <Header />

      {/* 沉浸式 Banner */}
      <HeroBanner />

      {/* 登录弹窗 - 放在 Header 外部 */}
      <LoginPopover
        isOpen={isLoginPopoverOpen}
        onClose={() => setIsLoginPopoverOpen(false)}
      />

      {/* 主内容区域 */}
      <main className="relative z-10 flex-1 container mx-auto px-4 pb-20 max-w-6xl -mt-10 md:-mt-16">
        <Outlet />
      </main>

      {/* 底部页脚 */}
      <Footer />
    </div>
  );
}
