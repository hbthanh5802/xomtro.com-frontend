import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import ProfileHeader from '@/pages/UserPage/ProfileHeader';
import userService from '@/services/user.service';
import { useAppStore } from '@/store/store';
import { UserDetailSelectSchemaType } from '@/types/schema.type';
import { Box, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Sheet } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { FaClipboardUser, FaLocationDot } from 'react-icons/fa6';
import { MdLibraryBooks, MdSettings } from 'react-icons/md';
import { Outlet, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ProfilePage = () => {
  const tabId = useId();
  const navigate = useNavigate();
  const {
    params: { userId },
    pathname,
  } = useUrl();
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const sideTabOptions: { label: ReactNode; prefixIcon: ReactNode; to: string; active: boolean }[] = useMemo(
    () => [
      {
        label: 'Thông tin cơ bản',
        prefixIcon: <FaClipboardUser />,
        to: `/users/${userId}/profile`,
        active: true,
      },
      {
        label: 'Địa chỉ',
        prefixIcon: <FaLocationDot />,
        to: `/users/${userId}/addresses`,
        active: Number(userId) === currentUser?.userId,
      },
      {
        label: 'Bài đăng',
        prefixIcon: <MdLibraryBooks />,
        to: `/users/${userId}/posts`,
        active: true,
      },
      {
        label: 'Bảo mật',
        prefixIcon: <MdSettings />,
        to: `/users/${userId}/settings`,
        active: Number(userId) === currentUser?.userId,
      },
    ],
    [userId],
  );

  return (
    <div className='tw-flex tw-flex-col tw-items-center'>
      <div className='tw-container'>
        <Box component='header'>
          <ProfileHeader />
        </Box>
        <Box
          sx={{
            bgcolor: 'background.body',
            minHeight: '100dvh',
            display: 'flex',
            marginTop: '80px',
            // justifyContent: 'center',
          }}
        >
          <Sheet variant='plain' sx={{ minWidth: '250px', p: 2, paddingRight: 0, bgcolor: 'background.body' }}>
            <List
              color='neutral'
              size='md'
              variant='outlined'
              sx={{
                '--List-radius': 'var(--joy-radius-sm)',
                '--List-gap': '8px',
                '--List-padding': '4px',
                '--ListItem-minHeight': '40px',
                '--ListItem-paddingY': '6px',
                '--ListItemDecorator-size': '40px',
              }}
            >
              {sideTabOptions.map((tabItem, index) => {
                return (
                  <ListItem
                    sx={{
                      '--ListItem-radius': '2px',
                      display: tabItem.active ? 'flex' : 'none',
                    }}
                    key={`sideTab-${tabId}-${index}`}
                  >
                    <ListItemButton
                      variant='plain'
                      selected={pathname === tabItem.to}
                      onClick={() => navigate(tabItem.to)}
                    >
                      {tabItem.prefixIcon && <ListItemDecorator>{tabItem.prefixIcon}</ListItemDecorator>}
                      <ListItemContent>{tabItem.label}</ListItemContent>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Sheet>
          <div className='tw-container tw-m-[16px]'>
            <div className='tw-min-h-[100dvh] tw-border-l tw-border-slate-3 tw-pl-[40px]'>
              <Outlet />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ProfilePage;
