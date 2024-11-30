import { ReactNode } from 'react';

export type RadioOptionItemType = {
  label: ReactNode | string;
  description?: ReactNode | string;
  value: any;
  defaultChecked?: boolean;
};

export type SelectOptionItemType = {
  label: ReactNode | string;
  value: any;
  defaultChecked?: boolean;
};

export type TanstackQueryOptions = {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
};

export type OrderDirectionType = 'desc' | 'asc';
