import { env } from '@/configs/environment.config';
import axios, { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}
interface customAxiosRequestConfig extends AxiosRequestConfig {
  method?: HttpMethods;
}

const axiosClient = axios.create({
  baseURL: env.BASE_URL,
  paramsSerializer: (params) => queryString.stringify(params),
});

const axiosAuth = axios.create({
  baseURL: env.BASE_URL,
  paramsSerializer: (params) => queryString.stringify(params),
  withCredentials: true,
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
    throw error;
  },
);

axiosAuth.interceptors.request.use(
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

axiosAuth.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  },
);

export const axiosRequest = <T = any>(config: customAxiosRequestConfig): Promise<ApiResponse<T>> => {
  return axiosClient(config) as Promise<ApiResponse<T>>;
};

export const axiosAuthRequest = <T = any>(config: customAxiosRequestConfig): Promise<ApiResponse<T>> => {
  return axiosAuth(config) as Promise<ApiResponse<T>>;
};
