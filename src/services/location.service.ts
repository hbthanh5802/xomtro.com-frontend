import { axiosRequest } from '@/configs/axios.config';
import { GetDistrictListType, GetProvincesListType } from '@/types/location.type';
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
}

export default new locationServices();
