import {
  insertJoinPostValidation,
  insertRentalPostValidation,
  insertWantedPostValidation,
} from '@/validations/post.validation';
import { z } from 'zod';

export type InsertRentalPostDataType = z.infer<typeof insertRentalPostValidation>;

export type InsertWantedPostDataType = z.infer<typeof insertWantedPostValidation>;

export type InsertJoinPostDataType = z.infer<typeof insertJoinPostValidation>;
