import { useAppStore } from '@/store/store';
import { NotificationSelectSchemaType } from '@/types/schema.type';
import { Badge, IconButton, Tooltip } from '@mui/joy';
import React from 'react';
import { MdNotificationsNone } from 'react-icons/md';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const NotificationButton = () => {
  const { socketInstance } = useAppStore(
    useShallow((state) => ({
      socketInstance: state.socketInstance,
    })),
  );

  const handleReceivedNewMessage = React.useCallback((newNotification: NotificationSelectSchemaType) => {
    console.log(newNotification);
    toast('Bạn nhận được một tin nhắn mới!', {
      action: {
        label: 'Xem',
        onClick: () => {},
      },
      position: 'bottom-right',
    });
  }, []);

  React.useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on('new-message', handleReceivedNewMessage);
    return () => {
      socketInstance.off('new-message', handleReceivedNewMessage);
    };
  }, [socketInstance, handleReceivedNewMessage]);

  return (
    <Tooltip title='Thông báo'>
      <IconButton size='lg' sx={{ borderRadius: '99999px' }}>
        <Badge badgeContent={100} max={99} color='danger' badgeInset='0 -6px 0 0'>
          <MdNotificationsNone className='tw-text-[24px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationButton;
