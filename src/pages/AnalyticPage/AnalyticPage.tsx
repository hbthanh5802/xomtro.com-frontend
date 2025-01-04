import CountOverview from '@/pages/AnalyticPage/components/CountOverview';
import FilterBar, { AnalyticFilterFormDataType } from '@/pages/AnalyticPage/components/FilterBar';
import PriceOverview from '@/pages/AnalyticPage/components/PriceOverview';
import { Typography } from '@mui/joy';
import React from 'react';

const AnalyticPage = () => {
  const [whereConditions, setWhereConditions] = React.useState<AnalyticFilterFormDataType>({
    status: undefined,
    year: new Date().getFullYear(),
  });

  const handleSetWhereConditions = React.useCallback(setWhereConditions, [setWhereConditions]);

  return (
    <div className='tw-flex tw-flex-col tw-bg-backgroundColor tw-min-h-[calc(100dvh-var(--header-height))]'>
      <div className='tw-container tw-mx-auto tw-my-[40px]'>
        <div className='tw-p-3 tablet:tw-p-0 tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-justify-between tw-flex-wrap tablet:tw-items-center tw-gap-3 '>
          <Typography level='h3' color='primary'>
            Thống kê bài đăng
          </Typography>

          <FilterBar whereConditions={whereConditions} setWhereConditions={handleSetWhereConditions} />
        </div>

        <div className='tw-mt-6'>
          <CountOverview whereConditions={whereConditions} />
        </div>

        <div className='tw-mt-6'>
          <PriceOverview whereConditions={whereConditions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;
