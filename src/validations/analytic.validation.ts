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
export const getPostPriceAnalyticConditionValidation = z
  .object({
    totalAreaStart: z.number().optional(),
    totalAreaEnd: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.totalAreaStart !== undefined && data.totalAreaEnd !== undefined) {
        return data.totalAreaStart <= data.totalAreaEnd;
      }
      return true;
    },
    {
      message: 'totalAreaStart phải nhỏ hơn hoặc bằng totalAreaEnd.',
    },
  );
