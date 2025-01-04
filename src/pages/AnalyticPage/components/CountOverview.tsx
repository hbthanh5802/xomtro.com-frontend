import FileEmptyIcon from '@/assets/FileEmpty';
import { AnalyticFilterFormDataType } from '@/pages/AnalyticPage/components/FilterBar';
import analyticService from '@/services/analytic.service';
import {
  GetPostsCountByTypeWithPostConditionsDataType,
  GetPostsCountByTypeWithPostConditionsResponseType,
} from '@/types/analytic.type';
import { CustomTooltipProps } from '@/types/recharts.type';
import { getMonthDateRange, handleAxiosError, roundNumber } from '@/utils/constants.helper';
import { CircularProgress, Typography } from '@mui/joy';
import React, { useId } from 'react';
import { RiRectangleFill } from 'react-icons/ri';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  // console.log({ x, y, cx, cy, midAngle, innerRadius, outerRadius, percent, index });
  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const getPostLabel = (postType: 'rental' | 'wanted' | 'join' | 'pass') => {
  if (postType === 'rental') return 'Cho thuê phòng trọ';
  if (postType === 'wanted') return 'Tìm phòng cho thuê';
  if (postType === 'join') return 'Tìm người ở ghép';
  if (postType === 'pass') return 'Thanh lý đồ';
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0].payload;
    return (
      <div className='tw-bg-white/95 tw-p-3 tw-flex tw-items-center tw-gap-1 tw-rounded tw-shadow tw-backdrop-blur-sm'>
        <RiRectangleFill style={{ color: fill }} className='tw-mt-1 tablet:tw-mt-0 tw-text-[18px] tw-shrink-0' />
        <Typography level='body-md'>
          {name}: <Typography level='title-md'>{value}</Typography> bài đăng
        </Typography>
      </div>
    );
  }

  return null;
};

interface CountOverviewProps {
  whereConditions: AnalyticFilterFormDataType;
}
const CountOverview = (props: CountOverviewProps) => {
  const overviewId = useId();
  const { whereConditions } = props;
  const [loading, setLoading] = React.useState(false);
  const [overviewData, setCountOverviewData] = React.useState<GetPostsCountByTypeWithPostConditionsResponseType[]>([]);

  const handleGetCountOverviewData = async (whereConditions: AnalyticFilterFormDataType) => {
    setLoading(true);
    try {
      const requestData: GetPostsCountByTypeWithPostConditionsDataType = {
        provinceName: whereConditions.provinceName ? whereConditions.provinceName.split('-')[1] : undefined,
        dateStart: getMonthDateRange(whereConditions.month, whereConditions.year).startDate.toDateString(),
        dateEnd: getMonthDateRange(whereConditions.month, whereConditions.year).endDate.toDateString(),
      };
      const response = await analyticService.getPostsCountByTypeWithPostConditions(requestData);
      setCountOverviewData(response.data);
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  const chartData = React.useMemo(() => {
    if (!overviewData.length) return null;
    return overviewData.map((data) => ({
      name: getPostLabel(data.type),
      value: data.totalPosts,
    }));
  }, [overviewData]);

  const totalAllPosts = overviewData.reduce((acc, curr) => acc + curr.totalPosts, 0);

  React.useEffect(() => {
    if (whereConditions) {
      handleGetCountOverviewData(whereConditions);
    }
  }, [whereConditions]);

  return (
    <section className='Analytics__overview tw-p-3 tw-bg-white tw-rounded tw-shadow'>
      <div className='tw-flex tw-gap-3 tw-items-center tw-justify-between'>
        <Typography level='title-lg'>Tổng quan</Typography>
        <div className='tw-flex tw-gap-3'>
          {loading && <CircularProgress size='sm' />}
          {whereConditions.provinceName ? (
            <Typography level='body-sm' color='danger' variant='outlined' sx={{ borderRadius: 4 }}>
              {whereConditions.provinceName?.split('-')[1]}
            </Typography>
          ) : (
            <Typography level='body-sm' color='neutral' variant='outlined' sx={{ borderRadius: 4 }}>
              Toàn quốc
            </Typography>
          )}
          {whereConditions.month && (
            <Typography level='body-sm' color='success' variant='outlined' sx={{ borderRadius: 4 }}>
              Tháng {whereConditions.month}
            </Typography>
          )}
          {whereConditions.year && (
            <Typography level='body-sm' color='primary' variant='outlined' sx={{ borderRadius: 4 }}>
              {whereConditions.year}
            </Typography>
          )}
        </div>
      </div>
      {/* Chart */}
      {chartData ? (
        <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-6'>
          <div className='tw-h-[300px] tablet:tw-w-[300px] tw-shrink-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <Typography>
              Trong{' '}
              <Typography level='title-md'>{`${
                whereConditions.month
                  ? `tháng ${whereConditions.month.toString().padStart(2, '0')}/${whereConditions.year}`
                  : `năm ${whereConditions.year}`
              }`}</Typography>
              {whereConditions.provinceName && (
                <Typography sx={{ ml: 0.5 }} level='body-md'>
                  tại
                  <Typography level='body-md' color='danger' variant='plain' sx={{ borderRadius: 4 }}>
                    {whereConditions.provinceName?.split('-')[1]}
                  </Typography>
                </Typography>
              )}
              , có tổng cộng <Typography level='title-md'>{totalAllPosts}</Typography> bài viết được đăng tải. Trong đó:
            </Typography>
            <div className='tw-flex tw-flex-col tw-gap-1 tw-mt-2'>
              {overviewData.map((data, index) => {
                return (
                  <div
                    key={`Analytic__overview-${overviewId}-${index}`}
                    className='tw-flex tablet:tw-items-center  tw-gap-3'
                  >
                    <RiRectangleFill
                      style={{ color: COLORS[index] }}
                      className='tw-mt-1 tablet:tw-mt-0 tw-text-[18px] tw-shrink-0'
                    />
                    <Typography>
                      <Typography level='title-md'>{data.totalPosts}</Typography> bài đăng{' '}
                      <Typography level='title-md'>{getPostLabel(data.type)}</Typography>. Chiếm{' '}
                      <Typography level='title-md'>
                        {roundNumber((data.totalPosts / totalAllPosts) * 100, 0)}%
                      </Typography>{' '}
                      tổng số bài đăng.
                    </Typography>
                  </div>
                );
              })}
            </div>
            <div className='tw-mt-4'>
              <Typography level='title-md'>Nhận xét:</Typography>
              {(() => {
                const rental = overviewData.find((item) => item.type === 'rental') || { totalPosts: 0 };
                const wanted = overviewData.find((item) => item.type === 'wanted') || { totalPosts: 0 };

                if (rental.totalPosts > wanted.totalPosts) {
                  return (
                    <Typography level='body-md'>
                      Loại bài đăng <Typography level='title-md'>Cho thuê phòng</Typography> chiếm ưu thế với{' '}
                      <Typography level='title-md'>{rental.totalPosts}</Typography> bài đăng. Điều này cho thấy nhu cầu
                      đăng tin cho thuê đang cao, hãy tập trung cải thiện nội dung và hỗ trợ cho người cho thuê.
                    </Typography>
                  );
                } else if (rental.totalPosts < wanted.totalPosts) {
                  return (
                    <Typography>
                      Loại bài đăng <Typography level='title-md'>Tìm phòng</Typography> vượt trội với{' '}
                      <Typography level='title-md'>{wanted.totalPosts}</Typography> bài đăng. Đây là cơ hội để thu hút
                      thêm các bài đăng cho thuê để đáp ứng nhu cầu của người tìm phòng.
                    </Typography>
                  );
                } else {
                  return (
                    <Typography>
                      Hai loại bài đăng <Typography level='title-md'>Cho thuê phòng</Typography> và{' '}
                      <Typography level='title-md'>Tìm phòng</Typography> có số lượng tương đương, với mỗi loại{' '}
                      <Typography level='title-md'>{rental.totalPosts}</Typography> bài đăng. Cần xem xét cân bằng nhu
                      cầu và dịch vụ để đáp ứng tốt hơn.
                    </Typography>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      ) : (
        <div className='tw-text-center tw-flex tw-items-center tw-flex-col tw-my-3 tw-gap-3'>
          <FileEmptyIcon size={72} />
          <Typography level='body-sm'>Chưa có dữ liệu tổng quan. Hãy thử tìm kiếm vào thời gian khác.</Typography>
        </div>
      )}
    </section>
  );
};

export default CountOverview;
