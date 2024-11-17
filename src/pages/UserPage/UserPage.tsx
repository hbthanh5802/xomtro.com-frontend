import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import InfoTab from '@/pages/UserPage/components/InfoTab';
import ProfileHeader from '@/pages/UserPage/components/ProfileHeader';
import { useAppStore } from '@/store/store';
import { AssetSelectSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { Box } from '@mui/joy';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ProfilePage = () => {
  const {
    params: { userId },
  } = useUrl();
  const [userData, setUserData] = React.useState<UserDetailSelectSchemaType | undefined | null>(null);
  const [userAvatarData, setUserAvatarData] = React.useState<AssetSelectSchemaType | undefined | null>(undefined);

  const { currentUser, currentUserAvatar } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      currentUserAvatar: state.userAvatar,
    })),
  );

  const { data: UserDetailResponse } = useUserApiHook.useUserDetail(Number(userId), {
    staleTime: 1 * 60 * 1000,
  });
  const { data: UserAvatarResponse } = useUserApiHook.useUserAvatar(Number(userId), {
    staleTime: 3 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;
  const userAvatar = UserAvatarResponse?.data;

  React.useEffect(() => {
    setUserData(currentUser?.userId === Number(userId) ? currentUser : userDetail);
    setUserAvatarData(currentUser?.userId === Number(userId) ? currentUserAvatar : userAvatar);
  }, [userDetail, userAvatar, userId, currentUser, currentUserAvatar]);

  return (
    <div className='tw-flex tw-flex-col tw-items-center tw-bg-backgroundColor'>
      <div className='tw-container tw-bg-backgroundColor'>
        <Box component='header'>
          <ProfileHeader />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
          }}
        >
          <div className='tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px] tw-px-[24px] tw-pb-[24px] tw-shadow-md tw-rounded-lg tw-mt-[12px] tw-bg-white'>
            <InfoTab userData={userData!} userAvatarData={userAvatarData!} />
          </div>
          <div className='tw-container tw-m-[14px] tw-mr-0'>
            <div className='tw-min-h-[100dvh]'>
              <Outlet />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ProfilePage;
