import RHFNumberInput from '@/components/RHFNumberInput';
import RHFSelect from '@/components/RHFSelect';
import { queryClient } from '@/configs/tanstackQuery.config';
import postService from '@/services/post.service';
import { RenewPostDataType } from '@/types/post.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { renewPostValidation } from '@/validations/post.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogTitle, Divider, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';
import { toast } from 'sonner';

interface RenewPostFormProps {
  postId: number;
  onSuccess?: () => void;
}
const RenewPostForm = (props: RenewPostFormProps) => {
  const { postId, onSuccess } = props;
  const [loading, setLoading] = React.useState(false);
  const methods = useForm<RenewPostDataType>({
    defaultValues: {
      expirationAfter: 0,
      expirationAfterUnit: 'day',
    },
    resolver: zodResolver(renewPostValidation),
  });
  const {
    control,
    formState: { isValid },
  } = methods;

  const handleRenewPost = async (data: RenewPostDataType) => {
    setLoading(true);
    const toastId = toast.loading('Đang làm mới bài đăng. Vui lòng chờ...');
    try {
      await postService.renewPost(postId, data);
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
      toast.success('Làm mới bài đăng thành công!', { duration: 1000, id: toastId });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Làm mới không thành công. Vui lòng thử lại sau!', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!postId) return <></>;
  return (
    <div className='tw-w-[400px]'>
      <DialogTitle>
        <span className='tw-flex tw-items-center tw-justify-center'>
          <MdOutlineInfo />
        </span>
        Làm mới bài viết
      </DialogTitle>
      <div className='tw-my-2'>
        <Divider />
      </div>
      <Typography level='body-md'>Hãy thiết lập để làm mới bài viết bài đăng.</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleRenewPost)} className='tw-flex tw-flex-col tw-gap-2 tw-py-[12px]'>
          <RHFNumberInput<RenewPostDataType> name='expirationAfter' label='Thời gian gia hạn:' />

          <RHFSelect<RenewPostDataType>
            control={control}
            name='expirationAfterUnit'
            label='Đơn vị'
            options={[
              {
                label: 'Giờ',
                value: 'hour',
              },
              {
                label: 'Ngày',
                value: 'day',
              },
              {
                label: 'Tuần',
                value: 'week',
              },
              {
                label: 'Tháng',
                value: 'month',
              },
            ]}
          />

          <div className='tw-pt-[12px]'>
            <Button fullWidth type='submit' loading={loading} disabled={loading || !isValid}>
              Làm mới bài viết
            </Button>
          </div>
          <Typography level='body-sm'>
            Bài viết sẽ không tự động ẩn đi nếu không thiết lập{' '}
            <Typography level='title-sm'>thời gian gia hạn</Typography> hoặc giá trị là{' '}
            <Typography level='title-sm'>0</Typography>.
          </Typography>
        </form>
      </FormProvider>
    </div>
  );
};

export default RenewPostForm;
