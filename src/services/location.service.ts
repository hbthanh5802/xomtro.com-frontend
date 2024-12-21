/* eslint-disable react-hooks/rules-of-hooks */
import { axiosRequest } from '@/configs/axios.config';
import {
  AutoCompleteResponseType,
  DistanceMatrixVehicle,
  GeocodingForwardResponseType,
  GeocodingReverseResponseType,
  GetDistanceMatrixResponseType,
  GetDistrictListType,
  GetProvincesListType,
} from '@/types/location.type';
import { roundNumber } from '@/utils/constants.helper';
import { useQuery } from '@tanstack/react-query';
import { TanstackQueryOptions } from './../types/common.type';

export type GetAutoCompleteProps = {
  searchValue: string;
  longitude?: number;
  latitude?: number;
  limit?: number;
  radius?: number;
};

export type GetDistanceMatrixProps = {
  origin: {
    latitude: number;
    longitude: number;
  };
  destinations: {
    latitude: number;
    longitude: number;
  }[];
  vehicle?: DistanceMatrixVehicle;
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

  getDistanceMatrix(props: GetDistanceMatrixProps, options?: TanstackQueryOptions) {
    const { origin, destinations, vehicle } = props;
    const queryKey = [
      'distance',
      {
        origin: { latitude: roundNumber(origin.latitude, 3), longitude: roundNumber(origin.longitude, 3) },
        destinations,
        vehicle: vehicle ?? 'bike',
      },
    ];
    return useQuery({
      queryKey: queryKey,
      queryFn: () =>
        axiosRequest<GetDistanceMatrixResponseType[]>({
          url: '/location/distance',
          params: {
            origins: `${origin.latitude},${origin.longitude}`,
            destinations: destinations.map((des) => `${des.latitude},${des.longitude}`),
            ...(vehicle && { vehicle }),
          },
        }),
      enabled: !!origin && !!destinations,
      ...options,
    });
  }
}

export default new locationServices();
