import postService from '@/services/post.service';
import { TanstackQueryOptions } from '@/types/common.type';
import { useQuery } from '@tanstack/react-query';

export const useFullPostQuery = (postId: number, queryOptions?: TanstackQueryOptions) => {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postService.getFullPost(postId),
    enabled: !!postId,
    ...queryOptions,
  });
};
