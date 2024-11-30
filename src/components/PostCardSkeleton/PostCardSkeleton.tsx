import { LinearProgress, Skeleton } from '@mui/joy';

const PostCardSkeleton = () => {
  return (
    <div className='tw-shadow-md tw-w-full tw-rounded-lg tw-bg-white tw-overflow-hidden tw-py-[24px]'>
      <header className='tw-p-[14px] tw-pt-0 tw-flex tw-justify-between tw-items-center'>
        <div className='tw-flex tw-items-center tw-gap-4'>
          <Skeleton animation='wave' variant='circular' width={50} height={50} />
          <div className='tw-space-y-2'>
            <Skeleton animation='wave' variant='rectangular' width={200} height={18} />
            <Skeleton animation='wave' variant='rectangular' width={100} height={16} />
          </div>
        </div>
        <div className='tw-flex tw-items-center tw-gap-4'>
          <Skeleton animation='wave' variant='rectangular' width={150} height={40} />
        </div>
      </header>
      <LinearProgress variant='solid' color='neutral' size='sm' />
      <main className='tw-mt-[24px]'>
        <div className='tw-px-[14px]'>
          <Skeleton animation='wave' variant='rectangular' width={400} height={24} />
          <div className='tw-mt-4 tw-flex tw-items-center tw-gap-2'>
            <Skeleton animation='wave' variant='rectangular' width={100} height={16} />
            <Skeleton animation='wave' variant='rectangular' width={400} height={16} />
          </div>
          <div className='tw-mt-4 tw-flex tw-items-center tw-gap-2'>
            <Skeleton animation='wave' variant='rectangular' sx={{ height: '300px' }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostCardSkeleton;
