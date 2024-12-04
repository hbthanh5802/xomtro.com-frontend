import { getPostsCountByTypeWithPostConditionsValidation } from '@/validations/analytic.validation';
import { z } from 'zod';

export type GetPostsCountByTypeWithPostConditionsDataType = z.infer<
  typeof getPostsCountByTypeWithPostConditionsValidation
>;
