import { userContacts } from '@/configs/schema.config';
import { dateValidation, imageFileValidation, phoneValidation } from '@/validations/common.validation';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const updateAvatarValidation = z.object({
  avatar: imageFileValidation,
});

export const updateUserDetailValidation = z.object({
  firstName: z.string(),
  lastName: z.string().min(1, { message: 'Thông tin này là bắt buộc' }),
  dob: dateValidation.optional(),
  phone: phoneValidation.optional(),
  bio: z.string().optional(),
  gender: z.enum(['male', 'female', 'others']).nullable().optional(),
  email: z.string().min(1, { message: 'Thông tin này là bắt buộc' }),
});

export const insertUserContactValidation = createInsertSchema(userContacts, {
  contactContent: z.string().min(1, { message: 'Thông tin này không được để trống.' }),
}).omit({ userId: true });
