import { axiosAuthRequest } from '@/configs/axios.config';
import { InsertRentalPostDataType } from '@/types/post.type';

class postServices {
  createRentalPost(data: InsertRentalPostDataType) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/rental',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new postServices();
