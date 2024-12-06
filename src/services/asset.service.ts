/* eslint-disable react-hooks/rules-of-hooks */
import { axiosRequest } from '@/configs/axios.config';
import { TanstackQueryOptions } from '@/types/common.type';
import { AssetSelectSchemaType } from '@/types/schema.type';
import { useQuery } from '@tanstack/react-query';

class assetService {
  getAssetByIds(assetIds: number[]) {
    return axiosRequest({
      url: '/assets',
      params: { assetIds },
    });
  }

  getAssetById(assetId: number, options: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['assets', { assetId }],
      queryFn: () =>
        axiosRequest<AssetSelectSchemaType[]>({
          method: 'GET',
          url: '/assets',
          params: { assetIds: [assetId] },
        }),
      enabled: !!assetId,
      ...options,
    });
  }
}

export default new assetService();
