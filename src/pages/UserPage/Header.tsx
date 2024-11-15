import ChangeAvatar from '@/components/ChangeAvatar';
import ModalLayout from '@/components/ModalLayout';
import { useAppStore } from '@/store/store';
import { Avatar, Badge, IconButton, Skeleton, Tooltip } from '@mui/joy';
import React, { useState } from 'react';
import { FaCameraRotate } from 'react-icons/fa6';
import { useShallow } from 'zustand/react/shallow';

const Header: React.FC = () => {
  const [editAvatar, setEditAvatar] = useState(false);

  const { currentUser, userAvatar } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAvatar: state.userAvatar,
    })),
  );

  const handleCloseChangeAvatarModel = (reason?: string) => {
    console.log(reason);
    setEditAvatar(false);
  };

  return (
    <div>
      {/* Modal */}
      <ModalLayout onCloseModal={handleCloseChangeAvatarModel} isOpen={editAvatar}>
        <ChangeAvatar onSuccess={() => setEditAvatar(false)} />
      </ModalLayout>
      <div className='tw-relative tw-h-[300px] tw-rounded-lg tw-rounded-t-none tw-bg-gradient-to-r tw-from-indigo-500 tw-to-blue-500'>
        <div className='tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-translate-x-1/3 tw-translate-y-[60%] tw-drop-shadow'>
          <Badge
            size='lg'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant='soft'
            badgeInset='14%'
            sx={{ '--Badge-paddingX': '0px', zIndex: 99 }}
            badgeContent={
              <Tooltip title='Thay đổi' arrow>
                <IconButton
                  size='sm'
                  variant='solid'
                  color='primary'
                  sx={{ borderRadius: '9999px' }}
                  onClick={() => setEditAvatar(true)}
                >
                  <FaCameraRotate className='tw-text-[18px]' />
                </IconButton>
              </Tooltip>
            }
          >
            <div className='tw-p-1 tw-bg-white tw-rounded-full'>
              <Avatar
                sx={{
                  width: '200px',
                  height: '200px',
                }}
                color='primary'
                alt={currentUser?.lastName}
                src={userAvatar?.url}
              >
                <Skeleton animation='wave' loading={!userAvatar?.url} />
              </Avatar>
            </div>
          </Badge>
        </div>
      </div>
      <div className=''>Info</div>
    </div>
  );
};

export default Header;
