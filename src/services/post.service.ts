import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { OrderConditionType, PaginationType, WhereConditionType } from '@/store/postFilterSlice';
import { InsertRentalPostDataType } from '@/types/post.type';
import {
  AssetSelectSchemaType,
  JoinPostSelectSchemaType,
  PassPostItemSelectSchemaType,
  PassPostSelectSchemaType,
  PostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from './../types/schema.type';

type searchPostProps = {
  whereConditions?: WhereConditionType;
  orderConditions?: OrderConditionType;
  pagination?: PaginationType;
};

// Type
export type FullPostResponseType<
  T extends
    | RentalPostSelectSchemaType
    | WantedPostSelectSchemaType
    | JoinPostSelectSchemaType
    | PassPostSelectSchemaType,
> = {
  post: PostSelectSchemaType;
  detail: T;
  assets: AssetSelectSchemaType[];
  passItems?: PassPostItemSelectSchemaType[];
  distance?: number;
};

type PaginationResponseType = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
  canPrevious: boolean;
  canNext: boolean;
};
type searchPostResponseType<
  T extends
    | RentalPostSelectSchemaType
    | WantedPostSelectSchemaType
    | JoinPostSelectSchemaType
    | PassPostSelectSchemaType,
> = {
  results: FullPostResponseType<T>[];
  pagination: PaginationResponseType;
};

class postServices {
  createRentalPost(data: InsertRentalPostDataType) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/rental',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  searchRentalPost({ whereConditions = {}, orderConditions = {}, pagination = {} }: searchPostProps) {
    return axiosRequest<searchPostResponseType<RentalPostSelectSchemaType>>({
      method: 'POST',
      url: '/posts/search/rental',
      data: { whereConditions, orderConditions, pagination },
    });
  }

  removePost(postId: number) {
    return axiosAuthRequest({
      method: 'DELETE',
      url: '/posts/' + postId,
    });
  }

  togglePostStatus(postId: number) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/${postId}/status`,
    });
  }

  removePostAssets(postId: number, assetIds: number[]) {
    return axiosAuthRequest({
      method: 'DELETE',
      url: `/posts/${postId}/assets`,
      params: { assetIds },
    });
  }

  updateRentalPost(postId: number, data: InsertRentalPostDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/rental/${postId}`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new postServices();
