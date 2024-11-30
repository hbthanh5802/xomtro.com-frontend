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

export type GeocodingForwardResponseType = {
  longitude: number;
  latitude: number;
  displayName?: string;
  googleMapReference?: string;
  placeId?: string;
  accuracy?: number;
};

export type GeocodingReverseResponseType = {
  placeId: string;
  googleMapsReference?: string;
  displayAddress: string;
  addressComponents: string[];
  longitude: number;
  latitude: number;
};

export type AutoCompleteResponseType = {
  description: string;
  placeId: string;
  googleMapReference: string;
  province: string;
  district: string;
  ward: string;
  matches: {
    offset: number;
    value: string;
  }[];
  mainText: string;
  subText: string;
};
