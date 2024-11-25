import { insertRentalPostValidation, insertWantedPostValidation } from '@/validations/post.validation';
import { z } from 'zod';

export type InsertRentalPostDataType = z.infer<typeof insertRentalPostValidation>;

export type InsertWantedPostDataType = z.infer<typeof insertWantedPostValidation>;
