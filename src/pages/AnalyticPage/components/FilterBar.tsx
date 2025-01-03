import RHFSelect from '@/components/RHFSelect';
import locationService from '@/services/location.service';
import { GetPostsCountByTypeWithPostConditionsDataType } from '@/types/analytic.type';
import { SelectOptionItemType } from '@/types/common.type';
import { Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FilterBarProps {
  whereConditions: GetPostsCountByTypeWithPostConditionsDataType;
  setWhereConditions: React.Dispatch<React.SetStateAction<GetPostsCountByTypeWithPostConditionsDataType>>;
}

const FilterBar = (props: FilterBarProps) => {
  const { setWhereConditions } = props;

  const methods = useForm<GetPostsCountByTypeWithPostConditionsDataType>({
    defaultValues: {
      provinceName: undefined,
      districtName: undefined,
      wardName: undefined,
      status: undefined,
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
      const fieldValue = value[name as keyof GetPostsCountByTypeWithPostConditionsDataType];
      setWhereConditions((prev) => ({ ...prev, [name as string]: fieldValue }));
    });

    return () => sub.unsubscribe();
  });

  return (
    <div className='tw-flex tw-justify-between tw-items-center'>
      <Typography level='title-md'>Bộ lọc:</Typography>
      <div className='tw-ml-6'>
        <FormProvider {...methods}>
          <form className='tw-flex tw-flex-col tw-gap-4'>
            <RHFSelect<GetPostsCountByTypeWithPostConditionsDataType>
              disabled={!provinceOptions.length}
              name='provinceName'
              control={control}
              placeholder='Chọn Tỉnh/Thành phố'
              options={provinceOptions}
              allowClear
              minWidth={200}
            />
          </form>
          {/* <DevTool control={control} /> */}
        </FormProvider>
      </div>
    </div>
  );
};

export default FilterBar;
