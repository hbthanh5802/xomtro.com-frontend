import useUserApiHook from '@/hooks/useUserApi.hook';
import AvatarWithStatus from '@/pages/ConversationPage/components/AvatarWithStatus';
import { useAppStore } from '@/store/store';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { Button, Skeleton, Typography } from '@mui/joy';
import { FaCircle } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface ConversationHeaderProps {
  selectedConversation: GetIndividualConversationResponseType | null;
}
const ConversationHeader = (props: ConversationHeaderProps) => {
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });

  const navigate = useNavigate();
  const { selectedConversation } = props;
  const { data: UserDetailResponse, isFetching: fetchingUserDetail } = useUserApiHook.useUserDetail(
    Number(selectedConversation?.userId),
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );
  const userDetail = UserDetailResponse?.data;
  const { onlineUsers } = useAppStore(
    useShallow((state) => ({
      onlineUsers: state.onlineUsers,
    })),
  );
  const isOnline = onlineUsers.find((onlineUser) => onlineUser === selectedConversation?.userId?.toString());

  return (
    <section className='tw-p-[24px] tw-bg-white tw-border-b tw-flex tw-flex-col laptop:tw-flex-row laptop:tw-items-center tw-justify-between tw-gap-2'>
      <div className='tw-flex tw-gap-[18px] tw-items-start'>
        <AvatarWithStatus size={isMobile ? 'md' : 'lg'} userId={selectedConversation?.userId} />
        <div>
          <div className='tw-flex tw-flex-wrap tw-items-start laptop:tw-items-center tw-gap-1 laptop:tw-gap-3'>
            <Typography sx={{ pr: 0.5 }} level={isMobile ? 'title-md' : 'title-lg'}>
              <Skeleton loading={fetchingUserDetail}>
                {`${userDetail?.firstName ?? ''} ${userDetail?.lastName}`}
              </Skeleton>
            </Typography>
            <Typography
              startDecorator={
                <FaCircle className={`tw-text-[8px] ${isOnline ? 'tw-text-green-700' : 'tw-text-gray-500'}`} />
              }
              variant='outlined'
              level='body-xs'
              sx={{ borderRadius: 'sm', px: '4px' }}
            >
              <Skeleton loading={fetchingUserDetail}>{isOnline ? 'Đang hoạt động' : 'Không trực tuyến'}</Skeleton>
            </Typography>
          </div>
          <Typography level={isMobile ? 'body-xs' : 'body-sm'}>@{userDetail?.email}</Typography>
        </div>
      </div>

      <Button
        startDecorator={<FiUser className='tw-text-[16px]' />}
        variant='outlined'
        color='neutral'
        onClick={() => navigate(`/users/${selectedConversation?.userId}/profile`)}
        size={isMobile ? 'sm' : 'md'}
      >
        Xem trang cá nhân
      </Button>
    </section>
  );
};

export default ConversationHeader;
