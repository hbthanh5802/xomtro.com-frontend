/* eslint-disable react-hooks/rules-of-hooks */
import userService from '@/services/user.service';
import { TanstackQueryOptions } from '@/types/common.type';
import { useQuery } from '@tanstack/react-query';

class useUserApi {
  useUserDetail(userId: number, queryOptions?: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['user-detail', { userId }],
      queryFn: () => userService.getUserDetailByUserId(userId),
      enabled: !!userId,
      ...queryOptions,
    });
  }

  useUserAvatar(userId: number, queryOptions?: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['user-avatar', { userId }],
      queryFn: () => userService.getUserAvatarByUserId(userId),
      enabled: !!userId,
      ...queryOptions,
    });
  }
}

export default new useUserApi();
