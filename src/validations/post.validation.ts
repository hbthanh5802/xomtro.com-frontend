import {
  joinPosts,
  passPostItems,
  passPosts,
  postComments,
  posts,
  rentalPosts,
  wantedPosts,
} from '@/configs/schema.config';
import { dateValidation, imageFileValidation } from '@/validations/common.validation';
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

export const insertWantedPostValidation = createInsertSchema(wantedPosts, {
  moveInDate: dateValidation,
})
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

export const insertJoinPostValidation = createInsertSchema(joinPosts, {
  moveInDate: dateValidation,
})
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

export const insertPassPostItemValidation = createInsertSchema(passPostItems, {
  passItemPrice: z.preprocess((value) => {
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }, z.number()),
}).pick({
  passItemName: true,
  passItemPrice: true,
  passItemStatus: true,
});

export const insertPassPostValidation = createInsertSchema(passPosts)
  .omit({
    postId: true,
    priceStart: true,
    priceEnd: true,
    priceUnit: true,
  })
  .and(insertPostValidation)
  .and(
    z.object({
      passItems: z.array(insertPassPostItemValidation).min(1, {
        message: 'passItems phải có ít nhất một phần tử',
      }),
      assets: z.array(imageFileValidation).optional(),
    }),
  );

export const renewPostValidation = createInsertSchema(posts).pick({
  expirationAfter: true,
  expirationAfterUnit: true,
});

export const insertPostCommentValidation = createInsertSchema(postComments).refine(
  (data) => {
    // Nếu không có tags, content không được rỗng
    if (!data.tags) {
      return data.content.trim() !== '';
    }
    return true;
  },
  {
    message: 'Content cannot be empty if tags are not provided.',
    path: ['content'], // Chỉ định lỗi sẽ được gán vào trường "content"
  },
);
