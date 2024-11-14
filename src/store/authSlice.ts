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
  setCurrentUser: (currentUser: UserDetailSelectSchemaType) => void;
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
  setCurrentUser: (userDetail: UserDetailSelectSchemaType) => {
    if (!userDetail.isEmailVerified) {
      history.push('/auth/verify', { userDetail });
    } else if (!userDetail.role) {
      history.push('/auth/role', { userDetail });
    } else {
      history.push('/');
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
      useAppStore.getState().resetUserState();
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
