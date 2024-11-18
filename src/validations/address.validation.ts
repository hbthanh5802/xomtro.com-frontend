import { addresses } from '@/configs/schema.config';
import { createInsertSchema } from 'drizzle-zod';

export const insertAddressValidation = createInsertSchema(addresses).pick({
  provinceName: true,
  districtName: true,
  wardName: true,
  detail: true,
});
