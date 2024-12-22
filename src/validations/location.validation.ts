import { z } from 'zod';

export const distanceMatrixValidation = z.object({
  origins: z.object({
    description: z.string().min(1),
    longitude: z.number(),
    latitude: z.number(),
  }),
  destinations: z
    .array(
      z.object({
        description: z.string().min(1),
        longitude: z.number(),
        latitude: z.number(),
      }),
    )
    .min(1, { message: 'Cần ít nhất một điểm kết thúc.' }),
  vehicle: z.enum(['car', 'bike', 'taxi', 'truck', 'hd']),
});
