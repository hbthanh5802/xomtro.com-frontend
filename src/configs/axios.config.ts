import { env } from '@/configs/environment.config';
import authService from '@/services/auth.service';
import { useAppStore } from '@/store/store';
import { TokenResponseType } from '@/types/auth.type';
import { handleAxiosError } from '@/utils/constants.helper';
import history from '@/utils/history.helper';
import { timeInVietNam } from '@/utils/time.helper';
import axios, { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import queryString from 'query-string';
import { toast } from 'sonner';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
}
interface customAxiosRequestConfig extends AxiosRequestConfig {
  method?: HttpMethods;
}

const axiosClient = axios.create({
  baseURL: `${env.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

const axiosAuth = axios.create({
  baseURL: `${env.BASE_URL}/api`,
  paramsSerializer: (params) => queryString.stringify(params),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (config.data) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const { status } = handleAxiosError(error)!;
    if (status === 403) {
      history.push('/403');
    }
    throw error;
  },
);

let refreshTokenRequest: unknown = null;
axiosAuth.interceptors.request.use(
  async (config) => {
    let accessToken = useAppStore.getState().accessToken;
    const decodeToken = jwtDecode(accessToken as string);
    const date = timeInVietNam().toDate();

    if (!decodeToken.exp) {
      throw new Error('Token expiration is undefined');
    }
    if (decodeToken.exp < Math.floor(date.getTime() / 1000)) {
      console.log('Expired', { exp: decodeToken.exp, date: date.getTime() });
      refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : authService.refreshUserToken();
      try {
        const response = (await refreshTokenRequest) as ApiResponse<TokenResponseType>;
        if (response && response.data) {
          const { meta } = response.data;
          if (meta.accessToken) {
            accessToken = meta.accessToken;
            useAppStore.getState().setAccessToken(accessToken);
          }
        }
        refreshTokenRequest = null;
      } catch (error) {
        console.log('Refresh failed!', error);
        const { status } = handleAxiosError(error)!;
        if (status === 401) {
          useAppStore.getState().resetAuthState();
          useAppStore.getState().resetUserState();
          toast.info('Có lỗi xảy ra. Vui lòng đăng nhập lại!', {
            duration: 1000,
            onAutoClose: () => history.push('/auth/login'),
          });
        }
      }
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    throw error;
  },
);

axiosAuth.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const { status } = handleAxiosError(error)!;
    if (status === 403) {
      history.push('/403');
    }
    throw error;
  },
);

export const axiosRequest = <T = unknown>(config: customAxiosRequestConfig): Promise<ApiResponse<T>> => {
  return axiosClient(config) as Promise<ApiResponse<T>>;
};

export const axiosAuthRequest = <T = unknown>(config: customAxiosRequestConfig): Promise<ApiResponse<T>> => {
  return axiosAuth(config) as Promise<ApiResponse<T>>;
};
