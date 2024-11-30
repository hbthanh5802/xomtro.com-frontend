/* eslint-disable react-hooks/rules-of-hooks */
import { axiosRequest } from '@/configs/axios.config';
import {
  AutoCompleteResponseType,
  GeocodingForwardResponseType,
  GeocodingReverseResponseType,
  GetDistrictListType,
  GetProvincesListType,
} from '@/types/location.type';
import { useQuery } from '@tanstack/react-query';
import { TanstackQueryOptions } from './../types/common.type';

export type GetAutoCompleteProps = {
  searchValue: string;
  longitude?: number;
  latitude?: number;
  limit?: number;
  radius?: number;
};

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

  getGeocodingForward(address: string) {
    return axiosRequest<GeocodingForwardResponseType>({
      method: 'GET',
      url: '/location/geocode/forward',
      params: { address },
    });
  }

  getGeoCodingReverse(latitude: number, longitude: number) {
    return axiosRequest<GeocodingReverseResponseType>({
      method: 'GET',
      url: '/location/geocode/reverse',
      params: { latitude, longitude },
    });
  }

  getAutoComplete(props: GetAutoCompleteProps) {
    return axiosRequest<AutoCompleteResponseType[]>({
      method: 'GET',
      url: '/location/auto-complete',
      params: props,
    });
  }
}

export default new locationServices();
