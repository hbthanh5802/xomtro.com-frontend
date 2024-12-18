import { Skeleton } from '@mui/joy';

const PostCommentSkeleton = () => {
  return (
    <div className='tw-flex tw-gap-3 tw-items-start'>
      <Skeleton variant='circular' width={48} height={48} sx={{ flexGrow: 0, flexShrink: 0 }} />
      <Skeleton variant='rectangular' sx={{ flexGrow: 1 }} height={60} />
    </div>
  );
};

export default PostCommentSkeleton;
