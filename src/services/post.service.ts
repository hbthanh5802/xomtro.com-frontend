import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { OrderConditionType, PaginationType, WhereConditionType } from '@/store/postFilterSlice';
import { InsertJoinPostDataType, InsertRentalPostDataType, InsertWantedPostDataType } from '@/types/post.type';
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
type FullPostResponseType<T> = {
  post: PostSelectSchemaType & { type: 'rental' | 'join' | 'wanted' | 'pass' };
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

  createWantedPost(data: InsertWantedPostDataType) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/wanted',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  createJoinPost(data: InsertJoinPostDataType) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/join',
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

  searchWantedPost({ whereConditions = {}, orderConditions = {}, pagination = {} }: searchPostProps) {
    return axiosRequest<searchPostResponseType<WantedPostSelectSchemaType>>({
      method: 'POST',
      url: '/posts/search/wanted',
      data: { whereConditions, orderConditions, pagination },
    });
  }

  searchJoinPost({ whereConditions = {}, orderConditions = {}, pagination = {} }: searchPostProps) {
    return axiosRequest<searchPostResponseType<JoinPostSelectSchemaType>>({
      method: 'POST',
      url: '/posts/search/join',
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

  updateWantedPost(postId: number, data: InsertWantedPostDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/wanted/${postId}`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  updateJoinPost(postId: number, data: InsertJoinPostDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/join/${postId}`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new postServices();
