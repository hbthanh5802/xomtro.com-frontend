import RHFDatePicker from '@/components/RHFDatePicker';
import RHFInput from '@/components/RHFInput';
import RHFPhoneInput from '@/components/RHFPhoneInput';
import RHFRadioGroup from '@/components/RHFRadioGroup';
import { RadioOptionItem } from '@/components/RHFRadioGroup/RHFRadioGroup';
import RHFRichText from '@/components/RHFRichText';
import RHFTextArea from '@/components/RHFTextArea';
import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import userService from '@/services/user.service';
import { useAppStore } from '@/store/store';
import { UserDetailInsertSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { UpdateUserProfileDataType } from '@/types/user.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { timeInVietNam } from '@/utils/time.helper';
import { updateUserDetailValidation } from '@/validations/user.validation';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Skeleton } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const emptyContent = 'Chưa có thông tin';
const genderRadioOptions: RadioOptionItem[] = [
  {
    label: 'Nam',
    value: 'male',
  },
  {
    label: 'Nữ',
    value: 'female',
  },
  {
    label: 'Khác',
    value: 'other',
  },
];

const EditProfile = (props: { onSuccess?: () => void }) => {
  const {
    params: { userId },
  } = useUrl();
  const queryClient = useQueryClient();
  const methods = useForm<UpdateUserProfileDataType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: null,
      bio: '',
      phone: '',
      email: '',
      dob: null,
    },
    resolver: zodResolver(updateUserDetailValidation),
  });
  const {
    control,
    reset,
    formState: { isValid },
  } = methods;

  const { setCurrentUser } = useAppStore(
    useShallow((state) => ({
      setCurrentUser: state.setCurrentUser,
    })),
  );

  const { data: UserDetailResponse, isFetching } = useUserApiHook.useUserDetail(Number(userId), {
    staleTime: 3 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;

  useEffect(() => {
    if (userDetail) {
      reset(userDetail as UpdateUserProfileDataType);
    }
  }, [userDetail]);

  const updateUserProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileDataType) => userService.updateUserDetail(data as UserDetailInsertSchemaType),
  });

  const handleUpdateProfile = async (data: UpdateUserProfileDataType) => {
    const toastId = toast.loading('Đang lưu lại thông tin sửa đổi. VUi lòng chờ...');
    try {
      const response = await updateUserProfileMutation.mutateAsync(data);
      await queryClient.refetchQueries({ queryKey: ['user-detail'] });
      if (response.data) {
        toast.success('Thay đổi thành công!', { id: toastId, duration: 1500 });
        setCurrentUser(response.data, false);
        if (props.onSuccess) props.onSuccess();
      }
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Có lỗi xảy ra. Hãy thao tác lại hoặc thử lại lại sau.', { id: toastId });
    }
  };

  return (
    <div className='tw-pt-[24px] tw-pb-[12px] tw-flex tw-justify-center tw-flex-col tw-gap-3'>
      <FormProvider {...methods}>
        <form className='tw-space-y-6 tw-max-w-[600px]' onSubmit={methods.handleSubmit(handleUpdateProfile)}>
          <div className='tw-flex tw-gap-[28px]'>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFInput<UpdateUserProfileDataType> name='firstName' label='Họ và Tên đêm:' placeholder={emptyContent} />
            </Skeleton>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFInput<UpdateUserProfileDataType> name='lastName' label='Tên:' placeholder={emptyContent} required />
            </Skeleton>
          </div>
          <div className='tw-gap-[28px]'>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFInput<UpdateUserProfileDataType>
                name='email'
                type='email'
                label='Địa chỉ email:'
                placeholder={emptyContent}
                disable
              />
            </Skeleton>
          </div>
          <div className='tw-flex tw-gap-[28px]'>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFPhoneInput<UpdateUserProfileDataType>
                name='phone'
                label='Số điện thoại:'
                placeholder={emptyContent}
                required
              />
            </Skeleton>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFDatePicker<UpdateUserProfileDataType>
                name='dob'
                label='Ngày sinh'
                control={control}
                maxDate={timeInVietNam().toDate()}
              />
            </Skeleton>
          </div>
          <div className='tw-flex tw-gap-[28px]'>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFRadioGroup<UpdateUserProfileDataType>
                name='gender'
                label='Giới tính:'
                options={genderRadioOptions}
                direction='horizontal'
              />
            </Skeleton>
          </div>
          {/* Bio */}
          <div className='tw-flex tw-gap-[28px]'>
            <Skeleton animation='wave' loading={isFetching}>
              <RHFTextArea<UpdateUserProfileDataType>
                name='bio'
                label='Giới thiệu:'
                control={control}
                placeholder='Thêm thông tin giói thiệu của bạn ở đây...'
                minRows={4}
              />
            </Skeleton>
          </div>

          <div className='tw-flex tw-items-center tw-justify-end tw-pt-[40px] tw-gap-3'>
            <Button type='submit' disabled={!isValid}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
        <DevTool control={control} />
      </FormProvider>
    </div>
  );
};

export default EditProfile;
