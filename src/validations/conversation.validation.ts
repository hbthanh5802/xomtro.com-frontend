import { imageFileValidation, processNumberValidation } from '@/validations/common.validation';
import { z } from 'zod';

export const insertMessageValidation = z.object({
  chatId: processNumberValidation,
  content: z.string().optional(),
  image: imageFileValidation.optional(),
});
