/* eslint-disable react-hooks/rules-of-hooks */
import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { InsertAddressDataType } from '@/types/address.type';
import { TanstackQueryOptions } from '@/types/common.type';
import { AddressSelectSchemaType } from '@/types/schema.type';
import { useQuery } from '@tanstack/react-query';

class addressServices {
  async createUserAddress(data: InsertAddressDataType) {
    return axiosAuthRequest<AddressSelectSchemaType>({
      url: '/users/addresses',
      method: 'POST',
      data,
    });
  }

  getAllUserAddresses(options?: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['users', 'addresses'],
      queryFn: () =>
        axiosAuthRequest<AddressSelectSchemaType[]>({
          url: '/users/addresses',
          method: 'GET',
        }),
      enabled: true,
      ...options,
    });
  }

  deleteUserAddress(addressIds: number[]) {
    return axiosAuthRequest({
      method: 'DELETE',
      url: '/users/addresses',
      params: { addressIds },
    });
  }

  updateUserAddress(addressId: number, data: InsertAddressDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: '/users/addresses/' + addressId,
      data,
    });
  }

  setUserDefaultAddress(addressId: number) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/users/addresses/${addressId}/default`,
    });
  }

  getUserDefaultAddress(userId: number, options?: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['users', 'addresses', { isDefault: true, userId }],
      queryFn: () =>
        axiosRequest<AddressSelectSchemaType>({
          method: 'GET',
          url: `/users/addresses/${userId}/default`,
        }),
      enabled: !!userId,
      ...options,
    });
  }
}

export default new addressServices();
