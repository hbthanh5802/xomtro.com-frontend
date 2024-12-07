import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { Badge, IconButton, Tooltip } from '@mui/joy';
import React from 'react';
import { TbMessage } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const MessageButton = () => {
  const navigate = useNavigate();
  const { pathname } = useUrl();
  const { socketInstance } = useAppStore(
    useShallow((state) => ({
      socketInstance: state.socketInstance,
    })),
  );

  const handleReceivedNewMessage = React.useCallback(
    (newMessage: MessageSelectSchemaType) => {
      toast('Bạn nhận được một tin nhắn mới!', {
        action: {
          label: 'Xem',
          onClick: () => navigate(`/conversations/${newMessage.chatId}`),
        },
        position: pathname.startsWith('/conversations') ? 'top-center' : 'bottom-right',
      });
    },
    [navigate, pathname],
  );

  React.useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on('new-message', handleReceivedNewMessage);
    return () => {
      socketInstance.off('new-message', handleReceivedNewMessage);
    };
  }, [socketInstance, handleReceivedNewMessage]);

  return (
    <Tooltip title='Tin nhắn'>
      <IconButton onClick={() => navigate('/conversations/me')} size='lg' sx={{ borderRadius: '99999px' }}>
        <Badge color='danger' badgeInset='0 -1px 0 0'>
          <TbMessage className='tw-text-[24px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default MessageButton;
