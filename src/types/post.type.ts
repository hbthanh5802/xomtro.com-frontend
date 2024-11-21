import { insertRentalPostValidation } from '@/validations/post.validation';
import { z } from 'zod';

export type InsertRentalPostDataType = z.infer<typeof insertRentalPostValidation>;
