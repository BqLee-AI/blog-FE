import { mockPosts } from "@/assets/mockPosts";
import type { Post } from "@/types/post";
import {
  API_DELAY,
  ApiError,
  generateId,
  paginate,
  readJson,
  request,
  writeJson,
} from "./client";

const STORAGE_KEY = "blog-api-v1-posts";

export type ListPostsParams = {
  page?: number;
  pageSize?: number;
  tag?: string;
};

export type CreatePostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;
export type UpdatePostInput = Partial<Omit<Post, "id">>;

const clonePost = (post: Post): Post => ({
  ...post,
  tags: [...post.tags],
});

const seedPosts = (): Post[] => mockPosts.map(clonePost);

const loadPosts = (): Post[] => readJson<Post[]>(STORAGE_KEY, seedPosts()).map(clonePost);

const savePosts = (posts: Post[]): void => {
  writeJson(STORAGE_KEY, posts);
};

export const listPosts = (params: ListPostsParams = {}) =>
  request(
    () => {
      const posts = loadPosts();
      const filteredPosts =
        params.tag && params.tag !== "全部"
          ? posts.filter((post) => post.tags.includes(params.tag ?? ""))
          : posts;

      return paginate(filteredPosts, params.page, params.pageSize);
    },
    {
      delay: API_DELAY.normal,
      message: "文章列表获取成功",
    }
  );

export const getPostById = (id: number) =>
  request(
    () => {
      const post = loadPosts().find((item) => item.id === id);
      if (!post) {
        throw new ApiError("文章不存在", 404, "POST_NOT_FOUND");
      }

      return post;
    },
    {
      delay: API_DELAY.normal,
      message: "文章获取成功",
    }
  );

export const createPost = (input: CreatePostInput) =>
  request(
    () => {
      const posts = loadPosts();
      const now = new Date().toISOString();
      const post: Post = {
        id: generateId(posts.map((item) => item.id)),
        ...input,
        createdAt: now,
        updatedAt: now,
      };

      savePosts([...posts, post]);
      return post;
    },
    {
      delay: API_DELAY.slow,
      message: "文章创建成功",
    }
  );

export const updatePost = (id: number, input: UpdatePostInput) =>
  request(
    () => {
      const posts = loadPosts();
      const index = posts.findIndex((item) => item.id === id);

      if (index === -1) {
        throw new ApiError("文章不存在", 404, "POST_NOT_FOUND");
      }

      const currentPost = posts[index];
      const updatedPost: Post = {
        ...currentPost,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      posts[index] = updatedPost;
      savePosts(posts);

      return updatedPost;
    },
    {
      delay: API_DELAY.slow,
      message: "文章更新成功",
    }
  );

export const deletePost = (id: number) =>
  request(
    () => {
      const posts = loadPosts();
      const targetPost = posts.find((item) => item.id === id);

      if (!targetPost) {
        throw new ApiError("文章不存在", 404, "POST_NOT_FOUND");
      }

      savePosts(posts.filter((item) => item.id !== id));
      return targetPost;
    },
    {
      delay: API_DELAY.normal,
      message: "文章删除成功",
    }
  );

export const listTags = () =>
  request(
    () => {
      const posts = loadPosts();
      return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((left, right) =>
        left.localeCompare(right)
      );
    },
    {
      delay: API_DELAY.fast,
      message: "标签获取成功",
    }
  );
