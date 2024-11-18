import { insertAddressValidation } from '@/validations/address.validation';
import { z } from 'zod';

export type InsertAddressDataType = z.infer<typeof insertAddressValidation>;
