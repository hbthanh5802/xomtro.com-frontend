import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { AspectRatio } from '@mui/joy';

interface PostImagesProps {
  data: PostCardDataType;
}

const PostImages = (props: PostImagesProps) => {
  const { assets } = props.data;
  return (
    <div className='tw-relative'>
      {assets.length && (
        <div className='tw-w-full tw-flex tw-mt-4 tw-gap-4 tw-overflow-auto'>
          <AspectRatio ratio='16/9' objectFit='contain' sx={{ minHeight: 'auto', minWidth: '100%', boxShadow: 'sm' }}>
            <img src={assets[0].url} loading='lazy' alt='' />
          </AspectRatio>
        </div>
      )}
    </div>
  );
};

export default PostImages;
