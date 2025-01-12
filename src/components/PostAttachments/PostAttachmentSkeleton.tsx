import { Skeleton } from '@mui/joy';

const PostAttachmentSkeleton = () => {
  return (
    <div className='tw-flex tw-gap-2 tw-rounded-lg tw-overflow-hidden tw-py-[24px] tw-px-1'>
      <Skeleton animation='wave' variant='rectangular' width={100} height={100} />
      <div className='tw-flex-1 tw-space-y-2'>
        <Skeleton animation='wave' variant='rectangular' sx={{ width: '75%' }} height={24} />
        <Skeleton animation='wave' variant='rectangular' sx={{ width: '50%' }} height={18} />
        <Skeleton animation='wave' variant='rectangular' sx={{ flex: 1 }} height={18} />
      </div>
    </div>
  );
};

export default PostAttachmentSkeleton;
