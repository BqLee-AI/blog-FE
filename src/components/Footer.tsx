export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 dark:bg-black text-slate-300 mt-20 transition-colors border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* 品牌/关于 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MyBlog</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              致力于分享最前沿的技术洞察与实战经验。不仅仅是代码，更是关于如何构建更美好的数字世界。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">快速链接</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="/" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  首页
                </a>
              </li>
              <li>
                <a href="/articles" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  文章归档
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                  分类
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">社交媒体</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="https://github.com" className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </span>
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                   <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-sky-500 transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </span>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>&copy; {currentYear} MyBlog. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-blue-400 transition-colors">服务条款</a>
            <a href="#" className="hover:text-blue-400 transition-colors">站点地图</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
