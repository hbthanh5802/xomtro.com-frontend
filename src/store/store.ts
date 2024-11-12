import { authSlice } from '@/store/authSlice';
import { del, get, set } from 'idb-keyval';
import superjson from 'superjson';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice } from './authSlice';

// Custom storage sử dụng superjson
const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const storedData = await get(name); // Lấy dữ liệu từ IndexedDB (hoặc có thể thay bằng localStorage.getItem)
    if (!storedData) return null;

    try {
      return superjson.parse(storedData); // Parse dữ liệu từ chuỗi JSON về dạng ban đầu
    } catch (e) {
      console.error('Error parsing data:', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const serializedData = superjson.stringify(value); // Serial hóa dữ liệu với superjson
    await set(name, serializedData); // Lưu vào IndexedDB (hoặc localStorage)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name); // Xóa dữ liệu
  },
};

type Store = authSlice;

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: 'xomtro.com',
        storage: createJSONStorage(() => customStorage),
      },
    ),
  ),
);
