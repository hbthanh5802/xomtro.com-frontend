import { changeUserPasswordValidation, updateUserRoleValidation } from '@/validations/auth.validation';
import {
  insertUserContactValidation,
  updateAvatarValidation,
  updateUserDetailValidation,
} from '@/validations/user.validation';
import { z } from 'zod';

export type UserRoleDataType = z.infer<typeof updateUserRoleValidation>;

export type UpdateAvatarDataType = z.infer<typeof updateAvatarValidation>;

export type UpdateUserProfileDataType = z.infer<typeof updateUserDetailValidation>;

export type UpdateUserPasswordDataType = z.infer<typeof changeUserPasswordValidation>;

export type GetUserInterestedPostsDataType = {
  whereConditions: {
    id?: number;
    postId?: number;
  };
  orderConditions: {
    createdAt?: 'asc' | 'desc';
    updatedAt?: 'asc' | 'desc';
  };
};

export type InsertUserContactDataType = z.infer<typeof insertUserContactValidation>;
