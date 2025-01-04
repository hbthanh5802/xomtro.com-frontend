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

export type GetPostPriceAnalyticConditionDataType = {
  totalAreaStart?: number;
  totalAreaEnd?: number;
  year: number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  type?: 'rental' | 'wanted' | 'join';
};

export type GetPostPriceAnalyticConditionResponseType = {
  month: number;
  avgPrice: number;
};
