import locationService from '@/services/location.service';
import userService from '@/services/user.service';
import { GeocodingReverseResponseType } from '@/types/location.type';
import { AddressSelectSchemaType, AssetSelectSchemaType } from '@/types/schema.type';
import { StateCreator } from 'zustand';

type userState = {
  userAvatar: AssetSelectSchemaType | null;
  userLocation: GeocodingReverseResponseType | null;
  userAddress: AddressSelectSchemaType | null;
  locationPermissionStatus: 'granted' | 'prompt' | 'denied' | null;
};

type userActions = {
  setUserAvatar: (avatarData: AssetSelectSchemaType) => void;
  setUserAddress: (data: AddressSelectSchemaType) => void;
  fetchUserAvatar: () => Promise<void>;
  fetchUserLocation: (latitude: number, longitude: number) => Promise<void>;
  setUserLocation: (userLocation: GeocodingReverseResponseType) => void;
  setLocationPermissionStatus: (status: 'granted' | 'prompt' | 'denied') => void;
  resetUserState: () => void;
};

const initialState: userState = {
  userAvatar: null,
  userLocation: null,
  userAddress: null,
  locationPermissionStatus: null,
};

export type userSlice = userState & userActions;

type UserMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createUserSlice: StateCreator<userSlice, UserMiddlewares, [], userSlice> = (set) => ({
  ...initialState,
  setUserAvatar: (data: AssetSelectSchemaType) =>
    set((state) => {
      state.userAvatar = data;
    }),
  setUserAddress: (data: AddressSelectSchemaType) =>
    set((state) => {
      state.userAddress = data;
    }),
  setUserLocation: (data: GeocodingReverseResponseType) =>
    set((state) => {
      state.userLocation = data;
    }),
  setLocationPermissionStatus: (status: 'granted' | 'prompt' | 'denied') =>
    set((state) => {
      state.locationPermissionStatus = status;
    }),
  fetchUserLocation: async (latitude: number, longitude: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await locationService.getGeoCodingReverse(latitude, longitude);
      const { data } = response;
      set((state) => {
        state.userLocation = data;
      });
    } catch (error) {
      throw error;
    }
  },
  fetchUserAvatar: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
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
