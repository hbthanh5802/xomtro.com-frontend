import RHFCheckbox from '@/components/RHFCheckbox';
import RHFCurrencyInput from '@/components/RHFCurrencyInput';
import RHFNumberInput from '@/components/RHFNumberInput';
import RHFSelect from '@/components/RHFSelect';
import RHFSlider from '@/components/RHFSlider';
import useUrl from '@/hooks/useUrl.hook';
import locationService from '@/services/location.service';
import {
  OrderConditionType,
  WhereConditionType,
  defaultOrderFilter,
  defaultWhereFilter,
} from '@/store/postFilterSlice';
import { useAppStore } from '@/store/store';
import { SelectOptionItemType } from '@/types/common.type';
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Divider,
  Tooltip,
  Typography,
} from '@mui/joy';
import React, { Dispatch } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { MdFilterAlt } from 'react-icons/md';
import { useShallow } from 'zustand/react/shallow';

type FilterDataType = WhereConditionType & OrderConditionType & { radius?: number };

const AddressFilter = () => {
  const { control, watch, getValues } = useFormContext();
  const [selectedProvinceValue, selectedDistrictValue] = watch(['provinceName', 'districtName']);
  const provinceCode = selectedProvinceValue?.split('-')[0];
  const districtCode = selectedDistrictValue?.split('-')[0];

  const { data: getProvinceResponse } = locationService.getAllProvinces({
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const { data: getDistrictResponse } = locationService.getDistrictsByProvinceCode(Number(provinceCode), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const { data: getWardResponse } = locationService.getWardsByDistrictCode(Number(districtCode), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const provinceOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getProvinceResponse) {
      const { data } = getProvinceResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getProvinceResponse]);

  const districtOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getDistrictResponse) {
      const { data } = getDistrictResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getDistrictResponse]);

  const wardOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getWardResponse) {
      const { data } = getWardResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getWardResponse]);

  const { userLocation } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
    })),
  );

  const isNearest = watch('nearest');

  return (
    <div className='tw-space-y-[8px]'>
      <Divider>Vị trí</Divider>
      <Tooltip
        sx={{ maxWidth: 300 }}
        arrow
        title='Lựa chọn này yêu cầu sử dụng Dịch vụ định vị. Hãy cho phép chúng tôi sử dụng dịch vụ định vị của bạn.'
      >
        <div className='tw-inline-block'>
          <RHFCheckbox<FilterDataType> name='nearest' label='Gần vị trí của tôi' size='sm' disabled={!userLocation} />
        </div>
      </Tooltip>
      <RHFSlider<FilterDataType>
        name='radius'
        label='Bán kính (Km):'
        step={5}
        min={0}
        max={100}
        valueLabelDisplay='auto'
        size='sm'
        disabled={!userLocation || !getValues().nearest}
        marks={[
          { label: 0, value: 0 },
          { label: 20, value: 20 },
          { label: 40, value: 40 },
          { label: 60, value: 60 },
          { label: 100, value: 100 },
        ]}
      />
      <Divider>Địa chỉ</Divider>
      <RHFSelect<FilterDataType>
        disabled={isNearest || !provinceOptions.length}
        name='provinceName'
        control={control}
        label='Tỉnh/Thành phố'
        placeholder='Chọn Tỉnh/Thành phố'
        options={provinceOptions}
        allowClear
      />

      <RHFSelect<FilterDataType>
        disabled={isNearest || !districtOptions.length}
        name='districtName'
        control={control}
        label='Quận/Huyện:'
        placeholder='Chọn Quận/Huyện'
        options={districtOptions}
        allowClear
      />

      <RHFSelect<FilterDataType>
        disabled={isNearest || !wardOptions.length}
        name='wardName'
        control={control}
        label='Phường/Xã/Thị trấn:'
        placeholder='Chọn Phường/Xã/Thị trấn'
        options={wardOptions}
        allowClear
      />
    </div>
  );
};

interface FilterBarProps {
  whereConditions: WhereConditionType;
  setWhereConditions: Dispatch<React.SetStateAction<WhereConditionType>>;
  setOrderConditions: Dispatch<React.SetStateAction<OrderConditionType>>;
}

const FilterBar = (props: FilterBarProps) => {
  const { pathname } = useUrl();
  const { setWhereConditions, whereConditions } = props;
  const [filters, setFilters] = React.useState({
    amenities: true,
    price: true,
    location: true,
  });

  const methods = useForm<FilterDataType>({
    defaultValues: { ...defaultOrderFilter, ...defaultWhereFilter, radius: 50 },
  });
  const { watch, reset, setValue, getValues } = methods;

  const handleResetAll = () => {
    reset({ ...defaultOrderFilter, ...defaultWhereFilter });
    setWhereConditions(defaultWhereFilter);
  };

  const { userLocation } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
    })),
  );

  React.useEffect(() => {
    const sb = watch((value, { name }) => {
      const fieldValue = value[name as keyof FilterDataType];
      if (['provinceName', 'districtName', 'wardName'].includes(name as string)) {
        if (typeof fieldValue === 'string') {
          const addressValue = fieldValue.split('-')[1];
          setWhereConditions((prev) => ({
            ...prev,
            [name as string]: addressValue,
          }));
        } else if (!fieldValue) {
          setWhereConditions((prev) => ({
            ...prev,
            [name as string]: undefined,
          }));
        }
      } else if (name === 'nearest' || name === 'radius') {
        if (userLocation) {
          setValue('provinceName', undefined);
          setValue('districtName', undefined);
          setValue('wardName', undefined);
          setWhereConditions((prev) => {
            return {
              ...prev,
              ...(value['nearest']
                ? {
                    nearest: {
                      longitude: userLocation.longitude,
                      latitude: userLocation.latitude,
                      radius: name === 'radius' ? Number(fieldValue) : 50,
                    },
                    provinceName: undefined,
                    districtName: undefined,
                    wardName: undefined,
                  }
                : { nearest: false }),
            };
          });
        }
        // if (userLocation) {
        //   setWhereConditions((prev) => {
        //     return {
        //       ...prev,
        //       ...(value['nearest']
        //         ? {
        //             nearest: {
        //               longitude: userLocation.longitude,
        //               latitude: userLocation.latitude,
        //               radius: name === 'radius' ? Number(fieldValue) : 50,
        //             },
        //           }
        //         : { nearest: false }),
        //     };
        //   });
        // }
      } else {
        if (['/home/rental', '/home/wanted', '/home/join'].includes(pathname)) {
          if (['priceStart', 'priceEnd'].includes(name as string)) {
            if (Number(fieldValue) > 100000) {
              setWhereConditions((prev) => ({
                ...prev,
                [name as string]: fieldValue,
              }));
            }
          } else {
            setWhereConditions((prev) => ({
              ...prev,
              [name as string]: fieldValue,
            }));
          }
        } else {
          setWhereConditions((prev) => ({
            ...prev,
            [name as string]: fieldValue,
          }));
        }
      }
    });

    return () => sb.unsubscribe();
  }, [watch, setWhereConditions, pathname, setValue, userLocation]);

  React.useEffect(() => {
    if (
      !!whereConditions.provinceName &&
      !!getValues().provinceName &&
      whereConditions.provinceName !== getValues().provinceName?.split('-')[1]
    ) {
      setValue('provinceName', undefined);
      setValue('districtName', undefined);
      setValue('wardName', undefined);
    }
  }, [whereConditions, getValues, setValue]);

  return (
    <div className='tw-relative tw-rounded tw-bg-white/15 tw-border tw-border-slate-200 tw-shadow-md'>
      <header className='tw-sticky tw-top-0 tw-z-10 tw-p-[8px] tw-flex tw-justify-between tw-bg-primaryColor tw-rounded-t-md'>
        <Typography
          textColor={'common.white'}
          startDecorator={<MdFilterAlt className='tw-text-[22px]' />}
          level='title-md'
        >
          Bộ lọc
        </Typography>
        <Button size='sm' onClick={handleResetAll}>
          Xoá tất cả lọc
        </Button>
      </header>
      <Divider />
      <FormProvider {...methods}>
        <form>
          <AccordionGroup sx={{ maxWidth: 400 }}>
            <Accordion
              expanded={filters.location}
              onChange={(_, expanded) => {
                setFilters((prev) => ({ ...prev, location: expanded ? true : false }));
              }}
            >
              <AccordionSummary color={filters.location ? 'primary' : 'neutral'}>Theo vị trí địa lý:</AccordionSummary>
              <AccordionDetails>
                <AddressFilter />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={filters.price}
              onChange={(_, expanded) => {
                setFilters((prev) => ({ ...prev, price: expanded ? true : false }));
              }}
            >
              <AccordionSummary color={filters.price ? 'primary' : 'neutral'}>Theo chỉ số:</AccordionSummary>
              <AccordionDetails>
                <div className='tw-py-[8px] tw-space-y-1'>
                  <Divider>Theo giá phòng</Divider>
                  <div className='tw-grid tw-grid-cols-1 tw-gap-2'>
                    <RHFCurrencyInput<FilterDataType>
                      name='priceStart'
                      label='Giá khởi điểm:'
                      min={0}
                      required
                      placeholder='Giá từ...'
                    />
                    <RHFCurrencyInput<FilterDataType>
                      name='priceEnd'
                      label='Giá kết thúc:'
                      min={0}
                      placeholder='Giá đến...'
                    />
                  </div>
                  <Divider>Theo diện tích</Divider>
                  <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-2 tw-gap-2'>
                    <RHFNumberInput<FilterDataType>
                      name='totalAreaStart'
                      endDecorator={
                        <>
                          m<sup>2</sup>
                        </>
                      }
                      required
                      label='Từ:'
                      placeholder='VD: 25'
                      min={0}
                    />
                    <RHFNumberInput<FilterDataType>
                      name='totalAreaEnd'
                      endDecorator={
                        <>
                          m<sup>2</sup>
                        </>
                      }
                      label='Đến:'
                      min={0}
                      placeholder='VD: 30'
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            {['/home/wanted', '/home/join', '/home/rental'].includes(pathname) && (
              <Accordion
                expanded={filters.amenities}
                onChange={(_, expanded) => {
                  setFilters((prev) => ({ ...prev, amenities: expanded ? true : false }));
                }}
              >
                <AccordionSummary color={filters.amenities ? 'primary' : 'neutral'}>
                  Theo dịch vụ, tiện ích:
                </AccordionSummary>
                <AccordionDetails>
                  <div className='tw-py-[8px] tw-space-y-3'>
                    <RHFCheckbox<FilterDataType> name='hasFurniture' label='Nội thất cơ bản' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasAirConditioner' label='Điều hoà' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasElevator' label='Thang máy' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasInternet' label='Sẵn mạng, internet' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasParking' label='Chỗ để xe' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasPrivateBathroom' label='Vệ sinh khép kín' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasRefrigerator' label='Sẵn tủ lạnh' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasWashingMachine' label='Sẵn máy giặt' size='sm' />
                    <RHFCheckbox<FilterDataType> name='hasSecurity' label='Bảo vệ' size='sm' />
                    <RHFCheckbox<FilterDataType> name='allowPets' label='Cho phép nuôi thú cưng' size='sm' />
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
          </AccordionGroup>
        </form>
      </FormProvider>
    </div>
  );
};

export default FilterBar;
