import PostCardSkeleton from '@/components/PostCardSkeleton';
import RHFSelect from '@/components/RHFSelect';
import useUrl from '@/hooks/useUrl.hook';
import SearchJoinPost from '@/pages/SearchPage/components/SearchJoinPostTab';
import SearchPassPost from '@/pages/SearchPage/components/SearchPassPostTab';
import SearchRentalTab from '@/pages/SearchPage/components/SearchRentalTab';
import SearchWantedPost from '@/pages/SearchPage/components/SearchWantedPostTab';
import locationService from '@/services/location.service';
import {
  defaultOrderFilter,
  defaultWhereFilter,
  OrderConditionType,
  WhereConditionType,
} from '@/store/postFilterSlice';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, ButtonGroup, Divider, Typography } from '@mui/joy';
import React, { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag } from 'react-icons/fa6';
import { IoHome } from 'react-icons/io5';
import { MdLocationPin } from 'react-icons/md';
import { Navigate, useNavigate } from 'react-router-dom';

const navButtonStyle = { textAlign: 'left', display: 'flex', justifyContent: 'flex-start' };

type PostType = 'rental' | 'wanted' | 'join' | 'pass';
type FilterSortTDataType = {
  price: 'asc' | 'desc';
  updatedAt: 'asc' | 'desc';
};

const FilterBar = () => {
  const { control } = useFormContext<FilterSortTDataType>();
  return (
    <div className='tw-space-y-4'>
      <RHFSelect<FilterSortTDataType>
        control={control}
        name='price'
        label='Theo giá:'
        placeholder='Sắp xếp theo giá'
        allowClear
        options={[
          {
            label: 'Thấp đến Cao',
            value: 'asc',
          },
          {
            label: 'Cao đến Thấp',
            value: 'desc',
          },
        ]}
      />
      <RHFSelect<FilterSortTDataType>
        control={control}
        name='updatedAt'
        label='Ngày đăng bài:'
        placeholder='Theo thời gian'
        allowClear
        options={[
          {
            label: 'Mới nhất',
            value: 'desc',
          },
          {
            label: 'Muộn nhất',
            value: 'asc',
          },
        ]}
      />
    </div>
  );
};

const SearchPage = () => {
  const {
    search: { searchResult, searchValue },
  } = useUrl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchPostType, setSearchPostType] = React.useState<PostType>('rental');
  const [whereConditions, setWhereConditions] = React.useState<WhereConditionType>(defaultWhereFilter);
  const [orderConditions, setOrderConditions] = React.useState<OrderConditionType>(defaultOrderFilter);

  const handleGetGeocoding = React.useCallback(
    async (addressValue: string) => {
      setLoading(true);
      try {
        if (!addressValue) return;
        const response = await locationService.getGeocodingForward(addressValue);
        const { longitude, latitude } = response.data;
        setWhereConditions((prev) => ({ ...prev, nearest: { radius: 50, longitude, latitude } }));
      } catch (error) {
        console.log(handleAxiosError(error));
        navigate('/404');
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const methods = useForm<FilterSortTDataType>({
    defaultValues: {
      updatedAt: 'desc',
    },
  });
  const { watch } = methods;

  React.useEffect(() => {
    if (searchResult) {
      handleGetGeocoding(searchResult as string);
    }
  }, [handleGetGeocoding, searchResult]);

  React.useEffect(() => {
    const sb = watch((value, { name }) => {
      const fieldValue = value[name as keyof FilterSortTDataType];
      console.log(name, fieldValue);
      if (name === 'price') {
        setOrderConditions((prev) => ({ ...prev, price: fieldValue }));
      } else if (name === 'updatedAt') {
        setOrderConditions((prev) => ({ ...prev, updatedAt: fieldValue }));
      }
    });

    return () => sb.unsubscribe();
  }, [watch]);

  if (!searchResult || !searchValue) {
    return <Navigate to={'/404'} />;
  }

  return (
    <div className='tw-relative tw-flex tw-bg-backgroundColor tw-h-dvh tw-overflow-y-auto tw-flex-col tw-items-center tw-scroll-pt-[var(--header-height)]'>
      <div className='tw-container'>
        <header className='tw-mt-[40px] tw-mb-[20px] tw-mx-[12px] tablet:tw-mx-0'>
          <Typography startDecorator={<MdLocationPin />} level='body-lg'>
            Kết quả tìm kiếm gần khu vực:
          </Typography>
          <Typography level='title-lg' color='primary'>
            {searchResult}
          </Typography>
        </header>
        <Divider></Divider>
        <div className='tw-flex tw-flex-col laptop:tw-flex-row laptop:tw-items-start tw-mt-[24px]'>
          <div className='laptop:tw-z-10 laptop:tw-top-[8px] laptop:tw-left-0 laptop:tw-sticky'>
            <div className='laptop:tw-w-[400px] tw-shadow-md tw-rounded-lg tw-mt-[12px] tw-bg-white tw-p-[24px] tw-space-y-2'>
              <Typography level='title-md'>Loại bài đăng:</Typography>
              <ButtonGroup size='lg' orientation='vertical' variant='plain' aria-label='vertical outlined button group'>
                <Button
                  key='rental'
                  onClick={() => setSearchPostType('rental')}
                  color={searchPostType === 'rental' ? 'primary' : 'neutral'}
                  variant={searchPostType === 'rental' ? 'solid' : 'plain'}
                  startDecorator={<FaHouseMedicalFlag className='tw-text-[18px]' />}
                  sx={navButtonStyle}
                >
                  Cho thuê phòng trọ
                </Button>
                <Button
                  key='wanted'
                  onClick={() => setSearchPostType('wanted')}
                  color={searchPostType === 'wanted' ? 'primary' : 'neutral'}
                  variant={searchPostType === 'wanted' ? 'solid' : 'plain'}
                  startDecorator={<IoHome className='tw-text-[18px]' />}
                  sx={navButtonStyle}
                >
                  Tìm phòng cho thuê
                </Button>
                <Button
                  key='join'
                  onClick={() => setSearchPostType('join')}
                  color={searchPostType === 'join' ? 'primary' : 'neutral'}
                  variant={searchPostType === 'join' ? 'solid' : 'plain'}
                  startDecorator={<FaHouseChimneyUser className='tw-text-[18px]' />}
                  sx={navButtonStyle}
                >
                  Tìm người ở ghép
                </Button>
                <Button
                  key='pass'
                  onClick={() => setSearchPostType('pass')}
                  color={searchPostType === 'pass' ? 'primary' : 'neutral'}
                  variant={searchPostType === 'pass' ? 'solid' : 'plain'}
                  startDecorator={<FaHandsHoldingCircle className='tw-text-[18px]' />}
                  sx={navButtonStyle}
                >
                  Góc pass đồ
                </Button>
              </ButtonGroup>
            </div>
            <div className='laptop:tw-w-[400px] tw-top-[20px] tw-left-0 tw-sticky tw-shadow-md tw-rounded-lg tw-mt-[12px] tw-bg-white tw-p-[24px] tw-space-y-2'>
              <Typography level='title-md'>Sắp xếp:</Typography>
              <FormProvider {...methods}>
                <form>
                  <FilterBar />
                </form>
              </FormProvider>
            </div>
          </div>
          <Divider sx={{ mx: 2, mt: 4 }} orientation='vertical' />
          <div className='tw-flex-1 tw-mt-[24px] laptop:tw-m-[14px] laptop:tw-mr-0 laptop:tw-max-w-[calc(100%-444px)]'>
            {loading ? (
              <PostCardSkeleton />
            ) : (
              <>
                {searchPostType === 'rental' && (
                  <SearchRentalTab whereConditions={whereConditions} orderConditions={orderConditions} />
                )}
                {searchPostType === 'wanted' && (
                  <SearchWantedPost whereConditions={whereConditions} orderConditions={orderConditions} />
                )}
                {searchPostType === 'join' && (
                  <SearchJoinPost whereConditions={whereConditions} orderConditions={orderConditions} />
                )}
                {searchPostType === 'pass' && (
                  <SearchPassPost whereConditions={whereConditions} orderConditions={orderConditions} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
