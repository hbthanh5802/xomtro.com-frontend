import { axiosAuthRequest } from '@/configs/axios.config';
import { UserDetailInsertSchemaType } from '@/types/schema.type';

class userServices {
  updateUserDetail(data: Partial<UserDetailInsertSchemaType>) {
    return axiosAuthRequest({
      method: 'PUT',
      url: '/users/me',
      data,
    });
  }
}

export default new userServices();
