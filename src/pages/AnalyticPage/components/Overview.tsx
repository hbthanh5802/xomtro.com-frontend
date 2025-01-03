import analyticService from '@/services/analytic.service';
import {
  GetPostsCountByTypeWithPostConditionsDataType,
  GetPostsCountByTypeWithPostConditionsResponseType,
} from '@/types/analytic.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Typography } from '@mui/joy';
import React from 'react';

interface OverviewProps {
  whereConditions: GetPostsCountByTypeWithPostConditionsDataType;
}
const Overview = (props: OverviewProps) => {
  const { whereConditions } = props;
  const [loading, setLoading] = React.useState(false);
  const [overviewData, setOverviewData] = React.useState<GetPostsCountByTypeWithPostConditionsResponseType[]>([]);

  const handleGetOverviewData = async (whereConditions: GetPostsCountByTypeWithPostConditionsDataType) => {
    setLoading(true);
    try {
      const requestData: GetPostsCountByTypeWithPostConditionsDataType = {
        provinceName: whereConditions.provinceName ? whereConditions.provinceName.split('-')[1] : undefined,
      };
      const response = await analyticService.getPostsCountByTypeWithPostConditions(requestData);
      console.log(response);
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (whereConditions) {
      handleGetOverviewData(whereConditions);
    }
  }, [whereConditions]);

  return (
    <section className='Analytics__overview tw-p-3 tw-bg-white tw-rounded tw-shadow'>
      <div className='tw-flex tw-gap-3 tw-items-center tw-justify-between'>
        <Typography level='title-lg'>Tổng quan</Typography>
        {whereConditions.provinceName && (
          <Typography level='body-sm' color='danger' variant='outlined' sx={{ borderRadius: 4 }}>
            {whereConditions.provinceName?.split('-')[1]}
          </Typography>
        )}
      </div>
      {/* Chart */}
      <div></div>
    </section>
  );
};

export default Overview;
