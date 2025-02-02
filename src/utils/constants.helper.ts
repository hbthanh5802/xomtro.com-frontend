import { NotificationSelectSchemaType } from '@/types/schema.type';
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

export const cleanObject = (obj: Record<string, unknown>) => {
  const parseValue = (value: unknown) => {
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
        ([, value]) =>
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

// Hàm để tạo dữ liệu cho ImageGallery
export const generateCloudinaryImageOptimizer = (
  cloudinaryUrl: string,
  thumbnailWidth = 250,
  thumbnailHeight = 150,
) => {
  const [baseUrl, imagePath] = cloudinaryUrl.split('/upload/');
  const thumbnailUrl = `${baseUrl}/upload/c_scale,w_${thumbnailWidth},h_${thumbnailHeight}/${imagePath}`;
  return {
    original: cloudinaryUrl,
    thumbnail: thumbnailUrl,
  };
};

// Hàm generate HTML
export const generateContactHTML = (contactType: string, contactContent: string) => {
  if (!contactType || !contactContent) {
    return ``;
  }

  switch (contactType) {
    case 'facebook':
      return `<a href="${contactContent}" target="_blank" rel="noopener noreferrer">Facebook</a>`;
    case 'zalo':
      return `<a href="https://zalo.me/${contactContent}" target="_blank" rel="noopener noreferrer">Liên hệ Zalo</a>`;
    case 'email':
      return `<a href="mailto:${contactContent}">${contactContent}</a>`;
    case 'phone':
      return `<a href="tel:${contactContent}">${contactContent}</a>`;
    default:
      return `<span>${contactContent}</span>`;
  }
};

export const roundNumber = (value: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

export const getRedirectNotification = (data: NotificationSelectSchemaType) => {
  if (data.type === 'post') {
    return `/posts/${data.postId}/view`;
  }
  if (data.type === 'account') {
    return `/users/${data.userId}/profile`;
  }
  if (data.type === 'chat') {
    return `/conversations`;
  }
  return undefined;
};

export const vehicleOptions = [
  { label: 'Xe đạp', value: 'bike' },
  { label: 'Xe ô tô', value: 'car' },
  { label: 'Xe taxi', value: 'taxi' },
  { label: 'Xe tải', value: 'truck' },
  { label: 'Những phương tiện gọi xe khác', value: 'hd' },
];

export const monthSelectOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `Tháng ${i + 1}`,
  value: i + 1,
}));

export const generateYearOptions = ({
  startYear = new Date().getFullYear(),
  length = 10,
  direction = 'forward', // 'forward' hoặc 'backward'
}: {
  startYear?: number;
  length?: number;
  direction?: 'forward' | 'backward';
}) => {
  return Array.from({ length }, (_, i) => {
    const year = direction === 'forward' ? startYear + i : startYear - i;
    return {
      label: `Năm ${year}`,
      value: year,
    };
  });
};

export const getMonthDateRange = (month?: number, year?: number) => {
  const currentYear = new Date().getFullYear();
  const validMonth = month && month >= 1 && month <= 12 ? month : undefined;

  const startDate = new Date(year || currentYear, validMonth ? validMonth - 1 : 0, 1); // Ngày đầu tháng
  const endDate = new Date(year || currentYear, validMonth ? validMonth : 12, 0); // Ngày cuối tháng

  return { startDate, endDate };
};

export const maxPriceLimitation = 50000000;
