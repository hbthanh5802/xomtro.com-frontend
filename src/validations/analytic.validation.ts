import { dateValidation } from '@/validations/common.validation';
import { z } from 'zod';

export const getPostsCountByTypeWithPostConditionsValidation = z.object({
  ownerId: z.number().optional(),
  dateStart: dateValidation.optional(),
  dateEnd: dateValidation.optional(),
  provinceName: z.string().optional(),
  districtName: z.string().optional(),
  wardName: z.string().optional(),
  status: z.enum(['actived', 'unactived']).optional(),
});
