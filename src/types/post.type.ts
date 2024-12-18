import { PaginationType } from '@/store/postFilterSlice';
import {
  insertJoinPostValidation,
  insertPassPostItemValidation,
  insertPassPostValidation,
  insertPostCommentValidation,
  insertRentalPostValidation,
  insertWantedPostValidation,
} from '@/validations/post.validation';
import { z } from 'zod';

export type InsertRentalPostDataType = z.infer<typeof insertRentalPostValidation>;

export type InsertWantedPostDataType = z.infer<typeof insertWantedPostValidation>;

export type InsertJoinPostDataType = z.infer<typeof insertJoinPostValidation>;

export type InsertPassPostDataType = z.infer<typeof insertPassPostValidation>;

export type InsertPassPostItemDataType = z.infer<typeof insertPassPostItemValidation>;

export type RenewPostDataType = {
  expirationAfter: number | undefined;
  expirationAfterUnit: 'hour' | 'day' | 'week' | 'month';
};

export type GetPostCommentDataType = {
  whereConditions: { parentCommentId?: number };
  orderConditions: { updatedAt?: 'asc' | 'desc' };
  pagination: PaginationType;
};

export type InsertPostCommentDataType = z.infer<typeof insertPostCommentValidation>;
