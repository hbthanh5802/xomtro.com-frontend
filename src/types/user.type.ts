import { updateUserRoleValidation } from '@/validations/auth.validation';
import { z } from 'zod';

export type userRoleDataType = z.infer<typeof updateUserRoleValidation>;
