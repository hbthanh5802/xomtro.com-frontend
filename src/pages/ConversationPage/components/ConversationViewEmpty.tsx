import EmptyMessage from '@/assets/EmptyMessage';
import { Typography } from '@mui/joy';

const ConversationViewEmpty = () => {
  return (
    <div className='tw-p-[24px] tw-text-center tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4'>
      <EmptyMessage />
      <Typography level='title-sm'>Hai người chưa từng có cuộc trò chuyện nào trước đó.</Typography>
      <Typography level='body-sm'>Hãy gửi tin nhắn đầu tiên tới đối phương.</Typography>
    </div>
  );
};

export default ConversationViewEmpty;
