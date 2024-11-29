import { useAppStore } from '@/store/store';
import { handleAxiosError } from '@/utils/constants.helper';
import { Typography } from '@mui/joy';
import React from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const LocationTab = () => {
  const [permissionStatus, setPermissionStatus] = React.useState<'granted' | 'prompt' | 'denied'>('prompt');
  const [location, setLocation] = React.useState<{ latitude: null | number; longitude: null | number }>({
    latitude: null,
    longitude: null,
  });

  const { userLocation, fetchUserLocation } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
      fetchUserLocation: state.fetchUserLocation,
    })),
  );

  const checkPermission = React.useCallback(async () => {
    if (!navigator.permissions || !navigator.geolocation) {
      toast.info(
        'Trình duyệt của bạn có vẻ không hỗ trợ dịch vụ định vị. Điều này có thể làm giảm khả năng tìm kiếm kết quả phù hợp cho bạn.',
        { duration: 1500 },
      );
      return;
    }

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(status.state); // granted, prompt, denied

      status.onchange = () => {
        setPermissionStatus(status.state);
      };

      if (status.state === 'granted') {
        getLocation();
      } else if (status.state === 'prompt') {
        requestLocationPermission();
      } else {
        toast.info('Không lấy được vị trí của bạn. Cs vẻ dịch vụ định vị có vấn đề.', { duration: 1500 });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.info('Dịch vụ định vị chưa được uỷ quyền!.', { duration: 1500 });
    }
  }, []);

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        toast.info('Không lấy được vị trí của bạn. Cs vẻ dịch vụ định vị có vấn đề.', { duration: 1500 });
      },
      { enableHighAccuracy: true },
    );
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        toast.info('Không lấy được vị trí của bạn. Cs vẻ dịch vụ định vị có vấn đề.', { duration: 1500 });
      },
      { enableHighAccuracy: true },
    );
  };

  React.useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const getUserLocation = React.useCallback(async () => {
    try {
      if (!location.latitude || !location.longitude) return;
      await fetchUserLocation(location.latitude, location.longitude);
    } catch (error) {
      console.log(handleAxiosError(error));
    }
  }, [location.longitude, location.latitude, fetchUserLocation]);

  React.useEffect(() => {
    // getUserLocation();
  }, [location.longitude, location.latitude, getUserLocation]);

  return (
    <div className='tw-p-[8px] tw-border tw-border-primaryColor tw-rounded-md tw-shadow-sm tw-shadow-primaryColor/50'>
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
          {permissionStatus !== 'granted' && (
            <Typography level='body-sm'>Chưa xác định được vị trí của bạn!</Typography>
          )}
          <div className='tw-flex tw-items-center tw-gap-1'>
            {permissionStatus !== 'granted' && <Typography level='title-sm'>Trạng thái quyền:</Typography>}
            {permissionStatus === 'prompt' && <Typography level='body-sm'>Chưa cấp quyền.</Typography>}
            {permissionStatus === 'denied' && (
              <Typography color='danger' level='body-sm'>
                Bị từ chối.
              </Typography>
            )}
            {permissionStatus === 'prompt' && <Typography level='body-sm'>Chưa cấp quyền.</Typography>}
          </div>
          {userLocation ? (
            <div className='tw-space-y-0'>
              <div className='tw-flex tw-items-center tw-gap-2'>
                <Typography level='title-sm'>Vĩ độ:</Typography>
                <Typography level='body-sm'>{userLocation.latitude}</Typography>
              </div>
              <div className='tw-flex tw-items-center tw-gap-2'>
                <Typography level='title-sm'>Kinh độ:</Typography>
                <Typography level='body-sm'>{userLocation.longitude}</Typography>
              </div>
              <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-1'>
                <Typography level='title-sm'>Địa chỉ:</Typography>
                <Typography level='body-sm'>{userLocation.addressComponents.slice(1).join(', ')}</Typography>
              </div>
            </div>
          ) : (
            <Typography level='body-sm'>Chưa có thông tin vị trí của bạn</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationTab;
