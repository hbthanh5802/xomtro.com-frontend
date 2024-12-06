import { ReactNode } from 'react';

export type RadioOptionItemType = {
  label: ReactNode | string;
  description?: ReactNode | string;
  value: unknown;
  defaultChecked?: boolean;
};

export type SelectOptionItemType = {
  label: ReactNode | string;
  value: unknown;
  defaultChecked?: boolean;
};

export type TanstackQueryOptions = {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
};

export type OrderDirectionType = 'desc' | 'asc';

export type PaginationResponseType = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
  canPrevious: boolean;
  canNext: boolean;
};
