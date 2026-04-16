import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * 全局沉浸式 Banner 组件
 * 仅在首页显示全高度，其他页面显示较窄高度或仅作为背景
 */
export const HeroBanner: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={cn(
      "relative w-full overflow-hidden transition-all duration-700",
      isHomePage ? "h-[45vh] md:h-[55vh]" : "h-[15vh] md:h-[20vh]"
    )}>
      {/* 渐变底色留空 - 待后续添加美图 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-black dark:via-slate-950 dark:to-blue-950" />
      
      {/* 动态装饰光晕 */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      {/* 装饰文字 - 仅在首页 */}
      {isHomePage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-1000">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            探索 · 发现 · 创造
          </h2>
          <p className="text-sm md:text-base text-blue-200/60 font-black uppercase tracking-[0.4em] drop-shadow-lg">
            Focus on Deep Tech & Knowledge Sharing
          </p>
        </div>
      )}

      {/* 底部遮罩融合 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </div>
  );
};
