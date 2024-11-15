import { imageFileValidation } from '@/validations/common.validation';
import { z } from 'zod';

export const updateAvatarValidation = z.object({
  avatar: imageFileValidation,
});
