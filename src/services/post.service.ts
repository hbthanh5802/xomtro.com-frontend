import { axiosAuthRequest, axiosRequest } from '@/configs/axios.config';
import { OrderConditionType, PaginationType, WhereConditionType } from '@/store/postFilterSlice';
import { PaginationResponseType } from '@/types/common.type';
import {
  GetPostCommentDataType,
  InsertJoinPostDataType,
  InsertPassPostDataType,
  InsertRentalPostDataType,
  InsertWantedPostDataType,
  RenewPostDataType,
} from '@/types/post.type';
import {
  AssetSelectSchemaType,
  JoinPostSelectSchemaType,
  PassPostItemSelectSchemaType,
  PassPostSelectSchemaType,
  PostCommentInsertSchemaType,
  PostCommentSelectSchemaType,
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
export type FullPostResponseType<T> = {
  post: PostSelectSchemaType & { type: 'rental' | 'join' | 'wanted' | 'pass' };
  detail: T;
  assets: AssetSelectSchemaType[];
  passItems?: PassPostItemSelectSchemaType[];
  distance?: number;
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

export type searchPostCommentsResponseType = {
  results: PostCommentSelectSchemaType[];
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

  createPassPost(data: InsertPassPostDataType) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/pass',
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

  searchPassPost({ whereConditions = {}, orderConditions = {}, pagination = {} }: searchPostProps) {
    return axiosRequest<searchPostResponseType<PassPostSelectSchemaType>>({
      method: 'POST',
      url: '/posts/search/pass',
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

  updatePassPost(postId: number, data: InsertPassPostDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/pass/${postId}`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  createPostInterested(data: { postId: number }) {
    return axiosAuthRequest({
      method: 'POST',
      url: '/posts/interested',
      data,
    });
  }

  removeInterestedPost(postId: number) {
    return axiosAuthRequest({
      method: 'DELETE',
      url: `/posts/interested/${postId}`,
    });
  }

  getFullPost(postId: number) {
    return axiosRequest<
      FullPostResponseType<
        RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
      >[]
    >({
      method: 'GET',
      url: `/posts/${postId}`,
    });
  }

  updatePostViewCount(postId: number) {
    return axiosRequest({
      method: 'PUT',
      url: `/posts/${postId}/view`,
    });
  }

  renewPost(postId: number, data: RenewPostDataType) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/posts/${postId}/renew`,
      data,
    });
  }

  getPostComments(postId: number, conditions: GetPostCommentDataType) {
    return axiosRequest<searchPostCommentsResponseType>({
      method: 'POST',
      url: `/posts/${postId}/comments`,
      data: conditions,
    });
  }

  insertPostComment(data: PostCommentInsertSchemaType) {
    return axiosAuthRequest<PostCommentSelectSchemaType[]>({
      method: 'POST',
      url: '/posts/comments',
      data,
    });
  }

  removePostComment(commentId: number) {
    return axiosAuthRequest({
      method: 'DELETE',
      url: `/posts/comments/${commentId}`,
    });
  }

  updatePostComment(commentId: number, data: Partial<PostCommentInsertSchemaType>) {
    return axiosAuthRequest<PostCommentSelectSchemaType>({
      method: 'PUT',
      url: `/posts/comments/${commentId}`,
      data,
    });
  }
}

export default new postServices();
