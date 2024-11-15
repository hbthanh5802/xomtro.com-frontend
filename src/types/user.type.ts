import { updateUserRoleValidation } from '@/validations/auth.validation';
import { updateAvatarValidation } from '@/validations/user.validation';
import { z } from 'zod';

export type UserRoleDataType = z.infer<typeof updateUserRoleValidation>;

export type UpdateAvatarDataType = z.infer<typeof updateAvatarValidation>;
