import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { formatTimeForVietnamese } from '@/utils/time.helper';

interface PostTimeProps {
  data: PostCardDataType;
}
const PostTime = (props: PostTimeProps) => {
  const { post } = props.data;

  return (
    <div className='tw-flex tw-flex-col tw-gap-1'>
      {`Ngày đăng bài: ${formatTimeForVietnamese(post.createdAt!, 'HH:mm:ss DD/MM/YYYY')}`} <br></br>
      {`Cập nhật mới nhất: ${formatTimeForVietnamese(post.updatedAt!, 'HH:mm:ss DD/MM/YYYY')}`}
    </div>
  );
};

export default PostTime;
