import io, { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

import { env } from '@/configs/environment.config';
import { useAppStore } from '@/store/store';

type conversationState = {
  onlineUsers: string[];
  socketInstance: typeof Socket | null;
};

type conversationActions = {
  connectSocket: () => void;
  disconnectSocket: () => void;
  resetConversationState: () => void;
};

const initialState: conversationState = {
  onlineUsers: [],
  socketInstance: null,
};

export type conversationSlice = conversationState & conversationActions;

type zustandMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createConversationSlice: StateCreator<conversationSlice, zustandMiddlewares, [], conversationSlice> = (
  set,
  get,
) => ({
  ...initialState,
  connectSocket: () => {
    const currentUser = useAppStore.getState().currentUser;
    if (!currentUser || get().socketInstance?.connected || !env.BASE_URL) return;

    const socket = io(env.BASE_URL, {
      query: {
        userId: currentUser.userId,
      },
    });
    socket.connect();
    set((state) => {
      state.socketInstance = socket;
    });

    socket.on('get-online-users', (onlineUsers: string[]) => {
      set((state) => {
        state.onlineUsers = onlineUsers;
      });
    });
  },
  disconnectSocket: () => {
    if (get().socketInstance?.connected) {
      set(initialState);
      get().socketInstance?.disconnect();
    }
  },
  resetConversationState: () => set(initialState),
});
