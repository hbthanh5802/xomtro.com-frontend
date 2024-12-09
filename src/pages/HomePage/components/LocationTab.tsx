import MapBox from '@/components/MapBox';
import { useAppStore } from '@/store/store';
import { Typography } from '@mui/joy';
import { useShallow } from 'zustand/react/shallow';

const LocationTab = () => {
  const { userLocation, locationPermissionStatus } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
      locationPermissionStatus: state.locationPermissionStatus,
    })),
  );

  return (
    <div className='tw-border tw-bg-transparent tw-rounded tw-shadow-sm tw-m-2 tw-ml-[12px] tw-p-2'>
      <div className='tw-flex tw-gap-4 tw-items-start'>
        <div className='tw-relative tw-mt-[6px]'>
          <span
            className={`tw-absolute tw-inline-block tw-size-2 ${
              userLocation ? 'tw-bg-green-500 tw-animate-ping' : 'tw-bg-red-500'
            } tw-rounded-full`}
          ></span>
          <span
            className={`tw-absolute tw-inline-block tw-size-2 ${
              userLocation ? 'tw-bg-green-500' : 'tw-bg-red-500'
            } tw-rounded-full`}
          ></span>
        </div>
        <div>
          {locationPermissionStatus !== 'granted' && (
            <Typography level='body-sm'>Chưa xác định được vị trí của bạn!</Typography>
          )}
          <div className='tw-flex tw-items-center tw-gap-1'>
            {locationPermissionStatus !== 'granted' && <Typography level='title-sm'>Trạng thái quyền:</Typography>}
            {locationPermissionStatus === 'prompt' && <Typography level='body-sm'>Chưa cấp quyền.</Typography>}
            {locationPermissionStatus === 'denied' && (
              <Typography color='danger' level='body-sm'>
                Bị từ chối.
              </Typography>
            )}
            {locationPermissionStatus === 'prompt' && <Typography level='body-sm'>Chưa cấp quyền.</Typography>}
          </div>
          {userLocation ? (
            <div className='tw-space-y-0'>
              {/* <div className='tw-flex tw-items-center tw-gap-2'>
                <Typography level='title-sm'>Vĩ độ:</Typography>
                <Typography level='body-sm'>{userLocation.latitude}</Typography>
              </div>
              <div className='tw-flex tw-items-center tw-gap-2'>
                <Typography level='title-sm'>Kinh độ:</Typography>
                <Typography level='body-sm'>{userLocation.longitude}</Typography>
              </div> */}
              <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-1'>
                <Typography level='title-sm'>Vị trí của bạn:</Typography>
                <Typography level='body-sm'>{userLocation.addressComponents.slice(1).join(', ')}</Typography>
              </div>
            </div>
          ) : (
            <Typography level='body-sm'>Chưa có thông tin vị trí của bạn</Typography>
          )}
        </div>
      </div>
      <div className='tw-mt-4'>
        {userLocation && (
          <MapBox
            dragPan
            doubleClickZoom
            scrollZoom
            radius={1000}
            center={[userLocation?.longitude, userLocation?.latitude]}
            className='tw-w-full tw-h-[300px]'
          />
        )}
      </div>
    </div>
  );
};

export default LocationTab;
