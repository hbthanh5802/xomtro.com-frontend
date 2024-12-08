import {
  insertJoinPostValidation,
  insertPassPostItemValidation,
  insertPassPostValidation,
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
