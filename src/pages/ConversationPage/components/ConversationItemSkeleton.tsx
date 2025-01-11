import { Skeleton } from '@mui/joy';
import { useMediaQuery } from 'react-responsive';

const ConversationItemSkeleton = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });
  if (isMobile) {
    return <Skeleton variant='circular' width={42} height={42} />;
  }
  return (
    <div className={`tw-px-[18px] tw-py-[18px] tw-flex tw-items-start tw-gap-2`}>
      <Skeleton variant='circular' width={42} height={42} />
      <div className='tw-flex-1 tw-overflow-hidden tw-hidden tablet:tw-block'>
        <Skeleton variant='rectangular' sx={{ flex: 1, height: 42 }} />
      </div>
    </div>
  );
};

export default ConversationItemSkeleton;
