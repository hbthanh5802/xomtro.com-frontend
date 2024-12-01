import ModalLayout from '@/components/ModalLayout';
import { queryClient } from '@/configs/tanstackQuery.config';
import useUserApiHook from '@/hooks/useUserApi.hook';
import postService from '@/services/post.service';
import { useAppStore } from '@/store/store';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, DialogActions, DialogTitle, Divider, IconButton, Tooltip, Typography } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { MdOutlineInfo } from 'react-icons/md';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

interface AddToInterestedProps {
  postId: number;
}

const ConfirmRemoveDialog = (props: AddToInterestedProps & { onSuccess: () => void }) => {
  const [loading, setLoading] = React.useState(false);
  const { postId, onSuccess = () => {} } = props;

  const handleDelete = async () => {
    const toastId = toast.loading('Đang loại bỏ khỏi danh sách. Vui lòng chờ...');
    setLoading(true);
    try {
      await postService.removeInterestedPost(postId);
      toast.success('Thành công! Bài viết đã được xoá khỏi danh sách quan tâm.', { duration: 1000, id: toastId });
      onSuccess();
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Loại bỏ không thành công! Vui lòng thử lại sau.', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='tw-w-[400px]'>
        <DialogTitle>
          <span className='tw-flex tw-items-center tw-justify-center'>
            <MdOutlineInfo />
          </span>
          Xác nhận bỏ quan tâm bài viết này
        </DialogTitle>
        <div className='tw-my-2'>
          <Divider />
        </div>
        <Typography level='body-md'>
          Hành động "Xác nhận" sẽ bỏ bài viết này khỏi danh sách quan tâm của bạn.
        </Typography>
        <DialogActions>
          <Button variant='solid' color='danger' disabled={loading} loading={loading} onClick={handleDelete}>
            Xác nhận
          </Button>
          <Button variant='plain' color='neutral' onClick={onSuccess}>
            Trở lại
          </Button>
        </DialogActions>
      </div>
    </>
  );
};

const AddToInterestedButton = (props: AddToInterestedProps) => {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const { postId } = props;
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      whereConditions: state.whereConditions,
    })),
  );

  const { data: UserInterestedPostsResponse, isFetched } = useUserApiHook.useUserInterestedPosts(
    Number(currentUser?.userId),
    {
      staleTime: 1000 * 60 * 15,
      gcTime: 1000 * 60 * 30,
    },
  );
  const isAddedToInterested = UserInterestedPostsResponse?.data.find((item) => item.postId === postId);

  const addToInterestedMutation = useMutation({
    mutationFn: (postId: number) => postService.createPostInterested({ postId }),
  });

  const handleAddToInterestedClick = async (postId: number) => {
    if (isAddedToInterested) {
      setOpenConfirm(true);
      return;
    }
    const toastId = toast.loading('Đang thêm bài viết vào danh sách quan tâm');
    if (!currentUser) {
      toast.info('Bạn phải đăng nhập trước kh thực hiện việc này!', { duration: 1500, id: toastId });
      return;
    }
    try {
      await addToInterestedMutation.mutateAsync(postId);
      toast.success('Đã thêm thành công!', { duration: 1000, id: toastId });
      queryClient.invalidateQueries({ queryKey: ['users', 'interested', { userId: currentUser.userId }] });
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Thêm không thành công! Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <ModalLayout isOpen={openConfirm} onCloseModal={() => setOpenConfirm(false)}>
        <ConfirmRemoveDialog
          postId={postId}
          onSuccess={() => {
            setOpenConfirm(false);
            queryClient.invalidateQueries({
              queryKey: ['users', 'interested', { userId: Number(currentUser?.userId) }],
            });
          }}
        />
      </ModalLayout>

      {isFetched && (
        <Tooltip
          title={!isAddedToInterested ? 'Thêm vào danh sách yêu thích' : 'Bỏ quan tâm bài viết này'}
          arrow
          placement='left'
        >
          <IconButton
            loading={addToInterestedMutation.isPending}
            variant='plain'
            color='danger'
            onClick={() => handleAddToInterestedClick(postId)}
          >
            {!isAddedToInterested ? (
              <IoMdHeartEmpty className='tw-text-[24px]' />
            ) : (
              <IoMdHeart className='tw-text-[24px]' />
            )}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default AddToInterestedButton;
