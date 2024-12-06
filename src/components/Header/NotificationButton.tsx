import { Badge, IconButton, Tooltip } from '@mui/joy';
import { MdNotificationsNone } from 'react-icons/md';

const NotificationButton = () => {
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
