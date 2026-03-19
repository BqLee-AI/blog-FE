import PostCard from "../components/PostCard";
import { mockPosts } from "../assets/mockPosts";

export default function HomePage() {
  return (
    <main className="container">
      <header>
        <p className="eyebrow">Demo Blog</p>
        <h1>React Example in src</h1>
        <p className="subtitle">A small sample with typed data, page, and component.</p>
      </header>

      <section className="post-grid">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
