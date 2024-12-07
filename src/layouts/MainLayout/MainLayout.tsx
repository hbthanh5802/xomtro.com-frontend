import Header from '@/components/Header';
import ScrollTopButton from '@/components/ScrollTopButton';
import useScrollToTop from '@/hooks/useScrollToTop';
import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { handleAxiosError, roundNumber } from '@/utils/constants.helper';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const DefaultLayout: React.FC = () => {
  const { pathname } = useUrl();
  const [location, setLocation] = React.useState<{ latitude: null | number; longitude: null | number }>({
    latitude: null,
    longitude: null,
  });
  useScrollToTop();

  const { currentUser, connectSocket, disconnectSocket, userLocation, fetchUserLocation, setLocationPermissionStatus } =
    useAppStore(
      useShallow((state) => ({
        currentUser: state.currentUser,
        connectSocket: state.connectSocket,
        disconnectSocket: state.disconnectSocket,
        userLocation: state.userLocation,
        fetchUserLocation: state.fetchUserLocation,
        setLocationPermissionStatus: state.setLocationPermissionStatus,
      })),
    );

  const requestLocationPermission = React.useCallback(() => {
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
  }, []);

  const getLocation = React.useCallback(() => {
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
  }, []);

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
      setLocationPermissionStatus(status.state); // granted, prompt, denied

      status.onchange = () => {
        setLocationPermissionStatus(status.state);
      };

      if (status.state === 'granted') {
        getLocation();
      } else if (status.state === 'prompt') {
        requestLocationPermission();
      } else {
        toast.info('Không lấy được vị trí của bạn. Cs vẻ dịch vụ định vị có vấn đề.', { duration: 1500 });
      }
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.info('Dịch vụ định vị chưa được uỷ quyền!.', { duration: 1500 });
    }
  }, [requestLocationPermission, getLocation, setLocationPermissionStatus]);

  React.useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const getUserLocation = React.useCallback(
    async (location: { latitude: null | number; longitude: null | number }) => {
      try {
        console.log('Get location', location);
        if (!location.latitude || !location.longitude) return;
        await fetchUserLocation(location.latitude, location.longitude);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    },
    [fetchUserLocation],
  );

  React.useEffect(() => {
    if (currentUser) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [currentUser, connectSocket, disconnectSocket]);

  React.useEffect(() => {
    if (location.longitude && location.latitude) {
      // Làm tròn vị trí hiện tại và vị trí trong store
      const roundedLatitude = roundNumber(location.latitude, 3);
      const roundedLongitude = roundNumber(location.longitude, 3);
      const roundedUserLatitude = userLocation?.latitude ? roundNumber(userLocation.latitude, 3) : null;
      const roundedUserLongitude = userLocation?.longitude ? roundNumber(userLocation.longitude, 3) : null;

      // Kiểm tra sự thay đổi vị trí
      if (roundedLatitude !== roundedUserLatitude || roundedLongitude !== roundedUserLongitude) {
        getUserLocation(location);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, userLocation]);

  const showScrollButton = !pathname.startsWith('/conversations') && !pathname.startsWith('/home');

  return (
    <div className='DefaultLayout'>
      <Header />
      <main className='tw-mt-[60px]'>
        <Outlet />
      </main>
      {showScrollButton && <ScrollTopButton />}
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
