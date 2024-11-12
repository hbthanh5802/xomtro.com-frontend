import { z } from 'zod';

export const emailValidation = z
  .string()
  .trim()
  .min(1, { message: 'Vui lòng điền thông tin địa chỉ email của bạn!' })
  .email({ message: 'Email không đúng định dạng!' });

export const phoneRegex = /^(0|\+84)(\d{9})$/;
export const phoneValidation = z.string().trim().regex(phoneRegex, 'Số điện thoại không đúng tại Việt Nam');

export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const passwordValidation = z
  .string()
  .trim()
  .regex(passwordRegex, 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm 1 chữ cái viết hoa, 1 số, 1 ký tự đặc biệt.');
