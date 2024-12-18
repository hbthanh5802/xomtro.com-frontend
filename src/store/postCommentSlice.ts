import postService, { FullPostResponseType } from '@/services/post.service';
import { PaginationResponseType } from '@/types/common.type';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  PostCommentSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { StateCreator } from 'zustand';

type PostCommentModeType = 'add' | 'edit' | 'reply';
export type PostAttachmentType = FullPostResponseType<
  RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
>;

type postCommentState = {
  fetchingPostComments: boolean;
  postCommentPagination: PaginationResponseType | null;
  postComments: PostCommentSelectSchemaType[];
  selectedPostComment: PostCommentSelectSchemaType | null;
  selectedPostAttachment: PostAttachmentType | null;
  openSelectPostAttachment: boolean;
  postCommentMode: PostCommentModeType;
};

type postCommentActions = {
  fetchPostComments: (props: { postId: number; page?: number; parentCommentId?: number }) => Promise<void>;
  setPostComments: (postComments: PostCommentSelectSchemaType[]) => void;
  setPostCommentMode: (mode: PostCommentModeType) => void;
  setSelectedPostComment: (comment: PostCommentSelectSchemaType | null) => void;
  setSelectedPostAttachment: (postData: PostAttachmentType | null) => void;
  setOpenSelectedPostAttachment: (open: boolean) => void;
  resetPostCommentState: () => void;
};

const initialState: postCommentState = {
  postComments: [],
  openSelectPostAttachment: false,
  selectedPostAttachment: null,
  postCommentPagination: null,
  fetchingPostComments: false,
  selectedPostComment: null,
  postCommentMode: 'add',
};

export type postCommentSlice = postCommentState & postCommentActions;

type zustandMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createPostCommentSlice: StateCreator<postCommentSlice, zustandMiddlewares, [], postCommentSlice> = (
  set,
  get,
) => ({
  ...initialState,
  setSelectedPostComment: (comment) =>
    set((state) => {
      state.selectedPostComment = comment;
    }),
  setPostComments: (data) =>
    set((state) => {
      state.postComments = data;
    }),
  setOpenSelectedPostAttachment: (isOpen) =>
    set((state) => {
      state.openSelectPostAttachment = isOpen;
    }),
  setSelectedPostAttachment: (data) =>
    set((state) => {
      state.selectedPostAttachment = data;
    }),
  setPostCommentMode: (mode) =>
    set((state) => {
      state.postCommentMode = mode;
    }),
  fetchPostComments: async (props) => {
    const { postId, page, parentCommentId } = props;
    set((state) => {
      state.fetchingPostComments = true;
    });
    try {
      const postCommentResponse = await postService.getPostComments(postId, {
        whereConditions: { parentCommentId },
        orderConditions: {},
        pagination: { page, pageSize: 10 },
      });
      const { results, pagination: paginationData } = postCommentResponse.data;
      set((state) => {
        state.postComments = [...get().postComments, ...results];
        state.postCommentPagination = paginationData;
      });
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      set((state) => {
        state.fetchingPostComments = false;
      });
    }
  },
  resetPostCommentState: () => set(initialState),
});
