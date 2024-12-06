import useUserApiHook from '@/hooks/useUserApi.hook';
import AvatarWithStatus from '@/pages/ConversationPage/components/AvatarWithStatus';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { Skeleton, Typography } from '@mui/joy';

interface ConversationItemProps {
  data: GetIndividualConversationResponseType;
  selectedConversation: GetIndividualConversationResponseType | null;
}
const ConversationItem = (props: ConversationItemProps) => {
  const { selectedConversation } = props;
  const { userId, lastReadAt, chatId } = props.data;

  const { data: UserDetailResponse, isRefetching: fetchingUserDetail } = useUserApiHook.useUserDetail(Number(userId), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;

  return (
    <div
      className={`tw-px-[18px] tw-py-[18px] tw-flex tw-items-start tw-gap-2 hover:tw-bg-backgroundColor ${
        selectedConversation?.chatId === chatId ? 'tw-bg-backgroundColor' : ''
      } tw-rounded tw-cursor-pointer`}
    >
      <AvatarWithStatus size='md' userId={userId} isOnline={true} />
      <div className='tw-overflow-hidden tw-hidden tablet:tw-block'>
        <Typography level='title-md'>
          <Skeleton loading={fetchingUserDetail}>{`${userDetail?.firstName ?? ''} ${userDetail?.lastName}`}</Skeleton>
        </Typography>
        <Typography level='body-sm' noWrap>
          <Skeleton loading={fetchingUserDetail}>
            {`Truy cập lần cuối: ${
              lastReadAt ? formatTimeForVietnamese(lastReadAt!, 'HH:mm:ss DD/MM/YYYY') : 'Chưa xem'
            }`}
          </Skeleton>
        </Typography>
      </div>
    </div>
  );
};

export default ConversationItem;
