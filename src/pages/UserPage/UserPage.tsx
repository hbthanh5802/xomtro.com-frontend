import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import InfoTab from '@/pages/UserPage/components/InfoTab';
import ProfileHeader from '@/pages/UserPage/components/ProfileHeader';
import UserContacts from '@/pages/UserPage/components/UserContacts';
import { useAppStore } from '@/store/store';
import { AssetSelectSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ProfilePage = () => {
  const {
    params: { userId },
  } = useUrl();
  const [userData, setUserData] = React.useState<UserDetailSelectSchemaType | undefined | null>(null);
  const [userAvatarData, setUserAvatarData] = React.useState<AssetSelectSchemaType | undefined | null>(undefined);

  const { resetPostFilterState } = useAppStore(
    useShallow((state) => ({
      resetPostFilterState: state.resetPostFilterState,
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
    resetPostFilterState();
    if (userDetail) {
      setUserData(userDetail);
    }
    if (userAvatar) {
      setUserAvatarData(userAvatar);
    }
  }, [userDetail, userAvatar, resetPostFilterState]);

  return (
    <>
      <Helmet>
        <title>{userDetail ? `${userDetail.firstName ?? ''} ${userDetail.lastName}` : 'Trang cá nhân'} - Xóm Trọ</title>
        <meta name='description' content={'Website Chia sẻ Và Tìm kiếm thông tin nhà trọ'} />
      </Helmet>
      <div className='tw-flex tw-flex-col tw-items-center tw-bg-backgroundColor'>
        <div className='tw-container'>
          <header className='Profile-header'>
            <ProfileHeader />
          </header>
          <div className='tw-flex tw-flex-col laptop:tw-flex-row laptop:tw-items-start'>
            {/* Sidebar */}
            <div className='laptop:tw-w-[400px]'>
              <InfoTab userData={userData!} userAvatarData={userAvatarData!} />
              <UserContacts />
            </div>
            {/* Main content */}
            <div className='tw-flex-1 tw-mt-[24px] laptop:tw-m-[14px] laptop:tw-mr-0 laptop:tw-max-w-[calc(100%-412px)]'>
              <div className='tw-min-h-[100dvh]'>
                <Outlet context={{ userData, userAvatarData }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
