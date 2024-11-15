import { useAppStore } from '@/store/store';
import { Avatar, Badge } from '@mui/joy';
import React from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { useShallow } from 'zustand/react/shallow';

const ProfilePage: React.FC = () => {
  const { currentUser, userAvatar } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAvatar: state.userAvatar,
    })),
  );

  return (
    <div>
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
    </div>
  );
};

export default ProfilePage;
