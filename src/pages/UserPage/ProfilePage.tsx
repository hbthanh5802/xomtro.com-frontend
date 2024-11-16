import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { updateUserDetailValidation } from '@/validations/user.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton, Typography } from '@mui/joy';
import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { z } from 'zod';

type UpdateUserDataType = z.infer<typeof updateUserDetailValidation>;
const emptyContent = 'Chưa có thông tin';

const ProfilePage: React.FC = () => {
  const {
    params: { userId },
  } = useUrl();

  const { data: UserDetailResponse, isFetching } = useUserApiHook.useUserDetail(Number(userId), {
    staleTime: 1 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;

  return (
    <div className='tw-space-y-4'>
      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Họ và Tên:
          </Skeleton>
        </Typography>
        <Typography variant='soft' color={userDetail?.lastName ? 'primary' : 'neutral'} sx={{ borderRadius: 1 }}>
          <Skeleton animation='wave' loading={isFetching}>
            {`${userDetail?.firstName || ''} ${userDetail?.lastName || ''}`}
          </Skeleton>
        </Typography>
      </div>

      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Vai trò:
          </Skeleton>
        </Typography>
        <Typography variant='soft' color={userDetail?.role ? 'primary' : 'neutral'} sx={{ borderRadius: 1 }}>
          <Skeleton animation='wave' loading={isFetching}>
            {`${userDetail?.role ? (userDetail?.role === 'landlord' ? 'Người cho thuê' : 'Người thuê') : emptyContent}`}
          </Skeleton>
        </Typography>
      </div>

      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Ngày sinh:
          </Skeleton>
        </Typography>
        <Typography variant='soft' color={userDetail?.gender ? 'primary' : 'neutral'} sx={{ borderRadius: 1 }}>
          <Skeleton animation='wave' loading={isFetching}>
            {userDetail?.dob ? formatTimeForVietnamese(userDetail?.dob, 'DD/MM/YYYY') : emptyContent}
          </Skeleton>
        </Typography>
      </div>

      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Giới tính:
          </Skeleton>
        </Typography>
        <Typography variant='soft' color={userDetail?.gender ? 'primary' : 'neutral'} sx={{ borderRadius: 1 }}>
          <Skeleton animation='wave' loading={isFetching}>
            {userDetail?.gender || emptyContent}
          </Skeleton>
        </Typography>
      </div>

      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Email:
          </Skeleton>
        </Typography>
        <Typography
          variant='soft'
          color={userDetail?.email ? 'primary' : 'neutral'}
          sx={{ borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Skeleton animation='wave' loading={isFetching}>
            {userDetail?.email || emptyContent}
            <span>
              <FaCircleCheck />
            </span>
          </Skeleton>
        </Typography>
      </div>

      <div className='tw-flex tw-items-center tw-gap-3'>
        <Typography>
          <Skeleton animation='wave' loading={isFetching}>
            Số điện thoại:
          </Skeleton>
        </Typography>
        <Typography variant='soft' color={userDetail?.phone ? 'primary' : 'neutral'} sx={{ borderRadius: 1 }}>
          <Skeleton animation='wave' loading={isFetching}>
            {userDetail?.phone || emptyContent}
          </Skeleton>
        </Typography>
      </div>
    </div>
  );
};

export default ProfilePage;
