import PostCard from "../components/PostCard";
import { mockPosts } from "../assets/mockPosts";

export default function HomePage() {
  return (
    <div>
      {/* 页面标题 */}
      <header className="mb-12">
        <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2">
          欢迎来到
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          我的个人博客
        </h1>
        <p className="text-xl text-gray-600">
          分享技术经验，记录学习笔记
        </p>
      </header>

      {/* 文章列表 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

