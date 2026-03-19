import type { Post } from "../assets/mockPosts";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <ul>
        {post.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    </article>
  );
}
