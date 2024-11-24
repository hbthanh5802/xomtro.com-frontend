import { posts, rentalPosts } from '@/configs/schema.config';
import { imageFileValidation } from '@/validations/common.validation';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const insertPostValidation = createInsertSchema(posts);

export const insertRentalPostValidation = createInsertSchema(rentalPosts)
  .omit({
    postId: true,
  })
  .and(insertPostValidation)
  .and(
    z.object({
      assets: z.array(imageFileValidation).optional(),
    }),
  )
  .refine(
    (data) => {
      if (data.priceEnd) {
        // Chỉ kiểm tra khi priceEnd có giá trị
        return data.priceStart <= data.priceEnd;
      }
      return true; // Bỏ qua nếu priceEnd không tồn tại
    },
    {
      message: '"Giá kết thúc" không thể thấp hơn "Giá khởi điểm"',
      path: ['priceEnd'], // Chỉ định trường lỗi
    },
  );