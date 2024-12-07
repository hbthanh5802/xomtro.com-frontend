import useUserApiHook from '@/hooks/useUserApi.hook';
import AvatarWithStatus from '@/pages/ConversationPage/components/AvatarWithStatus';
import { default as MessageImage } from '@/pages/ConversationPage/components/MessageImage';
import conversationService from '@/services/conversation.service';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { formatTimeForVietnamese, timeInVietNam } from '@/utils/time.helper';
import { Chip, Skeleton, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  currentUserId: number;
  data: MessageSelectSchemaType;
  onRecallSuccess?: () => void;
}
const MessageBubble = (props: MessageBubbleProps) => {
  const { data, currentUserId, onRecallSuccess } = props;
  const isMe = data.senderId === currentUserId ? true : false;
  const [recallMessage, setRecallMessage] = React.useState(false);

  const { data: UserDetailResponse, isRefetching: fetchingUserDetail } = useUserApiHook.useUserDetail(
    Number(data.senderId),
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );
  const userDetail = UserDetailResponse?.data;

  const handleRecallMessage = async () => {
    const canRecall = new Date(data.allowRecallTime).getTime() >= timeInVietNam().toDate().getTime();
    const toastId = toast.loading('Đang thu hồi tin nhắn...');
    if (!canRecall) {
      toast.info('Bạn chỉ có thể thu tin nhắn trong vòng 5 phút từ lúc gửi đi', { id: toastId });
      return;
    }
    setRecallMessage(true);
    try {
      await conversationService.recallMessage(data.id);
      if (onRecallSuccess) onRecallSuccess();
      toast.success('Tin nhắn đã được thu hồi.', { id: toastId });
    } catch (error) {
      toast.error('Thu hồi không thành công! Hãy thử lại sau.', { id: toastId });
      console.log(handleAxiosError(error));
    } finally {
      setRecallMessage(false);
    }
  };

  return (
    <div className={`tw-flex tw-mb-3 ${isMe ? 'tw-justify-end' : 'tw-justify-start'}`}>
      <div className='tw-max-w-full laptop:tw-max-w-[60%] tw-w-auto'>
        <div className='tw-flex tw-items-start tw-gap-2'>
          {!isMe && <AvatarWithStatus userId={data.senderId} />}
          <Tooltip
            arrow
            placement={isMe ? 'left' : 'right'}
            title={formatTimeForVietnamese(data.sentAt, 'HH:mm:ss DD/MM/YYYY')}
          >
            <div className='tw-group tw-relative tw-space-y-1'>
              <div className={`tw-space-y-1 tw-flex tw-flex-col ${isMe ? 'tw-items-end' : 'tw-items-start'}`}>
                <div className={`tw-flex tw-pr-2 tw-justify-start`}>
                  <Typography color='neutral' level='body-xs'>
                    <Skeleton loading={fetchingUserDetail}>{!isMe ? userDetail?.lastName : 'Bạn'}</Skeleton>
                  </Typography>
                </div>
                {data.isRecalled ? (
                  <div
                    className={`tw-py-2 tw-w-fit tw-px-3 tw-text-[14px] tw-rounded-xl ${
                      isMe ? 'tw-rounded-tr-none' : 'tw-rounded-tl-none'
                    } !tw-bg-slate-300/50 !tw-text-slate-800 !tw-border`}
                  >
                    {data.isRecalled ? 'Tin nhắn đã bị thu hồi.' : data.content}
                  </div>
                ) : (
                  <>
                    {data.content && (
                      <div
                        className={`tw-py-2 tw-w-fit tw-px-3 tw-text-[14px] tw-rounded-xl ${
                          isMe
                            ? 'tw-rounded-tr-none tw-bg-primaryColor tw-text-white'
                            : 'tw-rounded-tl-none tw-bg-white tw-border'
                        }`}
                      >
                        {data.content}
                      </div>
                    )}
                    {!!data.assetId && <MessageImage assetId={data.assetId} />}
                  </>
                )}
                {}
              </div>
              {/* <Typography level='body-xs'>{formatTimeForVietnamese(data.sentAt, 'HH:mm:ss DD/MM/YYYY')}</Typography> */}
              {isMe && (
                <div className='tw-absolute tw-hidden group-hover:tw-block tw-top-0 -tw-right-0 tw-z-10'>
                  <Chip
                    disabled={recallMessage}
                    color='warning'
                    variant='solid'
                    size='sm'
                    onClick={handleRecallMessage}
                  >
                    Thu hồi
                  </Chip>
                </div>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
