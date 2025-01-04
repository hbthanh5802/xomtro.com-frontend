import RHFSelect from '@/components/RHFSelect';
import locationService from '@/services/location.service';
import { GetPostsCountByTypeWithPostConditionsDataType } from '@/types/analytic.type';
import { SelectOptionItemType } from '@/types/common.type';
import { generateYearOptions, monthSelectOptions } from '@/utils/constants.helper';
import { Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FilterBarProps {
  whereConditions: GetPostsCountByTypeWithPostConditionsDataType;
  setWhereConditions: React.Dispatch<React.SetStateAction<AnalyticFilterFormDataType>>;
}

export type AnalyticFilterFormDataType = GetPostsCountByTypeWithPostConditionsDataType & {
  year?: number;
  month?: number;
};

const FilterBar = (props: FilterBarProps) => {
  const { setWhereConditions } = props;

  const methods = useForm<AnalyticFilterFormDataType>({
    defaultValues: {
      provinceName: undefined,
      districtName: undefined,
      wardName: undefined,
      status: undefined,
      month: undefined,
      year: new Date().getFullYear(),
    },
    mode: 'all',
  });

  const { control, watch } = methods;

  const { data: getProvinceResponse } = locationService.getAllProvinces({
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

  React.useEffect(() => {
    const sub = watch((value, { name }) => {
      const fieldValue = value[name as keyof AnalyticFilterFormDataType];
      setWhereConditions((prev) => ({ ...prev, [name as string]: fieldValue }));
    });

    return () => sub.unsubscribe();
  });

  const yearOptions = React.useMemo(
    () => generateYearOptions({ startYear: new Date().getFullYear(), length: 5, direction: 'backward' }),
    [],
  );

  return (
    <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-3'>
      <Typography level='title-md'>Bộ lọc:</Typography>
      <div>
        <FormProvider {...methods}>
          <form className='tw-flex tw-flex-col tablet:tw-flex-row tw-gap-2'>
            <RHFSelect<AnalyticFilterFormDataType>
              disabled={!provinceOptions.length}
              name='provinceName'
              control={control}
              placeholder='Chọn Tỉnh/Thành phố'
              options={provinceOptions}
              allowClear
              minWidth={200}
            />
            <RHFSelect<AnalyticFilterFormDataType>
              disabled={!monthSelectOptions.length}
              name='month'
              control={control}
              placeholder='Chọn Tháng'
              options={monthSelectOptions}
              allowClear
              minWidth={100}
            />
            <RHFSelect<AnalyticFilterFormDataType>
              disabled={!yearOptions.length}
              name='year'
              control={control}
              placeholder='Chọn năm'
              options={yearOptions}
              // allowClear
              minWidth={100}
            />
          </form>
          {/* <DevTool control={control} /> */}
        </FormProvider>
      </div>
    </div>
  );
};

export default FilterBar;
