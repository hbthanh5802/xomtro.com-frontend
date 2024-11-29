import { queryClient } from '@/configs/tanstackQuery.config';
import authService from '@/services/auth.service';
import { useAppStore } from '@/store/store';
import type { UserDetailSelectSchemaType } from '@/types/schema.type';
import history from '@/utils/history.helper';
import { toast } from 'sonner';
import { StateCreator } from 'zustand';

type authState = {
  currentUser: UserDetailSelectSchemaType | null;
  accessToken: string | null;
};

type authActions = {
  setCurrentUser: (currentUser: UserDetailSelectSchemaType, allowRedirect?: boolean) => void;
  setAccessToken: (token: string) => void;
  logoutUser: () => void;
  resetAuthState: () => void;
};

const initialState: authState = {
  currentUser: null,
  accessToken: null,
};

export type authSlice = authState & authActions;

type AuthMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createAuthSlice: StateCreator<authSlice, AuthMiddlewares, [], authSlice> = (set) => ({
  ...initialState,
  setAccessToken: (token: string) =>
    set((state) => {
      state.accessToken = token;
    }),
  setCurrentUser: (userDetail: UserDetailSelectSchemaType, allowRedirect: boolean = true) => {
    if (!userDetail.isEmailVerified) {
      if (allowRedirect) history.push('/auth/verify', { userDetail });
    } else if (!userDetail.role) {
      if (allowRedirect) history.push('/auth/role', { userDetail });
    } else {
      if (allowRedirect) history.push('/home/rental');
      useAppStore.getState().fetchUserAvatar();
      return set((state) => {
        state.currentUser = userDetail;
      });
    }
  },
  logoutUser: async () => {
    const toastId = toast.loading('Đang đăng xuất');
    try {
      await authService.logoutUser();
      toast.success('Đăng xuất thành công!', {
        id: toastId,
      });
      queryClient.invalidateQueries();
      useAppStore.getState().resetUserState();
      history.push('/home/rental');
      return set(initialState);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!', {
        id: toastId,
      });
      throw error;
    }
  },
  resetAuthState: () => set(initialState),
});
