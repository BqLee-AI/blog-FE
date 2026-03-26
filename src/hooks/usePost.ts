import { usePostStore } from "@/store/postStore";

/**
 * 自定义 Hook：获取文章相关的状态和方法
 * 
 * 使用示例：
 * const { posts, currentPost, isLoading } = usePost();
 */
export const usePost = () => {
  return usePostStore();
};

/**
 * 自定义 Hook：获取单个文章
 * 
 * 使用示例：
 * const { post, loading } = usePostDetail(1);
 */
export const usePostDetail = (id: number) => {
  const { currentPost, fetchPostById, isLoading } = usePostStore();

  return {
    post: currentPost,
    loading: isLoading,
    fetch: () => fetchPostById(id),
  };
};
