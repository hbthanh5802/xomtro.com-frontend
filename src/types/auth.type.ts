import { UserDetailSelectSchemaType } from '@/types/schema.type';
import { registerUserValidation, verifyUserValidation } from '@/validations/auth.validation';
import { z } from 'zod';

export type RegisterDataType = z.infer<typeof registerUserValidation>;

export type VerifyUserDataType = z.infer<typeof verifyUserValidation>;

export type TokenResponseType = {
  refreshToken: string;
  accessToken: string;
};

export type LoginUserResponseType = {
  userDetail: UserDetailSelectSchemaType;
  meta: TokenResponseType;
};

export type GoogleAuthDataType = {
  credential: string;
};
