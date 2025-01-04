import FileEmptyIcon from '@/assets/FileEmpty';
import RHFNumberInput from '@/components/RHFNumberInput';
import { AnalyticFilterFormDataType } from '@/pages/AnalyticPage/components/FilterBar';
import analyticService from '@/services/analytic.service';
import {
  GetPostPriceAnalyticConditionDataType,
  GetPostPriceAnalyticConditionResponseType,
} from '@/types/analytic.type';
import { CustomTooltipProps } from '@/types/recharts.type';
import { formatCurrencyVND, handleAxiosError } from '@/utils/constants.helper';
import { getPostPriceAnalyticConditionValidation } from '@/validations/analytic.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, IconButton, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdManageSearch } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

type FilterConditionType = {
  totalAreaStart?: number;
  totalAreaEnd?: number;
};
interface FilterBarProps {
  setFilterConditions: React.Dispatch<React.SetStateAction<FilterConditionType>>;
}
const FilterBar = (props: FilterBarProps) => {
  const { setFilterConditions } = props;
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });
  const methods = useForm<FilterConditionType>({
    defaultValues: {
      totalAreaEnd: undefined,
      totalAreaStart: undefined,
    },
    resolver: zodResolver(getPostPriceAnalyticConditionValidation),
    mode: 'all',
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = (data: FilterConditionType) => {
    setFilterConditions((prev) => ({ ...prev, totalAreaStart: data.totalAreaStart, totalAreaEnd: data.totalAreaEnd }));
  };

  return (
    <FormProvider {...methods}>
      <form className='tw-flex tw-items-center tw-gap-1' onSubmit={handleSubmit(handleSubmitForm)}>
        <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-2'>
          <Typography>Theo diện tích:</Typography>
          <div className='tw-grid tw-grid-cols-2 tablet:tw-flex tw-gap-1 tw-items-center'>
            <RHFNumberInput<FilterConditionType>
              name='totalAreaStart'
              endDecorator={
                <>
                  m<sup>2</sup>
                </>
              }
              required
              placeholder='VD: 25'
              min={0}
              fullWidth={false}
              sx={{ maxWidth: isMobile ? undefined : 150 }}
            />
            {!isMobile && <FaArrowRightLong className='tw-fill-slate-500' />}
            <RHFNumberInput<FilterConditionType>
              name='totalAreaEnd'
              endDecorator={
                <>
                  m<sup>2</sup>
                </>
              }
              min={0}
              placeholder='VD: 30'
              fullWidth={false}
              sx={{ maxWidth: isMobile ? undefined : 150 }}
            />
          </div>
        </div>
        <IconButton color='primary' variant='soft' type='submit' disabled={!isValid}>
          <MdManageSearch className='tw-text-[22px]' />
        </IconButton>
      </form>
    </FormProvider>
  );
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { month, avgPrice } = payload[0].payload as unknown as GetPostPriceAnalyticConditionResponseType;
    return (
      <div className='tw-bg-white/90 tw-p-3 tw-flex tw-flex-col tw-gap-1 tw-rounded tw-shadow tw-backdrop-blur-sm'>
        <Typography level='title-sm'>{`Tháng ${month}`}</Typography>
        <Typography level='body-sm'>
          Giá trung bình: <Typography level='title-sm'>{formatCurrencyVND(avgPrice)}</Typography>
        </Typography>
      </div>
    );
  }
};

interface PriceOverviewProps {
  whereConditions: AnalyticFilterFormDataType;
}
const PriceOverview = (props: PriceOverviewProps) => {
  const { whereConditions } = props;
  const [loading, setLoading] = React.useState(false);
  const [rentalPostPriceOverviewData, setRentalPostPriceOverviewData] = React.useState<
    GetPostPriceAnalyticConditionResponseType[]
  >([]);
  const [wantedPostPriceOverviewData, setWantedPostPriceOverviewData] = React.useState<
    GetPostPriceAnalyticConditionResponseType[]
  >([]);
  const [filterConditions, setFilterConditions] = React.useState<FilterConditionType>({
    totalAreaStart: undefined,
    totalAreaEnd: undefined,
  });

  const handleGetPostPriceOverview = async (conditions: GetPostPriceAnalyticConditionDataType) => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        analyticService.getPostPriceAnalyticByConditions({ ...conditions, type: 'rental' }),
        analyticService.getPostPriceAnalyticByConditions({ ...conditions, type: 'wanted' }),
      ]);

      const rentalResult = results[0];
      const wantedResult = results[1];

      if (rentalResult.status === 'fulfilled') {
        setRentalPostPriceOverviewData(rentalResult.value.data);
      } else {
        toast.error('Không lấy được dữ liệu giá từ bài đăng Cho thuê phòng. Hãy thử lại sau!');
      }

      if (wantedResult.status === 'fulfilled') {
        setWantedPostPriceOverviewData(wantedResult.value.data);
      } else {
        toast.error('Không lấy được dữ liệu giá từ bài đăng Cho tìm phòng cho thuê. Hãy thử lại sau!');
      }
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (whereConditions.year) {
      const getPostPricePayload: GetPostPriceAnalyticConditionDataType = {
        year: whereConditions.year,
        provinceName: whereConditions.provinceName ? whereConditions.provinceName.split('-')[1] : undefined,
        ...(filterConditions.totalAreaStart && { totalAreaStart: filterConditions.totalAreaStart }),
        ...(filterConditions.totalAreaEnd && { totalAreaEnd: filterConditions.totalAreaEnd }),
      };
      handleGetPostPriceOverview(getPostPricePayload);
    }
  }, [filterConditions, whereConditions]);

  const handleSetFilterConditions = React.useCallback(setFilterConditions, [setFilterConditions]);
  return (
    <section className='Analytic__price-range tw-p-3 tw-bg-white tw-rounded tw-shadow'>
      <div className='tw-flex tw-flex-col tablet:tw-flex-row tw-gap-3 tablet:tw-items-center tw-justify-between tw-mb-3'>
        <div className='tw-flex tw-gap-3 tw-items-center'>
          <Typography level='title-lg'>Biến động giá</Typography>
          <div className='tw-flex tw-gap-3'>
            {/* {loading && <CircularProgress size='sm' />} */}
            {whereConditions.provinceName ? (
              <Typography level='body-sm' color='danger' variant='outlined' sx={{ borderRadius: 4 }}>
                {whereConditions.provinceName?.split('-')[1]}
              </Typography>
            ) : (
              <Typography level='body-sm' color='neutral' variant='outlined' sx={{ borderRadius: 4 }}>
                Toàn quốc
              </Typography>
            )}
            {whereConditions.year && (
              <Typography level='body-sm' color='primary' variant='outlined' sx={{ borderRadius: 4 }}>
                {whereConditions.year}
              </Typography>
            )}
            {filterConditions.totalAreaStart && (
              <Typography level='body-sm' color='success' variant='outlined' sx={{ borderRadius: 4 }}>
                {`>= ${filterConditions.totalAreaStart} m`}
                <sup>2</sup>
              </Typography>
            )}
            {filterConditions.totalAreaEnd && (
              <Typography level='body-sm' color='success' variant='outlined' sx={{ borderRadius: 4 }}>
                {`<= ${filterConditions.totalAreaEnd} m`}
                <sup>2</sup>
              </Typography>
            )}
          </div>
          {loading && <CircularProgress size='sm' />}
        </div>
        <FilterBar setFilterConditions={handleSetFilterConditions} />
      </div>

      <div className='tw-flex tw-flex-col tablet:tw-flex-row'>
        <div className='tw-flex-1'>
          {rentalPostPriceOverviewData.length ? (
            <ResponsiveContainer width='100%' height={400}>
              <AreaChart
                data={rentalPostPriceOverviewData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Legend verticalAlign='top' height={36} />
                <Tooltip content={<CustomTooltip />} />
                <Area name='Cho thuê phòng trọ' type='monotone' dataKey='avgPrice' stroke='#8884d8' fill='#8884d8' />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className='tw-text-center tw-flex tw-items-center tw-flex-col tw-my-3 tw-gap-3'>
              <FileEmptyIcon size={72} />
              <Typography level='body-sm'>Chưa có dữ liệu tổng quan. Hãy thử tìm kiếm vào thời gian khác.</Typography>
            </div>
          )}
        </div>
        <div className='tw-flex-1'>
          {wantedPostPriceOverviewData.length ? (
            <ResponsiveContainer width='100%' height={400}>
              <AreaChart
                data={wantedPostPriceOverviewData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign='top' height={36} />
                <Area name='Tìm phòng cho thuê' type='monotone' dataKey='avgPrice' stroke='#82ca9d' fill='#82ca9d' />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className='tw-text-center tw-flex tw-items-center tw-flex-col tw-my-3 tw-gap-3'>
              <FileEmptyIcon size={72} />
              <Typography level='body-sm'>Chưa có dữ liệu tổng quan. Hãy thử tìm kiếm vào thời gian khác.</Typography>
            </div>
          )}
        </div>
      </div>

      <div className='tw-flex tw-gap-1'>
        <IoMdInformationCircleOutline className='tw-text-[16px] tw-mt-1 tw-shrink-0 tw-text-primaryColor' />
        <Typography level='body-sm'>
          Số liệu được tổng hợp từ{' '}
          <Typography sx={{ px: 0.5 }} level='title-sm'>
            giá trung bình theo tháng
          </Typography>{' '}
          của tất cả bài đăng theo thời gian được lựa chọn. Hãy xem như một thông tin tham khảo.
        </Typography>
      </div>
    </section>
  );
};

export default PriceOverview;
