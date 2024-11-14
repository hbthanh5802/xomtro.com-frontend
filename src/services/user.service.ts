import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { AssetSelectSchemaType, UserDetailInsertSchemaType } from '@/types/schema.type';

class userServices {
  updateUserDetail(data: Partial<UserDetailInsertSchemaType>) {
    return axiosAuthRequest({
      method: 'PUT',
      url: '/users/me',
      data,
    });
  }

  getUserAvatarByUserId(userId: number) {
    return axiosRequest<AssetSelectSchemaType>({
      method: 'GET',
      url: `/users/${userId}/avatar`,
    });
  }

  getMyAvatar() {
    return axiosAuthRequest<AssetSelectSchemaType>({
      method: 'GET',
      url: `/users/me/avatar`,
    });
  }
}

export default new userServices();
