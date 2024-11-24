import axios from 'axios';
export const WHITELIST_DOMAIN = ['http://localhost:4444'];

export const generateSlug = (str: string) => {
  if (!str) return '';
  // Transform to lowercase
  str = str.toLowerCase();

  // Remove notes
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');

  // Delete all special symbols
  str = str.replace(/([^0-9a-z-\s])/g, '');

  // Replace all white space to '-'
  str = str.replace(/(\s+)/g, '-');

  // Remove '-' symbol
  str = str.replace(/-+/g, '-');

  // Delete consecutive '-' characters
  str = str.replace(/^-+/g, '');

  // Delete consecutive characters at the end
  str = str.replace(/-+$/g, '');

  return str;
};

export const cleanObject = (obj: Record<string, any>) => {
  const parseValue = (value: any) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    // if (!isNaN(Number(value)) && value !== '') return Number(value);
    return value;
  };

  let transformedData = structuredClone(obj);
  transformedData = Object.fromEntries(
    Object.entries(transformedData)
      .filter(
        ([_, value]) =>
          value !== null && value !== '' && !Number.isNaN(value) && value !== undefined && value !== 'undefined',
      )
      .map(([key, value]) => [key, parseValue(value)]),
  );

  return transformedData;
};

export const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const simplifiedError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
    };
    return simplifiedError;
  }
};

export const formatCurrencyVND = (amount: number): string => {
  if (isNaN(amount)) {
    throw new Error('Invalid number');
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Không hiển thị phần lẻ
  }).format(amount);
};
