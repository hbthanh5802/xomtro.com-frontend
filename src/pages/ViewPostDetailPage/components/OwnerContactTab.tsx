import { useClipboard } from '@/hooks/useClipboard';
import useUserApiHook from '@/hooks/useUserApi.hook';
import analyticService, { GetPostsCountByTypeWithPostConditionsResponseType } from '@/services/analytic.service';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { PostSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Avatar, Button, Chip, Divider, Skeleton, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { BsPostcardFill } from 'react-icons/bs';
import { FaCircleCheck, FaClipboardUser } from 'react-icons/fa6';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';
import { SiZalo } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

interface OwnerContactTabProps {
  post: PostSelectSchemaType;
}
const OwnerContactTab = (props: OwnerContactTabProps) => {
  const { post } = props;
  const navigate = useNavigate();
  const { isCopied, copyToClipboard } = useClipboard();
  const [createConversationLoading, setCreateConversationLoading] = React.useState(false);
  const [userPostCount, setUserPostCount] = React.useState<GetPostsCountByTypeWithPostConditionsResponseType[] | null>(
    null,
  );

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const { data: getUserDetailResponse, isFetching: getUserDetailLoading } = useUserApiHook.useUserDetail(
    Number(post?.ownerId),
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );
  const { data: getUserAvatarResponse } = useUserApiHook.useUserAvatar(post?.ownerId ? Number(post?.ownerId) : 0, {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const { data: getUserContactResponse } = useUserApiHook.useUserContacts(post?.ownerId ? Number(post?.ownerId) : 0, {
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
  const userContacts = getUserContactResponse?.data;
  const userDetail = getUserDetailResponse?.data;
  const userAvatar = getUserAvatarResponse?.data;

  const handleCreateIndividualConversation = async () => {
    const toastId = toast.loading('Vui lòng chờ. Bạn sẽ được chuyển hướng ngay sau đó!');
    if (!currentUser) {
      toast.info('Vui lòng đăng nhập trước để nhắn tin.', { id: toastId });
      return;
    }
    setCreateConversationLoading(true);
    try {
      const response = await conversationService.createIndividualConversation({
        members: [currentUser.userId, Number(post.ownerId)],
      });
      const conversationId = response.data.id;
      navigate(`/conversations/${conversationId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Hãy thử lại liên hệ bằng những phương thức khác.', { id: toastId });
      console.log(handleAxiosError(error));
    } finally {
      toast.dismiss(toastId);
      setCreateConversationLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchUserPostCount = async () => {
      try {
        const response = await analyticService.getPostsCountByTypeWithPostConditions({
          ownerId: Number(post?.ownerId),
        });
        setUserPostCount(response.data);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    };
    if (post?.ownerId) {
      fetchUserPostCount();
    }
  }, [post]);

  // console.log(userContacts);
  const phoneContact = userContacts?.find((item) => item.contactType === 'phone');
  const zaloContact = userContacts?.find((item) => item.contactType === 'zalo');

  return (
    <section className='PostViewDetail__owner'>
      <div className='tw-flex tw-flex-col tw-flex-wrap tw-items-center tw-gap-4'>
        <Tooltip title='Xem trang cá nhân' placement='left' arrow>
          <div className='tw-cursor-pointer' onClick={() => navigate(`/users/${post?.ownerId}/profile`)}>
            <Avatar
              src={getUserDetailLoading ? '' : userAvatar?.url}
              size='lg'
              sx={{ width: 100, height: 100, boxShadow: 'md' }}
            >
              <Skeleton loading={getUserDetailLoading} />
            </Avatar>
          </div>
        </Tooltip>
        <Tooltip title='Xem trang cá nhân' placement='left' arrow>
          <div className='tw-cursor-pointer' onClick={() => navigate(`/users/${post?.ownerId}/profile`)}>
            <Typography level='title-lg'>
              {`${userDetail?.firstName ? userDetail?.firstName : ''} ${userDetail?.lastName}`}
            </Typography>
          </div>
        </Tooltip>
      </div>
      <div className='tw-mt-[12px] tw-space-y-2'>
        {userDetail?.role && (
          <div className='tw-flex tw-items-center tw-gap-2 tw-flex-wrap'>
            <Typography
              level='title-sm'
              startDecorator={<FaClipboardUser className='tw-text-slate-600 tw-mr-[2px] tw-text-[16px]' />}
            >
              Vai trò:
            </Typography>
            <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
              {userDetail?.role === 'landlord' ? 'Người cho thuê' : 'Người thuê'}
            </Typography>
          </div>
        )}
        <div className='tw-flex tw-items-center tw-gap-2 tw-flex-wrap'>
          <Typography
            color='primary'
            level='title-sm'
            startDecorator={<BsPostcardFill className='tw-text-slate-600 tw-mr-[2px] tw-text-[16px]' />}
          >
            {userPostCount?.reduce((acc, item) => acc + item.totalPosts, 0)}
          </Typography>
          <Typography level='body-sm' color='neutral' sx={{ borderRadius: 1 }}>
            Bài đăng
          </Typography>
        </div>
        {userDetail?.email && (
          <div className='tw-flex tw-items-center tw-gap-2 tw-flex-wrap'>
            <Typography
              level='title-sm'
              startDecorator={<MdEmail className='tw-text-slate-600 tw-mr-[4px] tw-text-[16px]' />}
            >
              Email:
            </Typography>
            <Tooltip title='Email đã được xác minh' arrow>
              <Typography
                level='body-sm'
                color='neutral'
                sx={{ borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {userDetail?.email}
                <span className='tw-text-primaryColor'>
                  <FaCircleCheck />
                </span>
              </Typography>
            </Tooltip>
          </div>
        )}
        <Divider orientation='horizontal' sx={{ '--Divider-childPosition': `${0}%` }}>
          <Chip color='primary' variant='plain'>
            Liên hệ ngay
          </Chip>
        </Divider>

        {!userContacts?.length ? (
          <>
            <Typography level='body-sm'>Chưa bổ sung thông tin liên hệ</Typography>
            <Chip onClick={() => navigate(`/users/${post?.ownerId}/profile`)}>Xem trang cá nhân</Chip>
          </>
        ) : (
          <div className='tw-mt-[12px] tw-space-y-2'>
            {zaloContact?.contactContent && (
              <a
                className='tw-block'
                href={`https://zalo.me/${zaloContact.contactContent}`}
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: 'none' }} // Loại bỏ gạch chân mặc định của thẻ a
              >
                <Button size='lg' fullWidth startDecorator={<SiZalo className='tw-text-[24px]' />}>
                  Liên hệ Zalo
                </Button>
              </a>
            )}

            {phoneContact?.contactContent && (
              <Button
                size='lg'
                color='success'
                fullWidth
                onClick={() => copyToClipboard(phoneContact.contactContent)}
                startDecorator={<MdLocalPhone className='tw-text-[24px]' />}
              >
                {isCopied ? phoneContact.contactContent : phoneContact.contactContent.slice(0, 7).concat('***')}
              </Button>
            )}

            {currentUser?.userId !== post.ownerId && (
              <Button
                disabled={createConversationLoading}
                loading={createConversationLoading}
                onClick={handleCreateIndividualConversation}
                color='neutral'
                variant='outlined'
                size='lg'
                fullWidth
                startDecorator={<IoChatboxEllipsesOutline className='tw-text-[20px]' />}
              >
                Nhắn tin
              </Button>
            )}

            <div className='tw-pt-4'>
              <Typography
                textAlign='center'
                level='title-sm'
                color='neutral'
                onClick={() => navigate(`/users/${post?.ownerId}/profile`)}
                sx={{ cursor: 'pointer' }}
              >
                Xem thêm
              </Typography>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OwnerContactTab;
