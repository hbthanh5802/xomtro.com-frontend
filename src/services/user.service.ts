import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { AssetSelectSchemaType, UserDetailInsertSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { UpdateAvatarDataType, UpdateUserPasswordDataType } from '@/types/user.type';

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

  updateUserAvatar(data: UpdateAvatarDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/users/avatar`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  getUserDetailByUserId(userId: number) {
    return axiosRequest<UserDetailSelectSchemaType>({
      method: 'GET',
      url: `/users/` + userId,
    });
  }

  updateUserPassword(data: UpdateUserPasswordDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/users/password`,
      data,
    });
  }
}

export default new userServices();
