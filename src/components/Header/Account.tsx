import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { Avatar, Badge, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import React from 'react';
import { FaAngleDown, FaClipboardUser } from 'react-icons/fa6';
import { IoMdHeart, IoMdSettings } from 'react-icons/io';
import { MdNotifications, MdOutlineHelp, MdOutlineLogout } from 'react-icons/md';
import { TbMessageFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const Account = () => {
  const { pathname } = useUrl();
  const accountItemId = React.useId();
  const navigate = useNavigate();
  const { currentUser, userAvatar, logoutUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAvatar: state.userAvatar,
      logoutUser: state.logoutUser,
    })),
  );

  const accountItems = React.useMemo(
    () => [
      {
        label: 'Thông tin tài khoản',
        icon: <FaClipboardUser className='tw-flex tw-text-lg' />,
        path: `/users/${currentUser?.userId}/profile`,
        disabled: false,
      },
      {
        label: 'Bài viết đã lưu',
        icon: <IoMdHeart className='tw-flex tw-text-lg' />,
        path: `/users/${currentUser?.userId}/interested`,
        disabled: false,
      },
      {
        label: 'Cài đặt bảo mật',
        icon: <IoMdSettings className='tw-flex tw-text-lg' />,
        path: `/users/${currentUser?.userId}/settings`,
        disabled: false,
      },
      {
        label: 'Trợ giúp',
        icon: <MdOutlineHelp className='tw-flex tw-text-lg' />,
        path: `/users/${currentUser?.userId}/settings`,
        disabled: false,
      },
    ],
    [currentUser],
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
        {accountItems.map((accountItem, index) => {
          return (
            <MenuItem
              disabled={accountItem.disabled}
              variant={pathname === accountItem.path ? 'soft' : 'plain'}
              key={`account-item-${accountItemId}-${index}`}
              onClick={() => navigate(accountItem.path)}
            >
              <div className='tw-flex tw-items-center tw-gap-2'>
                {accountItem.icon}
                {accountItem.label}
              </div>
            </MenuItem>
          );
        })}
        <MenuItem
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
          })}
          variant='plain'
          onClick={() => navigate('/notifications')}
        >
          <div className='tw-flex tw-items-center tw-gap-2'>
            <MdNotifications className='tw-flex tw-text-xl' />
            Thông báo
          </div>
        </MenuItem>
        <MenuItem
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
          })}
          variant='plain'
          onClick={() => navigate('/conversations/me')}
        >
          <div className='tw-flex tw-items-center tw-gap-2'>
            <TbMessageFilled className='tw-flex tw-text-lg' />
            Tin nhắn
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
