import { useAppStore } from '@/store/store';
import { Avatar, Badge, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import { FaAngleDown, FaClipboardUser } from 'react-icons/fa6';
import { MdOutlineHelp, MdOutlineLogout, MdSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, userAvatar, logoutUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAvatar: state.userAvatar,
      logoutUser: state.logoutUser,
    })),
  );

  return (
    <Dropdown>
      <MenuButton variant='plain' size='sm' sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}>
        <Badge
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant='soft'
          badgeInset='14%'
          sx={{ '--Badge-paddingX': '0px' }}
          badgeContent={
            <>
              <FaAngleDown />
            </>
          }
        >
          <Avatar size='md' color='primary' alt={currentUser?.lastName} src={userAvatar?.url} />
        </Badge>
      </MenuButton>
      <Menu
        placement='bottom-end'
        size='sm'
        sx={{
          zIndex: '99999',
          p: 1,
          gap: 1,
          '--ListItem-radius': 'var(--joy-radius-sm)',
        }}
      >
        <MenuItem onClick={() => navigate(`/users/${currentUser?.userId}/profile`)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={userAvatar?.url} sx={{ borderRadius: '50%' }} />
            <Box sx={{ ml: 1.5 }}>
              <Typography level='title-sm' textColor='text.primary'>
                {`${currentUser?.firstName} ${currentUser?.lastName}`}
              </Typography>
              <Typography level='body-xs' textColor='text.tertiary' noWrap sx={{ maxWidth: '180px' }}>
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <ListDivider />
        <MenuItem onClick={() => navigate(`/users/${currentUser?.userId}/profile`)}>
          <div className='tw-flex tw-items-center tw-gap-2'>
            <FaClipboardUser className='tw-flex tw-text-lg tw-text-slate-600' />
            Thông tin tài khoản
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate('/help')}>
          <div className='tw-flex tw-items-center tw-gap-2'>
            <MdOutlineHelp className='tw-flex tw-text-lg tw-text-slate-600' />
            Trợ giúp
          </div>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/users/${currentUser?.userId}/settings`)}>
          <div className='tw-flex tw-items-center tw-gap-2'>
            <MdSettings className='tw-flex tw-text-lg tw-text-slate-600' />
            Cài đặt
          </div>
        </MenuItem>
        <ListDivider />
        <MenuItem onClick={() => logoutUser()} color='danger'>
          <div className='tw-flex tw-items-center tw-gap-2'>
            <MdOutlineLogout className='tw-flex tw-text-lg tw-text-red-500' />
            Đăng xuất
          </div>
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default Account;
