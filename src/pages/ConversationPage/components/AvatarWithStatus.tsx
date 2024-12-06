import useUserApiHook from '@/hooks/useUserApi.hook';
import { Avatar, AvatarProps, Badge, Skeleton } from '@mui/joy';

interface AvatarWithStatusProps {
  userId?: number;
  isOnline?: boolean;
}
const AvatarWithStatus = (props: AvatarWithStatusProps & AvatarProps) => {
  const { userId, isOnline, ...other } = props;
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
