import ChangeAvatar from '@/components/ChangeAvatar';
import EditProfile from '@/components/EditProfile';
import ModalLayout from '@/components/ModalLayout';
import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { Avatar, Badge, Button, Divider, IconButton, Skeleton, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
// Icons
import { AssetSelectSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { FaRegEdit } from 'react-icons/fa';
import { FaCameraRotate, FaCircleCheck, FaClipboardUser } from 'react-icons/fa6';
import { IoCalendarSharp } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';

// const emptyContent = 'Chưa có thông tin';

interface InfoTabProps {
  userData: UserDetailSelectSchemaType;
  userAvatarData: AssetSelectSchemaType;
}

const InfoTab = (props: InfoTabProps) => {
  const { userData, userAvatarData } = props;
  const isLoading = !userData;
  const {
    params: { userId },
  } = useUrl();
  const [editAvatar, setEditAvatar] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const handleCloseChangeAvatarModal = (reason?: string) => {
    console.log(reason);
    setEditAvatar(false);
  };

  const handleCloseEditProfileModal = (reason?: string) => {
    console.log(reason);
    setEditProfile(false);
  };

  return (
    <div className='tw-w-full'>
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
          <EditProfile userData={userData} onSuccess={() => setEditProfile(false)} />
        </div>
      </ModalLayout>

      <div className='tw-relative tw-h-[180px]'>
        {/* Avatar */}
        <div className='tw-absolute -tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 tw-z-10 tw-drop-shadow'>
          {Number(userId) === currentUser?.userId ? (
            <Badge
              size='lg'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                  alt={userData?.lastName}
                  src={userAvatarData?.url}
                >
                  <Skeleton animation='wave' loading={!userAvatarData} />
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
                alt={userData?.lastName}
                src={userAvatarData?.url}
              >
                <Skeleton animation='wave' loading={!userAvatarData} />
              </Avatar>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className='tw-space-y-4'>
          <Skeleton animation='wave' variant='rectangular' height='24px' />
          <Skeleton animation='wave' variant='rectangular' height='300px' />
          <Skeleton animation='wave' variant='rectangular' height='32px' />
        </div>
      ) : (
        <div className='tw-space-y-4'>
          <div className='tw-flex tw-items-center tw-justify-center'>
            <Typography level='body-sm'>{userData?.bio || 'Chưa có tiểu sử'}</Typography>
          </div>
          <Divider orientation='horizontal' />
          <Typography level='title-lg'>Giới thiệu</Typography>
          <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
            <Typography
              level='title-sm'
              startDecorator={<FaClipboardUser className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
            >
              Họ và Tên:
            </Typography>
            <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
              {`${userData?.firstName || ''} ${userData?.lastName || ''}`}
            </Typography>
          </div>

          {userData?.role && (
            <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
              <Typography
                level='title-sm'
                startDecorator={<FaClipboardUser className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
              >
                Vai trò:
              </Typography>
              <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
                {userData?.role === 'landlord' ? 'Người cho thuê' : 'Người thuê'}
              </Typography>
            </div>
          )}

          {userData?.gender && (
            <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
              <Typography
                level='title-sm'
                startDecorator={<FaClipboardUser className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
              >
                Giới tính:
              </Typography>
              <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
                {userData?.gender === 'male' ? 'Nam' : userData?.gender === 'female' ? 'Nữ' : 'Khác'}
              </Typography>
            </div>
          )}

          {userData?.dob && (
            <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
              <Typography
                level='title-sm'
                startDecorator={<IoCalendarSharp className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
              >
                Ngày sinh:
              </Typography>
              <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
                {formatTimeForVietnamese(userData?.dob, 'DD/MM/YYYY')}
              </Typography>
            </div>
          )}

          {userData?.email && (
            <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
              <Typography
                level='title-sm'
                startDecorator={<MdEmail className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
              >
                Email:
              </Typography>
              <Typography
                level='body-sm'
                color='neutral'
                sx={{ borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {userData?.email}
                <Tooltip title='Email đã được xác minh' arrow>
                  <span className='tw-text-primaryColor'>
                    <FaCircleCheck />
                  </span>
                </Tooltip>
              </Typography>
            </div>
          )}

          {userData?.phone && (
            <div className='tw-flex tw-items-center tw-gap-3 tw-flex-wrap'>
              <Typography
                level='title-sm'
                startDecorator={<MdLocalPhone className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
              >
                Số điện thoại:
              </Typography>
              <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
                <a href={`tel:${userData.phone}`} className='tw-text-primaryColor hover:tw-underline tw-cursor-pointer'>
                  {userData.phone}
                </a>
                {/* <a
                  href='https://zalo.me/0869836386'
                  target='_blank'
                  className='tw-text-blue-500 hover:tw-underline tw-cursor-pointer'
                >
                  Nhắn Zalo
                </a> */}
              </Typography>
            </div>
          )}

          {Number(userId) === currentUser?.userId && (
            <div className='tw-pt-[12px]'>
              <Button fullWidth startDecorator={<FaRegEdit />} variant='soft' onClick={() => setEditProfile(true)}>
                Chỉnh sửa thông tin cá nhân
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(InfoTab);