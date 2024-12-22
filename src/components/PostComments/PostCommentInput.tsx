import DrawerWrapper from '@/components/DrawerWrapper';
import PostAttachment from '@/components/PostAttachments';
import PostAttachmentItem from '@/components/PostAttachments/PostAttachmentItem';
import { useFullPostQuery } from '@/hooks/usePostQuery';
import postService from '@/services/post.service';
import { PostAttachmentType } from '@/store/postCommentSlice';
import { useAppStore } from '@/store/store';
import { InsertPostCommentDataType } from '@/types/post.type';
import { PostCommentSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { insertPostCommentValidation } from '@/validations/post.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, IconButton, Skeleton, Stack, Textarea } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoSend } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

interface PostCommentInputProps {
  mode: 'add' | 'edit' | 'reply';
  postId: number;
  onSuccess?: (data: PostCommentSelectSchemaType) => void;
  onError?: () => void;
}

const PostCommentInput = (props: PostCommentInputProps) => {
  const { postId, onSuccess, onError, mode } = props;
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });

  const {
    selectedPostComment,
    openSelectPostAttachment,
    setOpenSelectedPostAttachment,
    setSelectedPostAttachment,
    setPostCommentMode,
  } = useAppStore(
    useShallow((state) => ({
      selectedPostComment: state.selectedPostComment,
      openSelectPostAttachment: state.openSelectPostAttachment,
      setOpenSelectedPostAttachment: state.setOpenSelectedPostAttachment,
      setSelectedPostAttachment: state.setSelectedPostAttachment,
      setPostCommentMode: state.setPostCommentMode,
    })),
  );

  const defaultFormValues = React.useMemo(
    () => ({
      content: undefined,
      tags: undefined,
      postId: postId,
      parentCommentId: undefined,
    }),
    [postId],
  );

  const methods = useForm<InsertPostCommentDataType>({
    defaultValues: defaultFormValues,
    mode: 'all',
    resolver: zodResolver(insertPostCommentValidation),
  });

  const { currentUser, selectedPostAttachment } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      selectedPostAttachment: state.selectedPostAttachment,
    })),
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, isValid },
  } = methods;

  const tagsValue = watch('tags');
  const postAttachmentId = tagsValue ? tagsValue.split('@post=')[1] : undefined;

  const { data: getFullPostAttachmentResponse, isFetching: getFullPostAttachmentFetching } = useFullPostQuery(
    Number(postAttachmentId),
  );

  const handleSubmitComment = async (data: InsertPostCommentDataType) => {
    try {
      if (mode === 'add') {
        const insertCommentResponse = await postService.insertPostComment(data);
        const newComment = insertCommentResponse.data[0];
        reset();
        if (onSuccess) onSuccess(newComment);
      } else if (mode === 'edit' && selectedPostComment) {
        const justUpdatedComment = await postService.updatePostComment(selectedPostComment?.id, data);
        if (onSuccess) onSuccess(justUpdatedComment.data);
      }
      reset(defaultFormValues, { keepValues: false });
    } catch (error) {
      toast.error('Không thành công! Có vẻ có lỗi xảy ra. Hãy kiểm tra lại thông tin hoặc thử lại sau. 😥', {
        position: isMobile ? 'top-center' : 'bottom-right',
      });
      if (onError) onError();
      console.log(handleAxiosError(error));
    }
  };

  const handleClosePostAttachment = () => {
    setOpenSelectedPostAttachment(false);
  };

  const handleRemovePostAttachment = () => {
    setValue('tags', undefined);
    setSelectedPostAttachment(null);
  };

  const handleResetCommentInput = () => {
    setSelectedPostAttachment(null);
    setPostCommentMode('add');
    reset({
      postId: postId,
      tags: undefined,
    });
  };

  React.useEffect(() => {
    // console.log(mode);
    if (mode === 'edit' && selectedPostComment) {
      reset({
        content: selectedPostComment.content ?? undefined,
        tags: selectedPostComment.tags ?? undefined,
        parentCommentId: selectedPostComment.parentCommentId ?? undefined,
        postId: postId,
      });
    } else if (mode === 'add') {
      reset();
    }
  }, [selectedPostComment, mode, reset, postId, defaultFormValues]);

  React.useEffect(() => {
    if (selectedPostAttachment) {
      setValue('tags', `@post=${selectedPostAttachment?.post?.id}`);
    } else {
      setValue('tags', undefined);
    }
  }, [selectedPostAttachment, setValue]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitComment)}>
        <Textarea
          disabled={!currentUser || isSubmitting || !currentUser}
          placeholder={
            currentUser ? 'Để lại bình luận tại đây...' : 'Bạn phải đăng nhập để bình luận vào bài viết này,'
          }
          aria-label='Message'
          {...register('content')}
          minRows={2}
          maxRows={10}
          sx={{
            '& textarea:first-of-type': {
              maxHeight: 48,
            },
          }}
          endDecorator={
            <div className='tw-flex tw-w-full tw-flex-col tw-items-stretch tw-gap-1'>
              <Stack
                direction='row'
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexGrow: 1,
                  py: 1,
                  pr: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {/* <label
                  htmlFor={fileInputId}
                  className='tw-flex tw-items-center tw-gap-1 tw-text-[14px] tw-text-slate-800 tw-p-1 tw-px-2 tw-border tw-rounded tw-cursor-pointer tw-duration-150 hover:tw-bg-backgroundColor active:tw-border-primaryColor'
                >
                  <input
                    id={fileInputId}
                    type='file'
                    accept='image/*'
                    className='tw-hidden'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <FaRegImage /> Thêm ảnh
                </label> */}

                <Button
                  disabled={isSubmitting || !currentUser}
                  loading={isSubmitting}
                  size='sm'
                  color='primary'
                  variant='outlined'
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={() => setOpenSelectedPostAttachment(true)}
                >
                  @ Đính kèm bài viết
                </Button>
                <div className='tw-space-x-2'>
                  {mode === 'edit' && (
                    <Button
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      size='sm'
                      color='neutral'
                      variant='plain'
                      sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                      onClick={handleResetCommentInput}
                    >
                      Huỷ
                    </Button>
                  )}
                  <Button
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                    type='submit'
                    size='sm'
                    color='primary'
                    variant='solid'
                    sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                    endDecorator={<IoSend width={24} height={24} />}
                  >
                    {mode === 'edit' ? 'Lưu lại' : 'Gửi'}
                  </Button>
                </div>
              </Stack>
              <div>
                {getFullPostAttachmentFetching ? (
                  <div className='tw-flex tw-gap-2'>
                    <Skeleton variant='rectangular' animation='wave' height={100} width={100} />
                    <Skeleton variant='rectangular' animation='wave' height={100} sx={{ flex: 1 }} />
                  </div>
                ) : (
                  <>
                    {tagsValue && getFullPostAttachmentResponse && (
                      <div className='tw-relative tw-mx-1'>
                        <div className='tw-absolute tw-z-10 tw-top-1/2 -tw-translate-y-1/2 tw-right-0'>
                          <IconButton color='danger' variant='outlined' onClick={handleRemovePostAttachment}>
                            <MdDeleteOutline />
                          </IconButton>
                        </div>
                        <PostAttachmentItem
                          data={getFullPostAttachmentResponse?.data[0] as unknown as PostAttachmentType}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          }
        />
        <input hidden {...register('tags')} />
        <input hidden {...register('postId')} value={Number(postId)} />
      </form>
      <DrawerWrapper
        open={openSelectPostAttachment}
        onClose={handleClosePostAttachment}
        closeButton
        title={'Đính kèm bài viết'}
        anchor='right'
      >
        <PostAttachment />
      </DrawerWrapper>
      {/* <DevTool control={methods.control} /> */}
    </FormProvider>
  );
};

export default PostCommentInput;
