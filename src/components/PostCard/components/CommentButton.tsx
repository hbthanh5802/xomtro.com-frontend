import ModalLayout from '@/components/ModalLayout';
import PostCard from '@/components/PostCard';
import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import PostCardSkeleton from '@/components/PostCardSkeleton';
import { useFullPostQuery } from '@/hooks/usePostQuery';
import { useAppStore } from '@/store/store';
import { Button } from '@mui/joy';
import React from 'react';
import { FaRegCommentDots } from 'react-icons/fa6';
import { useShallow } from 'zustand/react/shallow';

interface CommentButtonProps {
  postId: number;
}

const CommentButton = (props: CommentButtonProps) => {
  const { postId } = props;
  const [openModal, setOpenModal] = React.useState(false);
  // const navigate = useNavigate();

  const { resetPostCommentState } = useAppStore(
    useShallow((state) => ({
      resetPostCommentState: state.resetPostCommentState,
    })),
  );

  const handleCloseModal = () => {
    resetPostCommentState();
    setOpenModal(false);
  };

  const { data: fullPostResponse, isFetching: fullPostFetching } = useFullPostQuery(postId, {
    staleTime: 5 * 60 * 1000,
    gcTime: 6 * 60 * 1000,
    enabled: !!postId && openModal,
  });
  const postData = fullPostResponse?.data[0];

  return (
    <>
      <ModalLayout maxWidth={'100%'} isOpen={openModal} onCloseModal={handleCloseModal}>
        <section className='PostCard__preview tw-rounded tw-overflow-y-auto tw-tracking-tighter tw-scroll-ml-4 !tw-scrollbar-thumb-slate-400 tw-max-h-[90dvh] tw-max-w-[90vw] tablet:tw-max-w-[680px] laptop:tw-max-w-[800px]'>
          {fullPostFetching ? (
            <PostCardSkeleton />
          ) : (
            <PostCard data={postData as unknown as PostCardDataType} isPreview />
          )}
        </section>
      </ModalLayout>
      <Button onClick={() => setOpenModal(true)} startDecorator={<FaRegCommentDots className='tw-text-[18px]' />}>
        Bình luận
      </Button>
    </>
  );
};

export default CommentButton;
