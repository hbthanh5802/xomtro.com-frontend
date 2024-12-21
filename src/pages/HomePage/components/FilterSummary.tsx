import { WhereConditionType } from '@/store/postFilterSlice';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { room_amenities } from '@/utils/schema.helper';
import { Card, Typography } from '@mui/joy';
import React from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface FilterSummaryProps {
  whereConditions: WhereConditionType;
}
const FilterSummary = (props: FilterSummaryProps) => {
  const { whereConditions } = props;

  const hasFilter =
    !!whereConditions.provinceName ||
    !!whereConditions.districtName ||
    !!whereConditions.wardName ||
    !!whereConditions.nearest;
  const hasAmenities = React.useMemo(
    () =>
      Object.keys(room_amenities).some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key: string) => (whereConditions as any)[key as keyof typeof whereConditions] as boolean,
      ),
    [whereConditions],
  );

  return (
    <Card color='primary' variant='outlined' sx={{ borderWidth: 2 }}>
      <div className='tw-flex tw-flex-wrap tw-gap-1'>
        <Typography
          level='title-sm'
          startDecorator={<IoMdInformationCircleOutline className='tw-text-primaryColor tw-size-[16px]' />}
        >
          Hiển thị bài đăng cho:
        </Typography>
        {whereConditions.provinceName && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='danger'>
              {whereConditions.provinceName}
            </Typography>
          </>
        )}
        {whereConditions.districtName && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='warning'>
              {whereConditions.districtName}
            </Typography>
          </>
        )}
        {whereConditions.wardName && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='success'>
              {whereConditions.wardName}
            </Typography>
          </>
        )}
        {whereConditions.nearest && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='primary'>
              {typeof whereConditions.nearest === 'object' && `Bán kính <= ${whereConditions.nearest.radius} km`}
            </Typography>
          </>
        )}
        {hasAmenities && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='neutral'>
              Dịch vụ, tiện ích
            </Typography>
          </>
        )}
        {whereConditions.priceStart && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='neutral'>
              {`>= ${formatCurrencyVND(whereConditions.priceStart)}`}
            </Typography>
          </>
        )}
        {whereConditions.priceEnd && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='neutral'>
              {`<= ${formatCurrencyVND(whereConditions.priceEnd)}`}
            </Typography>
          </>
        )}
        {!hasFilter && !hasAmenities && (
          <>
            <span className='tw-px-1'></span>
            <Typography variant='outlined' level='body-sm' color='neutral'>
              Tất cả bài đăng
            </Typography>
          </>
        )}
      </div>
      <Typography
        level='title-sm'
        startDecorator={<IoMdInformationCircleOutline className='tw-text-primaryColor/5 tw-size-[16px]' />}
      >
        Sắp xếp theo:<span className='tw-px-1'></span>
        <Typography variant='outlined' level='body-sm' color='neutral'>
          Bài đăng mới nhất
        </Typography>
      </Typography>
    </Card>
  );
};

export default FilterSummary;
