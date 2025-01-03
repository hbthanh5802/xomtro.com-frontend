import { axiosRequest } from '@/configs/axios.config';
import {
  GetPostsCountByTypeWithPostConditionsDataType,
  GetPostsCountByTypeWithPostConditionsResponseType,
} from '@/types/analytic.type';

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
