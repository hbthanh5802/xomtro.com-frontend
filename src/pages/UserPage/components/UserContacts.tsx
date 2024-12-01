import ModalLayout from '@/components/ModalLayout';
import RHFInput from '@/components/RHFInput';
import RHFSelect from '@/components/RHFSelect';
import { queryClient } from '@/configs/tanstackQuery.config';
import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import userService from '@/services/user.service';
import { useAppStore } from '@/store/store';
import { UserContactsSelectSchemaType } from '@/types/schema.type';
import { InsertUserContactDataType } from '@/types/user.type';
import { generateContactHTML, handleAxiosError } from '@/utils/constants.helper';
import { insertUserContactValidation } from '@/validations/user.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Chip, DialogActions, DialogTitle, Divider, Skeleton, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// Icons
import { FiPlus } from 'react-icons/fi';
import { IoLogoFacebook } from 'react-icons/io';
import { MdAttachEmail, MdContactSupport, MdLocalPhone, MdOutlineInfo } from 'react-icons/md';
import { SiZalo } from 'react-icons/si';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const contactContentPlaceholder = {
  facebook: 'Hãy dán đường link trang cá nhân Facebook của bạn.',
  zalo: 'Hãy nhập số điện thoại liên kết Zalo.',
  email: 'Hãy cung cấp địa chỉ email liên hệ với bạn.',
  phone: 'Hãy nhập số điện thoại liên hệ của bạn',
  other: 'Cung cấp thông tin bạn muốn vào đây.',
};

const contactItemDecorator = {
  facebook: {
    label: 'Facebook:',
    icon: <IoLogoFacebook className='tw-text-slate-600 tw-mr-[4px] tw-text-[18px]' />,
  },
  zalo: {
    label: 'Zalo:',
    icon: <SiZalo className='tw-text-slate-600 tw-mr-[4px] tw-text-[18px]' />,
  },
  phone: {
    label: 'Số điện thoại:',
    icon: <MdLocalPhone className='tw-text-slate-600 tw-mr-[4px] tw-text-[18px]' />,
  },
  email: {
    label: 'Email:',
    icon: <MdAttachEmail className='tw-text-slate-600 tw-mr-[4px] tw-text-[18px]' />,
  },
  other: {
    label: 'Khác:',
    icon: <MdContactSupport className='tw-text-slate-600 tw-mr-[4px] tw-text-[18px]' />,
  },
};

const ConfirmRemoveDialog = (props: { contactId: number; onSuccess: () => void }) => {
  const [loading, setLoading] = React.useState(false);
  const { contactId, onSuccess = () => {} } = props;

  const handleDelete = async () => {
    const toastId = toast.loading('Đang xoá thông tin liên hệ. Vui lòng chờ...');
    setLoading(true);
    try {
      await userService.removeUserContact(contactId);
      toast.success('Thành công! Đã xoá thông tin liên hệ.', { duration: 1000, id: toastId });
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
          Xác nhận loại bỏ thông tin liên hệ
        </DialogTitle>
        <div className='tw-my-2'>
          <Divider />
        </div>
        <Typography level='body-md'>Hành động "Xác nhận" sẽ bỏ thông tin liên hệ vĩnh viễn.</Typography>
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

interface UserContactFormProps {
  mode: 'add' | 'edit';
  data?: UserContactsSelectSchemaType;
  onSuccess?: () => void;
}

const UserContactForm = (props: UserContactFormProps) => {
  const { mode, data, onSuccess = () => {} } = props;
  const [loading, setLoading] = React.useState(false);
  const methods = useForm<InsertUserContactDataType>({
    defaultValues: {
      contactType: mode === 'add' ? 'other' : data?.contactType,
      contactContent: mode === 'add' ? '' : data?.contactContent,
    },
    resolver: zodResolver(insertUserContactValidation),
  });
  const { watch } = methods;
  const contactType = watch('contactType');

  const handleSubmit = async (formData: InsertUserContactDataType) => {
    setLoading(true);
    const toastId = toast.loading('Đang lưu lại thông tin của bạn. Vui lòng chờ...');
    try {
      if (mode === 'add') {
        await userService.createUserContact(formData);
      } else {
        const contactId = data?.id;
        if (!contactId) {
          throw new Error('Lỗi, vui lòng thử lại sau');
        }
        await userService.updateUserContact(contactId, formData);
      }
      toast.success('Thành công! Thông tin liên hệ của bạn sẽ sớm xuất hiện tại trang cá nhân.', {
        duration: 1000,
        id: toastId,
      });
      onSuccess();
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Không thành công! Hãy kiểm tra thông tin hoặc thử lại sau.', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className='tw-pt-[24px] tw-pb-[12px] tw-space-y-3' onSubmit={methods.handleSubmit(handleSubmit)}>
        <RHFSelect<InsertUserContactDataType>
          control={methods.control}
          name='contactType'
          label='Loại thông tin:'
          placeholder='Chọn loại thông tin'
          options={[
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'Zalo',
              value: 'zalo',
            },
            {
              label: 'Email',
              value: 'email',
            },
            {
              label: 'Số điện thoại',
              value: 'phone',
            },
            {
              label: 'Khác',
              value: 'other',
            },
          ]}
        />
        <RHFInput<InsertUserContactDataType>
          control={methods.control}
          name='contactContent'
          label='Nội dung liên hệ:'
          placeholder={contactContentPlaceholder[contactType!]}
        />

        <div className='tw-pt-[12px]'>
          <Button fullWidth loading={loading} disabled={loading} type='submit'>
            Lưu lại thông tin
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const UserContacts = () => {
  const { params } = useUrl();
  const contactId = React.useId();
  const userId = Number(params.userId);
  const [openForm, setOpenForm] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [chosenContact, setChosenContact] = React.useState<UserContactsSelectSchemaType | null | undefined>(null);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const { data: getUserContactResponse, isFetching } = useUserApiHook.useUserContacts(userId, {
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
  const userContacts = getUserContactResponse?.data;
  const mode = chosenContact ? 'edit' : 'add';

  const handleSubmitSuccessForm = () => {
    queryClient.invalidateQueries({ queryKey: ['users', 'contacts', { userId }] });
    setOpenForm(false);
    setConfirmDelete(false);
    setChosenContact(null);
  };

  const handleRemoveClick = (data: UserContactsSelectSchemaType) => {
    setChosenContact(data);
    setConfirmDelete(true);
  };

  const handleEditClick = (data: UserContactsSelectSchemaType) => {
    setChosenContact(data);
    setOpenForm(true);
  };

  if (!userId) {
    return <Navigate to={'/404'} />;
  }
  return (
    <React.Fragment>
      {/* Modal */}
      <ModalLayout
        maxWidth={400}
        title='Thêm thông tin liên hệ'
        content='Hoàn thành những thông tin sau để thêm thông tin liên hệ của bạn.'
        isOpen={openForm}
        onCloseModal={handleSubmitSuccessForm}
      >
        <UserContactForm
          mode={mode}
          data={chosenContact as UserContactsSelectSchemaType}
          onSuccess={handleSubmitSuccessForm}
        />
      </ModalLayout>

      <ModalLayout isOpen={confirmDelete} onCloseModal={handleSubmitSuccessForm}>
        <ConfirmRemoveDialog contactId={Number(chosenContact?.id)} onSuccess={handleSubmitSuccessForm} />
      </ModalLayout>

      <div className='tw-shadow-md tw-rounded-lg tw-mt-[12px] tw-bg-white tw-p-[24px]'>
        <header className='tw-flex tw-items-center tw-justify-between tw-mb-[12px]'>
          <Typography level='title-lg'>
            <Skeleton animation='wave' loading={isFetching}>
              Thông tin liên hệ
            </Skeleton>
          </Typography>
          {currentUser?.userId === userId && (
            <Button
              variant='plain'
              startDecorator={<FiPlus className='tw-text-[18px]' />}
              onClick={() => setOpenForm(true)}
            >
              Thêm mới
            </Button>
          )}
        </header>
        <main className='tw-max-w-full tw-space-y-2'>
          {!isFetching && !userContacts?.length && (
            <Typography level='body-sm'>Chưa bổ sung thông tin liên hệ</Typography>
          )}
          {userContacts?.map((item) => {
            const { contactContent, contactType } = item;
            return (
              <div key={`contact-item-${contactId}-${item.id}`} className='tw-flex tw-items-center tw-justify-between'>
                <div className='tw-flex tw-items-center tw-gap-2'>
                  <Typography level='title-sm' startDecorator={contactItemDecorator[contactType!].icon}>
                    {contactItemDecorator[contactType!].label}
                  </Typography>
                  <div
                    className='tw-text-[15px] tw-text-slate-700 hover:tw-text-primaryColor tw-duration-150 tw-cursor-pointer'
                    dangerouslySetInnerHTML={{
                      __html: generateContactHTML(contactType as string, contactContent),
                    }}
                  />
                </div>

                {currentUser?.userId === userId && (
                  <div className='tw-flex tw-gap-2'>
                    <Chip color='danger' variant='plain' onClick={() => handleRemoveClick(item)}>
                      Xoá
                    </Chip>
                    <Chip color='primary' onClick={() => handleEditClick(item)}>
                      Sửa
                    </Chip>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </React.Fragment>
  );
};

export default UserContacts;
