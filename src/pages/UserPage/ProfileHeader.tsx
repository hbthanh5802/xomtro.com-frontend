import ChangeAvatar from '@/components/ChangeAvatar';
import EditProfile from '@/components/EditProfile';
import ModalLayout from '@/components/ModalLayout';
import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import { useAppStore } from '@/store/store';
import { Avatar, Badge, Button, IconButton, Skeleton, Tooltip, Typography } from '@mui/joy';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaCameraRotate } from 'react-icons/fa6';
import { useShallow } from 'zustand/react/shallow';

const ProfileHeader: React.FC = () => {
  const {
    params: { userId },
  } = useUrl();
  const [editAvatar, setEditAvatar] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const handleCloseChangeAvatarModal = (reason?: string) => {
    console.log(reason);
    setEditAvatar(false);
  };

  const handleCloseEditProfileModal = (reason?: string) => {
    console.log(reason);
    setEditProfile(false);
  };

  const { currentUser, currentUserAvatar } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      currentUserAvatar: state.userAvatar,
    })),
  );

  const { data: UserDetailResponse } = useUserApiHook.useUserDetail(Number(userId), { staleTime: 1 * 60 * 1000 });
  const { data: UserAvatarResponse, isFetched } = useUserApiHook.useUserAvatar(Number(userId), {
    staleTime: 3 * 60 * 1000,
  });
  const userAvatar = UserAvatarResponse?.data;
  const userDetail = UserDetailResponse?.data;

  return (
    <div>
      {/* Change Avatar Modal */}
      <ModalLayout
        onCloseModal={handleCloseChangeAvatarModal}
        isOpen={editAvatar}
        title='Thay đổi ảnh đại diện'
        content='Hãy chọn ảnh bạn muốn thay đổi, và sau đó tiến hành lưu lại để xác nhận thay đổi.'
      >
        <div className='tw-w-fit tw-flex tw-justify-center tw-mx-auto'>
          <ChangeAvatar onSuccess={() => setEditAvatar(false)} />
        </div>
      </ModalLayout>

      {/* Edit Profile Modal */}
      <ModalLayout onCloseModal={handleCloseEditProfileModal} isOpen={editProfile} title='Chỉnh sửa thông tin cá nhân'>
        <div className='tw-w-fit tw-flex tw-justify-center tw-mx-auto'>
          <EditProfile onSuccess={() => setEditProfile(false)} />
        </div>
      </ModalLayout>

      <div className='tw-relative tw-h-[300px] tw-rounded-lg tw-rounded-t-none tw-bg-gradient-to-r tw-from-indigo-500 tw-to-blue-500'></div>
      <div className='tw-min-h-[100px] tw-flex'>
        <div className='tw-relative tw-w-[300px]'>
          <div className='tw-absolute -tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 tw-z-10 tw-drop-shadow'>
            {Number(userId) === currentUser?.userId ? (
              <Badge
                size='lg'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant='soft'
                badgeInset='14%'
                sx={{ '--Badge-paddingX': '0px', zIndex: 99 }}
                badgeContent={
                  <Tooltip title='Thay đổi' arrow>
                    <IconButton
                      size='sm'
                      variant='solid'
                      color='primary'
                      sx={{ borderRadius: '9999px' }}
                      onClick={() => setEditAvatar(true)}
                    >
                      <FaCameraRotate className='tw-text-[18px]' />
                    </IconButton>
                  </Tooltip>
                }
              >
                <div className='tw-p-1 tw-bg-white tw-rounded-full tw-shadow-md tw-shadow-blue-600'>
                  <Avatar
                    sx={{
                      width: '200px',
                      height: '200px',
                      boxShadow: 'md',
                    }}
                    color='primary'
                    alt={userDetail?.lastName}
                    src={Number(userId) === currentUser?.userId ? currentUserAvatar?.url : userAvatar?.url}
                  >
                    <Skeleton animation='wave' loading={!isFetched} />
                  </Avatar>
                </div>
              </Badge>
            ) : (
              <div className='tw-p-1 tw-bg-white tw-rounded-full tw-shadow-md tw-shadow-blue-600'>
                <Avatar
                  sx={{
                    width: '200px',
                    height: '200px',
                  }}
                  color='primary'
                  alt={userDetail?.lastName}
                  src={Number(userId) === currentUser?.userId ? currentUserAvatar?.url : userAvatar?.url}
                >
                  <Skeleton animation='wave' loading={!isFetched} />
                </Avatar>
              </div>
            )}
          </div>
        </div>
        <div className='tw-mt-[24px] tw-flex-1'>
          <div className='tw-flex tw-justify-between tw-items-center'>
            <Typography level='h1'>
              <Skeleton animation='wave' loading={!currentUser}>
                {`${currentUser?.firstName} ${currentUser?.lastName}`}
              </Skeleton>
            </Typography>
            {/* Edit button */}
            {Number(userId) === currentUser?.userId && (
              <Button startDecorator={<FaRegEdit />} variant='soft' onClick={() => setEditProfile(true)}>
                Chỉnh sửa thông tin cá nhân
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
