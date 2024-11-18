import { axiosAuthRequest } from '@/configs/axios.config';
import { InsertAddressDataType } from '@/types/address.type';
import { AddressSelectSchemaType } from '@/types/schema.type';

class addressServices {
  async createUserAddress(data: InsertAddressDataType) {
    return axiosAuthRequest<AddressSelectSchemaType>({
      url: '/users/addresses',
      method: 'POST',
      data,
    });
  }
}

export default new addressServices();
