import { UserDetailSelectSchemaType } from '@/types/schema.type';
import { registerUserValidation, verifyUserValidation } from '@/validations/auth.validation';
import { z } from 'zod';

export type RegisterDataType = z.infer<typeof registerUserValidation>;

export type VerifyUserDataType = z.infer<typeof verifyUserValidation>;

export type TokenResponseType = {
  meta: {
    refreshToken: string;
    accessToken: string;
  };
};

export type LoginUserResponseType = {
  userDetail: UserDetailSelectSchemaType;
} & TokenResponseType;

export type GoogleAuthDataType = {
  credential: string;
};
