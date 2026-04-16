import React from 'react';
import { FaTwitter, FaSteam, FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export const ProfileCard: React.FC = () => {
  return (
    <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-white/40 dark:border-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/5 transition-all hover:shadow-blue-500/10 group">
      {/* 头像区域 */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-2xl group-hover:bg-blue-500/20 transition-colors" />
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=BqLee" // 之后建议换成博主自己的二次元头像
          alt="BqLee Profile"
          className="relative w-full aspect-square rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl"
        />
      </div>

      {/* 名字与简介 */}
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            BqLee
          </h3>
          <div className="w-8 h-1 bg-blue-500 rounded-full mx-auto mt-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 探索、记录与分享。
        </p>
      </div>

      {/* 社交链接 */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {[
          { icon: <FaTwitter />, color: "bg-blue-50 text-blue-400 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40", link: "#" },
          { icon: <FaSteam />, color: "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/60", link: "#" },
          { icon: <FaGithub />, color: "bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white", link: "https://github.com" },
        ].map((social, i) => (
          <a
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm",
              social.color
            )}
          >
            <span className="text-lg">{social.icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
