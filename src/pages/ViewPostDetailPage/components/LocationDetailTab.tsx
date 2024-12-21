import MapBox from '@/components/MapBox';
import ModalLayout from '@/components/ModalLayout';
import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import RHFSelect from '@/components/RHFSelect';
import locationService from '@/services/location.service';
import { useAppStore } from '@/store/store';
import { DistanceMatrixVehicle } from '@/types/location.type';
import { Button, Skeleton, Table, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BsTaxiFrontFill } from 'react-icons/bs';
import { FaCar, FaMotorcycle, FaTruckMoving } from 'react-icons/fa6';
import { MdDirectionsBike, MdLocationPin } from 'react-icons/md';
import { RiPinDistanceFill } from 'react-icons/ri';
import { useInView } from 'react-intersection-observer';
import { useShallow } from 'zustand/react/shallow';

interface DistanceMatrixTabProps {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}

type DistanceMatrixFromDataType = {
  vehicle: DistanceMatrixVehicle;
};

const vehicleOptions = [
  { label: 'Xe đạp', value: 'bike' },
  { label: 'Xe ô tô', value: 'car' },
  { label: 'Xe taxi', value: 'taxi' },
  { label: 'Xe tải', value: 'truck' },
  { label: 'Những phương tiện gọi xe khác', value: 'hd' },
];

const vehicleIcons = {
  bike: <MdDirectionsBike className='tw-size-[16px]' />,
  car: <FaCar className='tw-size-[16px]' />,
  truck: <FaTruckMoving className='tw-size-[16px]' />,
  taxi: <BsTaxiFrontFill className='tw-size-[16px]' />,
  hd: <FaMotorcycle className='tw-size-[16px]' />,
};
const DistanceMatrixTab = (props: DistanceMatrixTabProps) => {
  const { originLatitude, originLongitude, destinationLatitude, destinationLongitude } = props;
  const methods = useForm<DistanceMatrixFromDataType>({
    defaultValues: {
      vehicle: 'bike',
    },
  });
  const { watch, control } = methods;
  const vehicleValue = watch('vehicle');
  const selectedVehicle = vehicleOptions.find((vehicle) => vehicle.value === vehicleValue);

  const { data: getDistanceMatrixResponse, isFetching: getDistanceMatrixFetching } = locationService.getDistanceMatrix(
    {
      origin: {
        latitude: originLatitude,
        longitude: originLongitude,
      },
      destinations: [{ latitude: Number(destinationLatitude), longitude: Number(destinationLongitude) }],
      vehicle: vehicleValue,
    },
    { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  );
  const distanceMatrixData = getDistanceMatrixResponse?.data;

  return (
    <div className='tw-w-full'>
      <FormProvider {...methods}>
        <form className='tablet:tw-max-w-[300px]'>
          <RHFSelect<DistanceMatrixFromDataType>
            control={control}
            name='vehicle'
            label='Loại phương tiện:'
            options={vehicleOptions}
          />
        </form>
      </FormProvider>
      <div className='tw-mt-2'>
        {getDistanceMatrixFetching && (
          <Skeleton animation='wave' variant='rectangular' height={60} sx={{ width: '100%' }} />
        )}
        {!!distanceMatrixData && (
          <Table size='md' borderAxis='bothBetween' color='neutral' variant='plain'>
            <thead>
              <tr>
                <th style={{ width: '10%' }}>STT</th>
                <th style={{ width: '40%' }}>Loại phương tiện</th>
                <th>Khoảng cách (km)</th>
                <th>Thời gian đi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <Typography startDecorator={vehicleIcons[selectedVehicle?.value as keyof typeof vehicleIcons]}>
                    {selectedVehicle?.label}
                  </Typography>
                </td>
                <td>{distanceMatrixData[0].distance.text}</td>
                <td>{distanceMatrixData[0].duration.text}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

interface ViewPostDetailProps {
  data: PostCardDataType;
}
const LocationDetailTab = (props: ViewPostDetailProps) => {
  const { post } = props.data;
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  const [viewMap, setViewMap] = React.useState(false);

  const { userLocation } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
    })),
  );

  return (
    <>
      <div ref={ref} id='location'>
        <div className='tw-mt-4 tw-bg-white tw-shadow-sm tw-rounded tw-p-[24px]'>
          <Typography level='title-lg' variant='plain'>
            Địa chỉ:
          </Typography>
          {/* </Divider> */}
          <div className='tw-my-4'>
            <Typography startDecorator={<MdLocationPin className='tw-text-[18px]' />} level='title-lg'>{`${
              post.addressDetail ? post.addressDetail + ', ' : ''
            }${post.addressWard}, ${post.addressDistrict}, ${post.addressProvince}.`}</Typography>
          </div>

          {inView && (
            <>
              <MapBox
                center={[Number(post.addressLongitude), Number(post.addressLatitude)]}
                zoom={11}
                className='tw-w-full tw-h-[300px]'
                fillOpacity={0.1}
                // showToggleMapStyle
              />
              <Button fullWidth onClick={() => setViewMap(true)}>
                Xem toàn bản đồ
              </Button>
            </>
          )}

          {!!post && inView && (
            <>
              <div className='tw-flex tw-items-center tw-gap-2 tw-mt-4'>
                <Typography
                  startDecorator={<RiPinDistanceFill className='tw-size-[18px]' />}
                  level='title-md'
                  variant='plain'
                >
                  Dự đoán thời gian và khoảng cách đi lại từ vị trí của bạn:
                </Typography>
                <Typography color='primary' variant='outlined' level='body-md'>
                  {userLocation
                    ? userLocation?.addressComponents.slice(1).join(', ')
                    : 'Chưa xác định được vị trí của bạn'}
                </Typography>
              </div>
              {userLocation && (
                <DistanceMatrixTab
                  originLatitude={userLocation.latitude}
                  originLongitude={userLocation.longitude}
                  destinationLatitude={Number(post.addressLatitude)}
                  destinationLongitude={Number(post.addressLongitude)}
                />
              )}
            </>
          )}
        </div>
      </div>
      <ModalLayout keepMounted isOpen={viewMap} onCloseModal={() => setViewMap(false)}>
        <MapBox
          center={[Number(post.addressLongitude), Number(post.addressLatitude)]}
          zoom={12}
          className='tw-max-w-[100dvh] laptop:tw-w-[100vh] tw-h-[80dvh]'
          scrollZoom
          doubleClickZoom
          dragPan
          fillOpacity={0.1}
          showToggleMapStyle
        />
      </ModalLayout>
    </>
  );
};

export default LocationDetailTab;
