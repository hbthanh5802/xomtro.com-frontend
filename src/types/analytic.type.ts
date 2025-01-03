import { getPostsCountByTypeWithPostConditionsValidation } from '@/validations/analytic.validation';
import { z } from 'zod';

export type GetPostsCountByTypeWithPostConditionsDataType = z.infer<
  typeof getPostsCountByTypeWithPostConditionsValidation
>;

export type GetPostsCountByTypeWithPostConditionsResponseType = {
  totalPosts: number;
  type: 'rental' | 'wanted' | 'join' | 'pass';
  ownerId?: number;
};
