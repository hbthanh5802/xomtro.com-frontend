import { Skeleton, Typography } from '@mui/joy';

const ConversationViewSkeleton = () => {
  return (
    <div className='tw-space-y-4'>
      <div className='tw-flex tw-justify-start'>
        <div className='tw-w-auto tw-max-w-[60% tw-flex tw-items-center tw-gap-2'>
          <Skeleton variant='circular' width={50} height={50} />
          <div className='tw-space-y-2'>
            <Skeleton variant='rectangular' width={200} height={20} />
            <Skeleton variant='rectangular' width={100} height={16} />
          </div>
        </div>
      </div>

      <div className='tw-flex tw-justify-end'>
        <div className='tw-w-auto tw-max-w-[60% tw-flex tw-flex-row-reverse tw-items-center tw-gap-2'>
          <Skeleton variant='circular' width={50} height={50} />
          <div className='tw-flex tw-flex-col tw-items-end tw-gap-2'>
            <Skeleton variant='rectangular' width={200} height={20} />
            <Skeleton variant='rectangular' width={100} height={16} />
          </div>
        </div>
      </div>

      <div className='tw-flex tw-justify-start'>
        <div className='tw-w-auto tw-max-w-[60% tw-flex tw-items-center tw-gap-2'>
          <Skeleton variant='circular' width={50} height={50} />
          <div className='tw-space-y-2'>
            <Skeleton variant='rectangular' width={200} height={20} />
            <Skeleton variant='rectangular' width={100} height={16} />
          </div>
        </div>
      </div>

      <Typography level='body-sm' textAlign='center'>
        Đang lấy dữ liệu tin nhắn của bạn...
      </Typography>
    </div>
  );
};

export default ConversationViewSkeleton;
