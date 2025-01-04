import { axiosRequest } from '@/configs/axios.config';
import {
  GetPostPriceAnalyticConditionDataType,
  GetPostPriceAnalyticConditionResponseType,
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

  getPostPriceAnalyticByConditions(data: GetPostPriceAnalyticConditionDataType) {
    return axiosRequest<GetPostPriceAnalyticConditionResponseType[]>({
      url: '/analytic/posts/post-price',
      method: 'POST',
      data,
    });
  }
}

export default new analyticService();
