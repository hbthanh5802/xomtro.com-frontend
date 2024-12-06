import { Badge, IconButton, Tooltip } from '@mui/joy';
import { TbMessage } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const MessageButton = () => {
  const navigate = useNavigate();
  return (
    <Tooltip title='Tin nhắn'>
      <IconButton onClick={() => navigate('/conversations/me')} size='lg' sx={{ borderRadius: '99999px' }}>
        <Badge badgeContent={100} max={99} color='danger' badgeInset='0 -6px 0 0'>
          <TbMessage className='tw-text-[24px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default MessageButton;
