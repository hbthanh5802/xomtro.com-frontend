import PostCommentInput from '@/components/PostComments/PostCommentInput';
import PostCommentItem from '@/components/PostComments/PostCommentItem';
import PostCommentSkeleton from '@/components/PostComments/PostCommentSkeleton';
import { useAppStore } from '@/store/store';
import { PostCommentSelectSchemaType } from '@/types/schema.type';
import { Button, Typography } from '@mui/joy';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import './PostComments.css';

interface PostCommentsProps {
  postId: number;
  maxHeight?: string;
  scrollIntoView?: boolean;
}

const PostComments = (props: PostCommentsProps) => {
  const { postId, maxHeight, scrollIntoView = true } = props;
  const postCommentId = React.useId();
  // const [loading, setLoading] = React.useState(true);
  // const [comments, setComments] = React.useState<PostCommentSelectSchemaType[]>([]);
  // const [pagination, setPagination] = React.useState<PaginationResponseType | null>(null);
  const commentRef = React.useRef<HTMLDivElement | null>(null);

  const {
    postCommentMode,
    fetchPostComments,
    postComments,
    postCommentPagination,
    setPostComments,
    fetchingPostComments,
    setSelectedPostComment,
    setPostCommentMode,
    resetPostCommentState,
  } = useAppStore(
    useShallow((state) => ({
      fetchingPostComments: state.fetchingPostComments,
      postCommentMode: state.postCommentMode,
      postComments: state.postComments,
      postCommentPagination: state.postCommentPagination,
      setPostComments: state.setPostComments,
      fetchPostComments: state.fetchPostComments,
      setPostCommentMode: state.setPostCommentMode,
      setSelectedPostComment: state.setSelectedPostComment,
      resetPostCommentState: state.resetPostCommentState,
    })),
  );

  const handleSubmitSuccess = (data: PostCommentSelectSchemaType) => {
    if (postCommentMode === 'add') {
      setPostComments([...postComments, data]);
      setPostCommentMode('add');
      setSelectedPostComment(null);
    }
    if (postCommentMode === 'edit') {
      const commentIndex = postComments.findIndex((comment) => comment.id === data.id);
      if (commentIndex > -1) {
        const newPostCommentList = [...postComments];
        newPostCommentList[commentIndex] = data;
        setPostComments(newPostCommentList);
      }
      setPostCommentMode('add');
      setSelectedPostComment(null);
    }
  };

  React.useEffect(() => {
    if (postId) {
      fetchPostComments({ postId, page: 1 });
    }
  }, [postId, fetchPostComments]);

  React.useEffect(() => {
    if (commentRef.current && scrollIntoView) {
      commentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [postComments, scrollIntoView]);

  React.useEffect(() => {
    // Cleanup logic: reset post comment state on unmount
    return () => {
      resetPostCommentState();
    };
  }, [resetPostCommentState]);

  return (
    <div className='tw-relative tw-my-2'>
      <div className='tw-py-2 tw-border-b'>
        <Typography level='title-md'>Bình luận</Typography>
      </div>
      <div
        className={`tw-mt-3 ${
          maxHeight ? `tw-max-h-[${maxHeight}]` : 'tw-max-h-[60dvh]'
        } tw-overflow-y-auto tw-space-y-4`}
      >
        {postComments.length ? (
          postComments.map((comment, index) => {
            return (
              <div className='tw-w-fit' ref={commentRef} key={`PostComment_item-${postCommentId}-${index}`}>
                <PostCommentItem data={comment} />
              </div>
            );
          })
        ) : (
          <Typography level='body-md' sx={{ pb: 2 }}>
            Chưa có bình luận nào cả.
          </Typography>
        )}
        {fetchingPostComments && <PostCommentSkeleton />}
        {postCommentPagination?.canNext && (
          <Button
            variant='plain'
            fullWidth
            size='sm'
            onClick={() => fetchPostComments({ postId, page: postCommentPagination.currentPage + 1 })}
          >
            Xem thêm bình luận
          </Button>
        )}
      </div>

      <div className='tw-sticky tw-top-0 tw-left-0 tw-pt-2 tw-bg-white tw-border-t'>
        <PostCommentInput mode={postCommentMode} postId={postId} onSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
};

export default PostComments;
