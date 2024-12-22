import Notifications from '@/components/Notifications';
import { queryClient } from '@/configs/tanstackQuery.config';
import useClickOutside from '@/hooks/useClickOutside';
import notificationService from '@/services/notification.service';
import { useAppStore } from '@/store/store';
import { NotificationSelectSchemaType } from '@/types/schema.type';
import { getRedirectNotification } from '@/utils/constants.helper';
import { Badge, IconButton, Tooltip } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { MdNotificationsNone } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const NotificationButton = () => {
  const navigate = useNavigate();
  const notificationRef = React.useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });

  const { currentUser, socketInstance, setOpenNotificationPopover, openNotificationPopover } = useAppStore(
    useShallow((state) => ({
      socketInstance: state.socketInstance,
      currentUser: state.currentUser,
      openNotificationPopover: state.openNotificationPopover,
      setOpenNotificationPopover: state.setOpenNotificationPopover,
    })),
  );

  useClickOutside(notificationRef, () => {
    setOpenNotificationPopover(false);
  });

  const handleReceivedNewNotification = React.useCallback(
    (newNotification: NotificationSelectSchemaType) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast(newNotification.title, {
        action: {
          label: 'Xem',
          onClick: () => {
            const path = getRedirectNotification(newNotification);
            if (path) navigate(path);
          },
        },
        position: isMobile ? 'top-center' : 'bottom-right',
      });
    },
    [navigate, isMobile],
  );

  const { data: getUnreadNotificationResponse } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () =>
      notificationService.getUserNotifications({
        whereConditions: { isRead: false },
        orderConditions: {},
        pagination: { pageSize: 999999 },
      }),
    enabled: !!currentUser,
  });

  React.useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on('new-notification', handleReceivedNewNotification);
    return () => {
      socketInstance.off('new-notification', handleReceivedNewNotification);
    };
  }, [socketInstance, handleReceivedNewNotification]);

  return (
    <Tooltip
      open={openNotificationPopover}
      variant='outlined'
      placement='bottom-end'
      title={
        <div ref={notificationRef}>
          <Notifications />
        </div>
      }
    >
      <IconButton size='lg' sx={{ borderRadius: '99999px' }} onClick={() => setOpenNotificationPopover(true)}>
        <Badge
          badgeContent={getUnreadNotificationResponse?.data.results.length ?? 0}
          max={99}
          color='danger'
          badgeInset='0 -6px 0 0'
        >
          <MdNotificationsNone className='tw-text-[24px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationButton;
