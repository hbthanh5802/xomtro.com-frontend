/* eslint-disable react-hooks/rules-of-hooks */
import { axiosRequest } from '@/configs/axios.config';
import { geocodingReverseResponseType, GetDistrictListType, GetProvincesListType } from '@/types/location.type';
import { useQuery } from '@tanstack/react-query';
import { TanstackQueryOptions } from './../types/common.type';

class locationServices {
  getAllProvinces(options: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['provinces'],
      queryFn: () =>
        axiosRequest<GetProvincesListType[]>({
          url: '/location/provinces/all',
        }),
      ...options,
      enabled: true,
    });
  }

  getDistrictsByProvinceCode(provinceCode: number, options: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['districts', provinceCode],
      queryFn: () =>
        axiosRequest<GetDistrictListType[]>({
          url: '/location/districts',
          params: { provinceCode },
        }),
      ...options,
      enabled: !!provinceCode,
    });
  }

  getWardsByDistrictCode(districtCode: number, options: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['wards', districtCode],
      queryFn: () =>
        axiosRequest<GetDistrictListType[]>({
          url: '/location/wards',
          params: { districtCode },
        }),
      ...options,
      enabled: !!districtCode,
    });
  }

  getGeoCodingReverse(latitude: number, longitude: number) {
    return axiosRequest<geocodingReverseResponseType>({
      method: 'GET',
      url: '/location/geocode/reverse',
      params: { latitude, longitude },
    });
  }
}

export default new locationServices();
