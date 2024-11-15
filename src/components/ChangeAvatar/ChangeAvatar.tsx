import RHFImageInput from '@/components/RHFImageInput';
import userService from '@/services/user.service';
import { useAppStore } from '@/store/store';
import { UpdateAvatarDataType } from '@/types/user.type';
import { updateAvatarValidation } from '@/validations/user.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, Skeleton } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const ChangeAvatar = (props: { onSuccess?: () => void }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePreview = (fileList: FileList) => {
    const file = fileList[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { currentUser, userAvatar, fetchUserAvatar } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAvatar: state.userAvatar,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );

  const methods = useForm<UpdateAvatarDataType>({
    resolver: zodResolver(updateAvatarValidation),
  });
  const {
    watch,
    formState: { isValid },
  } = methods;

  const updateAvatarMutation = useMutation({
    mutationFn: (data: any) => userService.updateUserAvatar(data),
  });

  const handleSubmitAvatar = async (data: UpdateAvatarDataType) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);

    const toastId = toast.loading('Đăng thay đổi ảnh đại diện. Vui lòng chờ...');
    try {
      await updateAvatarMutation.mutateAsync(formData);
      fetchUserAvatar();
      if (props?.onSuccess) props.onSuccess();
      toast.success('Thay đổi ảnh đại diện thành công!', {
        duration: 1500,
        id: toastId,
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử ảnh khác hoặc thử lại sau.', { id: toastId });
    }
  };

  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === 'avatar' && value?.avatar) {
        handlePreview(value.avatar);
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <div className='tw-p-[24px] tw-flex tw-justify-center tw-flex-col tw-gap-3'>
      <div className='tw-drop-shadow-md'>
        <Avatar
          sx={{
            width: '200px',
            height: '200px',
          }}
          color='primary'
          alt={currentUser?.lastName}
          src={preview || userAvatar?.url}
        >
          <Skeleton animation='wave' loading={!userAvatar?.url} />
        </Avatar>
      </div>
      <div className='tw-mt-3'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitAvatar)} className='tw-flex tw-flex-col tw-gap-3'>
            {/* Avatar input */}
            <RHFImageInput<UpdateAvatarDataType> name='avatar' label='Chọn ảnh' />
            {/* Submit button */}
            <Button
              type='submit'
              fullWidth
              disabled={updateAvatarMutation.isPending || !isValid}
              loading={updateAvatarMutation.isPending}
            >
              Lưu lại
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ChangeAvatar;
