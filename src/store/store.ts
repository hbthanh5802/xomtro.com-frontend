import { createNotificationSlice, notificationSlice } from './notificationSlice';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authSlice } from '@/store/authSlice';
import { conversationSlice, createConversationSlice } from '@/store/conversationSlice';
import { createPostCommentSlice, postCommentSlice } from '@/store/postCommentSlice';
import { userSlice } from '@/store/userSlice';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice } from './authSlice';
import { createPostFilterSlice, postFilterSlice } from './postFilterSlice';
import { createUserSlice } from './userSlice';

type Store = authSlice & userSlice & postFilterSlice & conversationSlice & postCommentSlice & notificationSlice;

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer(
        subscribeWithSelector((...a) => ({
          ...createAuthSlice(...a),
          ...createUserSlice(...a),
          ...createPostFilterSlice(...a),
          ...createConversationSlice(...a),
          ...createPostCommentSlice(...a),
          ...createNotificationSlice(...a),
        })),
      ),
      {
        name: 'xomtro.com',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          const {
            socketInstance,
            whereConditions,
            orderConditions,
            pagination,
            selectedPostComment,
            postCommentMode,
            fetchingPostComments,
            postComments,
            postCommentPagination,
            setPostCommentMode,
            selectedPostAttachment,
            setSelectedPostAttachment,
            setOpenSelectedPostAttachment,
            openSelectPostAttachment,
            openNotificationPopover,
            setOpenNotificationPopover,
            ...other
          } = state;
          return other;
        },
      },
    ),
  ),
);
