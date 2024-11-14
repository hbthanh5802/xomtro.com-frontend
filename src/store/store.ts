import { authSlice } from '@/store/authSlice';
import { userSlice } from '@/store/userSlice';
import { del, get, set } from 'idb-keyval';
import superjson from 'superjson';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice } from './authSlice';
import { createUserSlice } from './userSlice';

const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const storedData = await get(name);
    if (!storedData) return null;
    try {
      return superjson.parse(storedData);
    } catch (e) {
      console.error('Error parsing data:', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const serializedData = superjson.stringify(value);
    await set(name, serializedData);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

type Store = authSlice & userSlice;

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createUserSlice(...a),
      })),
      {
        name: 'xomtro.com',
        storage: createJSONStorage(() => customStorage),
      },
    ),
  ),
);
