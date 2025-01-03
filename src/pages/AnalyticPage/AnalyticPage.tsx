import FilterBar from '@/pages/AnalyticPage/components/FilterBar';
import Overview from '@/pages/AnalyticPage/components/Overview';
import { GetPostsCountByTypeWithPostConditionsDataType } from '@/types/analytic.type';
import { Typography } from '@mui/joy';
import React from 'react';

const AnalyticPage = () => {
  const [whereConditions, setWhereConditions] = React.useState<GetPostsCountByTypeWithPostConditionsDataType>({
    status: undefined,
  });

  const handleSetWhereConditions = React.useCallback(setWhereConditions, [setWhereConditions]);

  React.useEffect(() => {
    console.log(whereConditions);
  }, [whereConditions]);

  return (
    <div className='tw-flex tw-flex-col tw-bg-backgroundColor tw-min-h-[calc(100dvh-var(--header-height))]'>
      <div className='tw-container tw-mx-auto tw-my-[40px]'>
        <div className='tw-p-3 tablet:tw-p-0 tw-flex tw-justify-between tw-gap-3 tw-flex-wrap tw-items-center'>
          <Typography level='h3' color='primary'>
            Thống kê bài đăng
          </Typography>

          <FilterBar whereConditions={whereConditions} setWhereConditions={handleSetWhereConditions} />
        </div>

        <div className='tw-mt-6'>
          <Overview whereConditions={whereConditions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;
