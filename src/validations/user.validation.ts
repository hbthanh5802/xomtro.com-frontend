import { userDetail } from '@/configs/schema.config';
import { dateValidation, imageFileValidation, phoneValidation } from '@/validations/common.validation';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const updateAvatarValidation = z.object({
  avatar: imageFileValidation,
});

export const updateUserDetailValidation = createInsertSchema(userDetail, {
  firstName: z.string().optional(),
  lastName: z.string().min(1, { message: 'Thông tin này này là bắt buộc' }),
  phone: phoneValidation,
  dob: dateValidation,
})
  .pick({
    firstName: true,
    lastName: true,
    gender: true,
    bio: true,
    phone: true,
    email: true,
    dob: true,
  })
  .strip();
