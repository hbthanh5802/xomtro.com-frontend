import { queryClient } from '@/configs/tanstackQuery.config';
import notificationService from '@/services/notification.service';
import { useAppStore } from '@/store/store';
import { NotificationSelectSchemaType } from '@/types/schema.type';
import { getRedirectNotification } from '@/utils/constants.helper';
import { getTimeAgo } from '@/utils/time.helper';
import { Avatar, Typography } from '@mui/joy';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { FaCircle, FaClipboardUser } from 'react-icons/fa6';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { MdNotificationsActive } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface NotificationItemProps {
  data: NotificationSelectSchemaType;
}

const getNotificationIcons = {
  post: {
    icon: <BsPostcardHeartFill />,
    color: 'primary' as const,
  },
  account: {
    icon: <FaClipboardUser />,
    color: 'warning' as const,
  },
  chat: {
    icon: <HiChatBubbleLeftRight />,
    color: 'success' as const,
  },
  general: {
    icon: <MdNotificationsActive />,
    color: 'neutral' as const,
  },
};

const NotificationItem = (props: NotificationItemProps) => {
  const { data } = props;
  const navigate = useNavigate();

  const { setOpenNotificationPopover } = useAppStore(
    useShallow((state) => ({
      setOpenNotificationPopover: state.setOpenNotificationPopover,
    })),
  );

  const handleNotificationClick = (data: NotificationSelectSchemaType) => {
    notificationService.setReadNotifications([data.id]).then(() => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
    const path = getRedirectNotification(data);
    if (path) {
      navigate(path);
      setOpenNotificationPopover(false);
    }
  };

  return (
    <div
      className={`tw-duration-200 tw-flex tw-items-start tw-gap-2 tw-min-w-[400px] tw-p-[4px] tw-rounded tw-cursor-pointer tw-shadow-sm ${
        data.isRead ? 'hover:tw-bg-slate-100' : 'tw-bg-primaryColor/5 hover:tw-bg-primaryColor/10'
      }`}
      onClick={() => handleNotificationClick(data)}
    >
      <Avatar size='md' variant='soft' color={getNotificationIcons[data.type].color ?? 'neutral'}>
        {getNotificationIcons[data.type].icon}
      </Avatar>

      <div className='tw-flex-1 tw-overflow-y-auto'>
        <Typography level='title-sm'>{data.title}</Typography>
        <Typography level='body-sm'>{data.content}</Typography>
        <Typography
          startDecorator={!data.isRead ? <FaCircle className='tw-text-[6px] tw-text-primaryColor ' /> : null}
          sx={{ textAlign: 'right', justifySelf: 'end' }}
          level='body-xs'
        >
          {getTimeAgo(data.createdAt!)}
        </Typography>
      </div>
    </div>
  );
};

export default NotificationItem;
