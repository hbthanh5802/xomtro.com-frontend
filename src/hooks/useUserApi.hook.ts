import userService from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';

type QueryOptions = {
  staleTime?: number;
  catchTime?: number;
};

class useUserApi {
  useUserDetail(userId: number, queryOptions?: QueryOptions) {
    return useQuery({
      queryKey: ['user-detail', { userId }],
      queryFn: () => userService.getUserDetailByUserId(userId),
      enabled: !!userId,
      ...queryOptions,
    });
  }

  useUserAvatar(userId: number, queryOptions?: QueryOptions) {
    return useQuery({
      queryKey: ['user-avatar', { userId }],
      queryFn: () => userService.getUserAvatarByUserId(userId),
      enabled: !!userId,
      ...queryOptions,
    });
  }
}

export default new useUserApi();
