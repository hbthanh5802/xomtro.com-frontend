import { Avatar, Skeleton } from '@mui/joy';

const NotificationItemSkeleton = () => {
  return (
    <div className='tw-duration-200 tw-flex tw-items-start tw-min-w-[400px] tw-gap-2 tw-p-[4px] tw-rounded hover:tw-bg-primaryColor/5 tw-cursor-pointer'>
      <Avatar size='md'>
        <Skeleton loading={true} />
      </Avatar>

      <div className='tw-flex tw-flex-col tw-gap-1 tw-flex-1'>
        <Skeleton variant='rectangular' animation='wave' sx={{ width: '50%' }} height={16} />
        <Skeleton variant='rectangular' animation='wave' sx={{ width: '100%' }} height={14} />
      </div>
    </div>
  );
};

export default NotificationItemSkeleton;
