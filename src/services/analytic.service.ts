import { axiosRequest } from '@/configs/axios.config';
import { GetPostsCountByTypeWithPostConditionsDataType } from '@/types/analytic.type';

export type GetPostsCountByTypeWithPostConditionsResponseType = {
  totalPosts: number;
  type: 'rental' | 'wanted' | 'join' | 'pass';
  ownerId?: number;
};

class analyticService {
  getPostsCountByTypeWithPostConditions(data: GetPostsCountByTypeWithPostConditionsDataType) {
    return axiosRequest<GetPostsCountByTypeWithPostConditionsResponseType[]>({
      method: 'POST',
      url: '/analytic/posts/count-by-type',
      data,
    });
  }
}

export default new analyticService();
