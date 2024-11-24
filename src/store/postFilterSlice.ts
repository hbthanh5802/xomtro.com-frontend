import { OrderDirectionType } from '@/types/common.type';
import { StateCreator } from 'zustand';

export type WhereConditionType = {
  ownerId?: number;
  title?: string;
  status?: 'actived' | 'unactived';
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  nearest?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  hasFurniture?: boolean;
  hasAirConditioner?: boolean;
  hasWashingMachine?: boolean;
  hasRefrigerator?: boolean;
  hasPrivateBathroom?: boolean;
  hasParking?: boolean;
  hasSecurity?: boolean;
  hasElevator?: boolean;
  hasInternet?: boolean;
  allowPets?: boolean;
  totalArea?: number;
  totalAreaUnit?: 'm2' | 'cm2';
  dateStart?: string;
  dateEnd?: string;
  passItemName?: string;
  passItemStatus?: 'new' | 'used';
};

export type OrderConditionType = {
  createdAt?: OrderDirectionType;
  price?: OrderDirectionType;
};

export type PaginationType = {
  page?: number;
  pageSize?: number;
};

type postFilterState = {
  whereConditions: WhereConditionType;
  orderConditions: OrderConditionType;
  pagination: PaginationType;
};

type postFilterActions = {
  resetPostFilterState: () => void;
  setWhereConditionFilter: (whereConditions: WhereConditionType) => void;
  setOrderConditionFilter: (orderConditions: OrderConditionType) => void;
  setPaginationFilter: (pagination: PaginationType) => void;
  updateWhereCondition: (key: keyof WhereConditionType, value: WhereConditionType[keyof WhereConditionType]) => void;
  updateOrderCondition: (key: keyof OrderConditionType, value: OrderConditionType[keyof OrderConditionType]) => void;
  updatePagination: (key: keyof PaginationType, value: PaginationType[keyof PaginationType]) => void;
};

const initialState: postFilterState = {
  whereConditions: {},
  orderConditions: {
    createdAt: 'desc',
  },
  pagination: {
    page: 1,
    pageSize: 10,
  },
};

export type postFilterSlice = postFilterState & postFilterActions;

type PostFilerMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];
export const createPostFilterSlice: StateCreator<postFilterSlice, PostFilerMiddlewares, [], postFilterSlice> = (
  set,
) => ({
  ...initialState,

  resetPostFilterState: () => set(initialState),

  setWhereConditionFilter: (whereConditions: WhereConditionType) =>
    set((state) => {
      state.whereConditions = whereConditions;
    }),

  setOrderConditionFilter: (orderConditions: OrderConditionType) =>
    set((state) => {
      state.orderConditions = orderConditions;
    }),

  setPaginationFilter: (pagination: PaginationType) =>
    set((state) => {
      state.pagination = pagination;
    }),

  updateWhereCondition: <K extends keyof WhereConditionType>(key: K, value: WhereConditionType[K]) =>
    set((state) => {
      state.whereConditions[key] = value;
    }),

  updateOrderCondition: <K extends keyof OrderConditionType>(key: K, value: OrderConditionType[K]) =>
    set((state) => {
      state.orderConditions[key] = value;
    }),

  updatePagination: <K extends keyof PaginationType>(key: K, value: PaginationType[K]) =>
    set((state) => {
      state.pagination[key] = value;
    }),
});

// usePostFilterStore.getState().updateWhereCondition('title', 'New Title');

// usePostFilterStore.getState().updateWhereCondition('hasFurniture', true);

// usePostFilterStore.getState().updateOrderCondition('price', 'asc');

// usePostFilterStore.getState().updatePagination('pageSize', 20);
