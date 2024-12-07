import useUserApiHook from '@/hooks/useUserApi.hook';
import { useAppStore } from '@/store/store';
import { Avatar, AvatarProps, Badge, Skeleton } from '@mui/joy';
import { useShallow } from 'zustand/react/shallow';

interface AvatarWithStatusProps {
  userId?: number;
}
const AvatarWithStatus = (props: AvatarWithStatusProps & AvatarProps) => {
  const { userId, ...other } = props;
  const { onlineUsers } = useAppStore(
    useShallow((state) => ({
      onlineUsers: state.onlineUsers,
    })),
  );
  const isOnline = onlineUsers.find((onlineUser) => onlineUser === userId?.toString());

  const { data: UserAvatarResponse, isFetching: fetchingUserAvatar } = useUserApiHook.useUserAvatar(Number(userId), {
    staleTime: 3 * 60 * 1000,
  });
  const userAvatar = UserAvatarResponse?.data;
  return (
    <Badge
      color={isOnline ? 'success' : 'neutral'}
      variant='solid'
      size='md'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeInset='4px 4px'
    >
      <Avatar {...other} src={userAvatar?.url} alt='Avatar'>
        <Skeleton loading={fetchingUserAvatar} />
      </Avatar>
    </Badge>
  );
};

export default AvatarWithStatus;
