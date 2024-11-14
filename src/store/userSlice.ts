import userService from '@/services/user.service';
import { AssetSelectSchemaType } from '@/types/schema.type';
import { StateCreator } from 'zustand';

type userState = {
  userAvatar: AssetSelectSchemaType | null;
};

type userActions = {
  setUserAvatar: (avatarData: AssetSelectSchemaType) => void;
  fetchUserAvatar: () => Promise<void>;
  resetUserState: () => void;
};

const initialState: userState = {
  userAvatar: null,
};

export type userSlice = userState & userActions;

type UserMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createUserSlice: StateCreator<userSlice, UserMiddlewares, [], userSlice> = (set) => ({
  ...initialState,
  setUserAvatar: (data: AssetSelectSchemaType) =>
    set((state) => {
      state.userAvatar = data;
    }),
  fetchUserAvatar: async () => {
    try {
      console.log('Fetch avatar');
      const response = await userService.getMyAvatar();
      const { data } = response;
      return set((state) => {
        state.userAvatar = data;
      });
    } catch (error) {
      throw error;
    }
  },
  resetUserState: () => set(initialState),
});
