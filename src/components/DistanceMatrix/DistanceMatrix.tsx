import LocationSearchBar from '@/components/DistanceMatrix/LocationSearchBar';
import RHFSelect from '@/components/RHFSelect';
import locationService from '@/services/location.service';
import { AutoCompleteResponseType, DistanceMatrixVehicle, GeocodingForwardResponseType } from '@/types/location.type';
import { vehicleOptions } from '@/utils/constants.helper';
import { distanceMatrixValidation } from '@/validations/location.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Chip, Divider, LinearProgress, Table, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MdLocationPin } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';

export type DistanceMatrixFromDataType = {
  origins: { description: string; longitude: number; latitude: number };
  destinations: { description: string; longitude: number; latitude: number }[];
  vehicle: DistanceMatrixVehicle;
};
interface DistanceMatrixProps {
  originDescription?: string;
  originLatitude?: number;
  originLongitude?: number;
}
const DistanceMatrix = (props: DistanceMatrixProps) => {
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });

  const distanceMatrixId = React.useId();
  const { originLatitude, originLongitude, originDescription } = props;

  const methods = useForm<DistanceMatrixFromDataType>({
    defaultValues: {
      origins:
        originDescription && originLatitude && originLongitude
          ? { description: originDescription, longitude: originLongitude, latitude: originLatitude }
          : undefined,
      destinations: [{ description: '', longitude: 0, latitude: 0 }],
      vehicle: undefined,
    },
    resolver: zodResolver(distanceMatrixValidation),
  });
  const { control, setValue, getValues, watch } = methods;
  const { origins, destinations, vehicle } = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'destinations',
  });

  const handleSelectedLocationValue = (
    selectedValue: AutoCompleteResponseType,
    geoCodingValue: GeocodingForwardResponseType,
  ) => {
    const destinationValues = getValues().destinations;
    destinationValues[destinationValues.length - 1] = {
      description: selectedValue.description,
      latitude: geoCodingValue.latitude,
      longitude: geoCodingValue.longitude,
    };
    setValue('destinations', destinationValues);
  };

  const allowAddLocation = () => {
    const destinationValues = getValues().destinations;
    if (!destinationValues.length) return true;
    const lastDestinationValue = destinationValues[destinationValues.length - 1];
    return !!lastDestinationValue.description && !!lastDestinationValue.latitude && !!lastDestinationValue.longitude;
  };

  const { data: getDistanceMatrixResult, isFetching: getDistanceMatrixFetching } = locationService.getDistanceMatrix({
    origin: {
      latitude: origins.latitude,
      longitude: origins.longitude,
    },
    destinations: destinations.length
      ? destinations.map((des) => ({ longitude: des.longitude, latitude: des.latitude }))
      : [],
    vehicle: vehicle,
  });
  const distanceMatrixResult = getDistanceMatrixResult?.data;

  return (
    <div className='tw-max-w-[100vw] tablet:tw-max-w-[680px] laptop:tw-max-w-[1000px]'>
      <section>
        <Typography>
          <Typography color='primary' level={isMobile ? 'title-sm' : 'title-md'}>
            Ma trận khoảng cách
          </Typography>{' '}
          là công cụ giúp bạn tính toán <Typography level={isMobile ? 'title-sm' : 'title-md'}>khoảng cách</Typography>{' '}
          và <Typography level={isMobile ? 'title-sm' : 'title-md'}>thời gian di chuyển</Typography> được ước tính tương
          đối từ một điểm đến một hoặc nhiều điểm khác nhau.
        </Typography>
        <Typography endDecorator='✨'>
          Kết quả chỉ mang tính chất tham khảo, trên thực tế sẽ chịu ảnh hưởng từ nhiều tác động ngoại cảnh khác.
        </Typography>
      </section>
      <Divider sx={{ mt: 2 }} />
      <div className='tw-flex tw-flex-col tablet:tw-flex-row tw-py-4 tw-gap-4'>
        <section className='tablet:tw-w-[400px] tw-flex-shrink-0'>
          <div className='tw-space-y-1'>
            <Typography level='body-sm'>Điểm bắt dầu:</Typography>
            {!origins.description && !origins.longitude && !origins.latitude ? (
              <div>
                <LocationSearchBar onSelectedResult={handleSelectedLocationValue} />
              </div>
            ) : (
              <div className='tw-flex tw-flex-wrap tw-justify-between'>
                <Typography startDecorator={<MdLocationPin className='tw-text-primaryColor' />} level='title-sm'>
                  {origins.description}
                </Typography>
              </div>
            )}
          </div>
          <Divider sx={{ my: 1 }} />
          <FormProvider {...methods}>
            <form className='tw-space-y-2'>
              {fields.map((field, index) => {
                const { description, longitude, latitude } = field;
                return (
                  <div key={field.id}>
                    <Typography level='body-sm'>Điểm kết thức {index + 1}:</Typography>
                    {!description && !longitude && !latitude ? (
                      <div>
                        <LocationSearchBar onSelectedResult={handleSelectedLocationValue} />
                      </div>
                    ) : (
                      <div className='tw-flex tw-flex-wrap tw-justify-between'>
                        <Typography startDecorator={<MdLocationPin className='tw-text-orange-600' />} level='title-sm'>
                          {description}
                        </Typography>
                        <Chip sx={{ ml: 'auto' }} size='sm' color='danger' onClick={() => remove(index)}>
                          Xoá
                        </Chip>
                      </div>
                    )}
                  </div>
                );
              })}
              <Button
                fullWidth
                size='sm'
                variant='soft'
                onClick={() => append({ description: '', longitude: 0, latitude: 0 })}
                disabled={allowAddLocation() ? false : true}
              >
                Thêm điểm đến
              </Button>
              <RHFSelect<DistanceMatrixFromDataType>
                control={control}
                name='vehicle'
                label='Loại phương tiện:'
                options={vehicleOptions}
                placeholder='Chọn phương tiện'
              />
            </form>
            {/* <DevTool control={control} /> */}
          </FormProvider>
        </section>
        {/* Result */}
        <section className='tw-basis-[200px] tw-flex-1 tw-border-l tw-pl-2'>
          <Typography level='title-md'>Kết quả:</Typography>
          {getDistanceMatrixFetching && <LinearProgress size='sm' />}
          {distanceMatrixResult?.length ? (
            <Table size='md' borderAxis='bothBetween' color='neutral' variant='plain'>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>STT</th>
                  <th>Khoảng cách (km)</th>
                  <th>Thời gian đi</th>
                </tr>
              </thead>
              <tbody>
                {distanceMatrixResult.map((result, index) => (
                  <tr key={`DistanceMatrixResultItem-${distanceMatrixId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{result.distance.text}</td>
                    <td>{result.duration.text}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Typography level='body-sm'>Không có kết quả! Hãy thử những lựa chọn khác.</Typography>
          )}
        </section>
      </div>
    </div>
  );
};

export default DistanceMatrix;
