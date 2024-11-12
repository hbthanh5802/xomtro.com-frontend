import { axiosRequest } from '@/configs/axios.config';
import { GoogleAuthDataType, LoginUserResponseType, RegisterDataType, VerifyUserDataType } from '@/types/auth.type';
import { UserDetailSelectSchemaType } from '@/types/schema.type';

class AuthServices {
  async registerUser(data: RegisterDataType) {
    return axiosRequest<UserDetailSelectSchemaType>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
  }

  async getVerifyUser(email: string) {
    return axiosRequest({
      method: 'GET',
      url: '/users/verify/email',
      params: { email },
    });
  }

  async verifyUser(data: VerifyUserDataType) {
    return axiosRequest<LoginUserResponseType>({
      method: 'POST',
      url: '/users/verify/email',
      data,
    });
  }

  async googleAuth(data: GoogleAuthDataType) {
    return axiosRequest<LoginUserResponseType>({
      method: 'POST',
      url: '/auth/google',
      data,
      withCredentials: true,
    });
  }
}

export default new AuthServices();
