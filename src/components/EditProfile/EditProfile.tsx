import RHFDatePicker from '@/components/RHFDatePicker';
import RHFInput from '@/components/RHFInput';
import RHFPhoneInput from '@/components/RHFPhoneInput';
import RHFRadioGroup from '@/components/RHFRadioGroup';
import RHFTextArea from '@/components/RHFTextArea';
import userService from '@/services/user.service';
import { useAppStore } from '@/store/store';
import { RadioOptionItemType } from '@/types/common.type';
import { UserDetailInsertSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { UpdateUserProfileDataType } from '@/types/user.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { formatDateForInput, timeInVietNam } from '@/utils/time.helper';
import { updateUserDetailValidation } from '@/validations/user.validation';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const emptyContent = 'Chưa có thông tin';
const genderRadioOptions: RadioOptionItemType[] = [
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

interface EditProfileProps {
  onSuccess?: () => void;
  userData: UserDetailSelectSchemaType;
}

const EditProfile = (props: EditProfileProps) => {
  const { userData } = props;
  const queryClient = useQueryClient();
  const methods = useForm<UpdateUserProfileDataType>({
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      gender: userData?.gender || null,
      bio: userData?.bio || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      dob: formatDateForInput(userData?.dob || undefined),
    },
    resolver: zodResolver(updateUserDetailValidation),
  });
  const {
    control,
    formState: { isValid },
  } = methods;

  const { setCurrentUser } = useAppStore(
    useShallow((state) => ({
      setCurrentUser: state.setCurrentUser,
    })),
  );

  const updateUserProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileDataType) => userService.updateUserDetail(data as UserDetailInsertSchemaType),
  });

  const handleUpdateProfile = async (data: UpdateUserProfileDataType) => {
    const toastId = toast.loading('Đang lưu lại thông tin sửa đổi. VUi lòng chờ...');
    try {
      const response = await updateUserProfileMutation.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['user-detail', { userId: userData.userId }] });
      if (response.data) {
        toast.success('Thay đổi thành công!', { id: toastId, duration: 1500 });
        setCurrentUser(response.data as UserDetailSelectSchemaType, false);
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
        <form
          className='tw-flex tw-flex-col tw-gap-6 tw-w-full laptop:tw-max-w-[600px]'
          onSubmit={methods.handleSubmit(handleUpdateProfile)}
        >
          <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-2 tw-gap-[28px]'>
            <RHFInput<UpdateUserProfileDataType>
              name='firstName'
              label='Họ và Tên đêm:'
              placeholder={emptyContent}
              fullWidth
            />
            <RHFInput<UpdateUserProfileDataType>
              name='lastName'
              label='Tên:'
              placeholder={emptyContent}
              required
              fullWidth
            />
          </div>
          <div className='tw-gap-[28px]'>
            <RHFInput<UpdateUserProfileDataType>
              name='email'
              type='email'
              label='Địa chỉ email:'
              placeholder={emptyContent}
              disable
            />
          </div>
          <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-2 tw-gap-[28px]'>
            <RHFPhoneInput<UpdateUserProfileDataType>
              name='phone'
              label='Số điện thoại:'
              placeholder={emptyContent}
              fullWidth
            />
            <RHFDatePicker<UpdateUserProfileDataType>
              name='dob'
              label='Ngày sinh'
              control={control}
              maxDate={timeInVietNam().toDate()}
            />
          </div>
          <div className='tw-flex tw-gap-[28px]'>
            <RHFRadioGroup<UpdateUserProfileDataType>
              name='gender'
              label='Giới tính:'
              options={genderRadioOptions}
              direction='horizontal'
            />
          </div>
          {/* Bio */}
          <div className='tw-flex tw-gap-[28px]'>
            <RHFTextArea<UpdateUserProfileDataType>
              name='bio'
              label='Giới thiệu:'
              control={control}
              placeholder='Thêm thông tin giói thiệu của bạn ở đây...'
              minRows={4}
            />
          </div>

          <div className='tw-flex tw-items-center tw-justify-stretch tw-pt-[20px] tw-gap-3'>
            <Button
              type='submit'
              loading={updateUserProfileMutation.isPending}
              disabled={!isValid || updateUserProfileMutation.isPending}
              fullWidth
            >
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
