export type DivisionType =
  | 'tỉnh'
  | 'thành phố trung ương'
  | 'huyện'
  | 'quận'
  | 'thành phố'
  | 'thị xã'
  | 'xã'
  | 'thị trấn'
  | 'phường';

export type LocationResponseType = {
  name: string;
  code: number;
  division_type: string;
  codename: DivisionType;
  phone_code: number;
};

export type DistrictResponseType = LocationResponseType & {
  province_code: number;
};

export type WardResponseType = LocationResponseType & {
  district_code: number;
};

export type GetProvincesListType = LocationResponseType & {
  districts: DistrictResponseType[];
};

export type GetDistrictListType = DistrictResponseType & {
  wards: DistrictResponseType[];
};
