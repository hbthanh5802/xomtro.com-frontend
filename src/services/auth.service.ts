import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import {
  ForgotPasswordDataType,
  GoogleAuthDataType,
  LoginUserDataType,
  LoginUserResponseType,
  RegisterDataType,
  TokenResponseType,
  VerifyUserDataType,
} from '@/types/auth.type';
import { UserDetailSelectSchemaType } from '@/types/schema.type';

class AuthServices {
  async registerUser(data: RegisterDataType) {
    return axiosRequest<UserDetailSelectSchemaType>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
  }

  async loginUser(data: LoginUserDataType) {
    return axiosRequest<LoginUserResponseType>({
      method: 'POST',
      url: '/auth/login',
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

  async refreshUserToken() {
    return axiosRequest<TokenResponseType>({
      method: 'POST',
      url: '/auth/refresh',
      withCredentials: true,
    });
  }

  async getForgotPassword(email: string) {
    return axiosRequest<TokenResponseType>({
      method: 'GET',
      url: '/auth/forgot-password',
      params: { email },
    });
  }

  async completeForgotPassword(data: ForgotPasswordDataType) {
    return axiosRequest<TokenResponseType>({
      method: 'POST',
      url: '/auth/forgot-password',
      data,
    });
  }

  async logoutUser() {
    return axiosAuthRequest({
      method: 'POST',
      url: '/auth/logout',
    });
  }
}

export default new AuthServices();
