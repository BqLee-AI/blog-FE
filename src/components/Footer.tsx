export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-200 dark:text-gray-300 mt-16 transition-colors">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 关于 */}
          <div>
            <h3 className="text-white dark:text-white font-bold mb-4">关于本站</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
              这是一个现代化的个人博客，分享开发经验和技术知识。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-white dark:text-white font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  首页
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  文章归档
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  分类
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h3 className="text-white dark:text-white font-bold mb-4">社交媒体</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition">
                  联系我
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-gray-400 dark:text-gray-600 text-sm">
          <p>&copy; {currentYear} MyBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
