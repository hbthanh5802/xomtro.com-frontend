import type { UserDetailSelectSchemaType } from '@/types/schema.type';
import { StateCreator } from 'zustand';

type authState = {
  currentUser: UserDetailSelectSchemaType | null;
  accessToken: string | null;
};

type authActions = {
  setCurrentUser: (currentUser: UserDetailSelectSchemaType) => void;
  setAccessToken: (token: string) => void;
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
  setCurrentUser: (data: UserDetailSelectSchemaType) =>
    set((state) => {
      state.currentUser = data;
    }),
  setAccessToken: (token: string) =>
    set((state) => {
      state.accessToken = token;
    }),
  resetAuthState: () => set(initialState),
});
