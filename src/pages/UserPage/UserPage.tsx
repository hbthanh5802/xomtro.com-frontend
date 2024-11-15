import useUrl from '@/hooks/useUrl.hook';
import Header from '@/pages/UserPage/Header';
import userService from '@/services/user.service';
import { UserDetailSelectSchemaType } from '@/types/schema.type';
import { Box, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Sheet } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { FaClipboardUser, FaLocationDot } from 'react-icons/fa6';
import { MdLibraryBooks, MdSettings } from 'react-icons/md';
import { Outlet, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const tabId = useId();
  const navigate = useNavigate();
  const {
    params: { userId },
    pathname,
  } = useUrl();
  const [userData, setUserData] = useState<UserDetailSelectSchemaType | null>(null);

  const sideTabOptions: { label: ReactNode; prefixIcon: ReactNode; to: string }[] = useMemo(
    () => [
      {
        label: 'Thông tin cơ bản',
        prefixIcon: <FaClipboardUser />,
        to: `/users/${userId}/profile`,
      },
      {
        label: 'Địa chỉ',
        prefixIcon: <FaLocationDot />,
        to: `/users/${userId}/addresses`,
      },
      {
        label: 'Bài đăng',
        prefixIcon: <MdLibraryBooks />,
        to: `/users/${userId}/posts`,
      },
      {
        label: 'Bảo mật',
        prefixIcon: <MdSettings />,
        to: `/users/${userId}/settings`,
      },
    ],
    [],
  );

  const {} = useQuery({
    queryKey: ['users', { userId }],
    queryFn: async () => {
      const response = await userService.getUserDetailByUserId(Number(userId));
      if (response.data) return response.data;
      return response;
    },
    enabled: !!userId,
  });

  useEffect(() => {});

  return (
    <div className='tw-flex tw-flex-col tw-items-center'>
      <div className='tw-container'>
        <Box component='header'>
          <Header />
        </Box>
        {/* <Box
          sx={{
            bgcolor: 'background.body',
            minHeight: '100dvh',
            display: 'flex',
            // justifyContent: 'center',
          }}
        >
          <Sheet variant='plain' sx={{ minWidth: '250px', p: 2, paddingRight: 0, bgcolor: 'background.body' }}>
            <List
              size='md'
              variant='plain'
              sx={{
                '--List-radius': 'var(--joy-radius-sm)',
                '--List-gap': '2px',
                '--List-padding': '4px',
                '--ListItem-minHeight': '40px',
                '--ListItem-paddingY': '6px',
                '--ListItemDecorator-size': '40px',
              }}
            >
              {sideTabOptions.map((tabItem, index) => {
                return (
                  <ListItem
                    color='primary'
                    sx={{
                      '--ListItem-radius': '1px',
                    }}
                    key={`sideTab-${tabId}-${index}`}
                  >
                    <ListItemButton selected={pathname === tabItem.to} onClick={() => navigate(tabItem.to)}>
                      {tabItem.prefixIcon && <ListItemDecorator>{tabItem.prefixIcon}</ListItemDecorator>}
                      <ListItemContent>{tabItem.label}</ListItemContent>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Sheet>
          <div className='tw-container tw-p-[16px] tw-pl-0'>
            <div className='tw-min-h-[100dvh] tw-border-l tw-border-slate-3 tw-pl-3'>
              <Outlet />
            </div>
          </div>
        </Box> */}
      </div>
    </div>
  );
};

export default ProfilePage;
