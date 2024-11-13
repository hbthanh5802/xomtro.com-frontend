import { addresses, userDetail, users } from '@/configs/schema.config';
import {
  emailValidation,
  passwordValidation,
  phoneValidation,
  userRoleValidation,
} from '@/validations/common.validation';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const registerUserValidation = z.object({
  email: emailValidation,
  phone: phoneValidation,
  password: passwordValidation,
  role: userRoleValidation,
  firstName: z.string().trim().min(1, { message: 'Bạn chưa nhập đầy đủ thông tin!' }),
  lastName: z.string().trim().min(1, { message: 'Bạn chưa nhập đầy đủ thông tin!' }),
});

export const verifyUserValidation = z.object({
  email: emailValidation,
  otpCode: z
    .string()
    .min(1, { message: 'Vui lòng nhập mã OTP.' })
    .length(6, { message: 'Mã OTP không hợp lệ. Vui lòng kiểm tra lại!' }),
});

export const loginUserValidation = z
  .union([
    z.object({
      email: emailValidation,
    }),
    z.object({
      phone: phoneValidation,
    }),
  ])
  .and(z.object({ password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu!' }) }));

export const changeUserPasswordValidation = z
  .object({
    oldPassword: z.string().trim().min(1, { message: 'Old password is required.' }),
    newPassword: passwordValidation,
    confirmNewPassword: passwordValidation,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Confirm password does not match!',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from your old password!',
    path: ['newPassword'],
  });

export const oAuthValidation = z.object({
  credential: z.string().trim().min(1, { message: 'Credential is required!' }),
});

export const addressValidation = createInsertSchema(addresses);

export const forgotPasswordValidation = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation,
    otpCode: z.string().length(6, { message: 'Mã xác nhận không hợp lệ!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp với với nhau.',
    path: ['confirmPassword'],
  });

export const updateUserProfileValidation = createInsertSchema(userDetail)
  .pick({
    bio: true,
    firstName: true,
    lastName: true,
    gender: true,
    phone: true,
  })
  .strict()
  .partial();

export const updateUserRoleValidation = createInsertSchema(userDetail).pick({ role: true }).strict();
