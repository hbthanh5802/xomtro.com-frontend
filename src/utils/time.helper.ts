import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as timeago from 'timeago.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

// Get datetime in UTC
export const getCurrentUtc = () => dayjs.utc();

// Get Vietnam time from UTC
export const timeInVietNam = () => dayjs.utc().add(7, 'hour');

// Format time to VN
export const formatTimeForVietnamese = (
  date: dayjs.Dayjs | Date,
  format: 'HH:mm:ss DD/MM/YYYY' | 'DD/MM/YYYY' = 'DD/MM/YYYY',
) => {
  const dayjsDate = dayjs.isDayjs(date) ? date : dayjs.utc(date);

  return dayjsDate.locale('vi').format(format);
};

/**
 * Format a date value to 'YYYY-MM-DD' for input type="date".
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Convert a date string from input type="date" to UTC ISO format.
 * @param date - The date string to convert.
 * @returns The UTC ISO string.
 */
export const convertToUTC = (date: string): string => {
  return dayjs(date).utc().toISOString();
};

/**
 * Validate if a date is within a given range.
 * @param date - The date to validate.
 * @param minDate - The minimum allowed date.
 * @param maxDate - The maximum allowed date.
 * @returns A validation message or true if valid.
 */
export const validateDateRange = (date: string, minDate?: Date, maxDate?: Date): string | true => {
  const parsedDate = dayjs(date);

  if (minDate && parsedDate.isBefore(dayjs(minDate))) {
    return `Date must be after ${formatDateForInput(minDate)}`;
  }

  if (maxDate && parsedDate.isAfter(dayjs(maxDate))) {
    return `Date must be before ${formatDateForInput(maxDate)}`;
  }

  return true;
};

export const isValidDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return !isNaN(date.getTime());
};

// register your locale with timeago
const localeFunc = (number: number, index: number, totalSec: number | undefined): [string, string] => {
  // number: thời gian đã qua / thời gian sắp tới dưới dạng số;
  // index: chỉ số của mảng bên dưới;
  // totalSec: tổng số giây giữa ngày được định dạng và ngày hôm nay;
  const locales: [string, string][] = [
    ['vừa xong', 'ngay bây giờ'],
    ['%s giây trước', 'trong %s giây'],
    ['1 phút trước', 'trong 1 phút'],
    ['%s phút trước', 'trong %s phút'],
    ['1 giờ trước', 'trong 1 giờ'],
    ['%s giờ trước', 'trong %s giờ'],
    ['1 ngày trước', 'trong 1 ngày'],
    ['%s ngày trước', 'trong %s ngày'],
    ['1 tuần trước', 'trong 1 tuần'],
    ['%s tuần trước', 'trong %s tuần'],
    ['1 tháng trước', 'trong 1 tháng'],
    ['%s tháng trước', 'trong %s tháng'],
    ['1 năm trước', 'trong 1 năm'],
    ['%s năm trước', 'trong %s năm'],
  ];

  return locales[index];
};

timeago.register('vi', localeFunc);

export const getTimeAgo = (dateTimeString: string | Date) => {
  if (!isValidDateTime) return false;
  return timeago.format(dayjs.utc(dateTimeString).format('YYYY-MM-DD HH:mm:ss'), 'vi');
};
