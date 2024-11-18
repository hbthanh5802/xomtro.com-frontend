import ModalLayout from '@/components/ModalLayout';
import RHFPasswordInput from '@/components/RHFPasswordInput';
import RHFLoginPasswordInput from '@/components/RHFPasswordInput/RHFLoginPasswordInput';
import Timer from '@/components/Timer';
import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { UpdateUserPasswordDataType } from '@/types/user.type';
import { changeUserPasswordValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogActions, DialogTitle, Divider, Typography } from '@mui/joy';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// Icons
import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { MdDisabledVisible, MdOutlineInfo } from 'react-icons/md';
import { useShallow } from 'zustand/react/shallow';

function ResetPassword() {
  const [updateFetching, setUpdateFetching] = React.useState(false);
  const [getPasswordFetching, setGetPasswordFetching] = React.useState(false);
  const [canGetDefaultPassword, setCanGetDefaultPassword] = React.useState(true);

  const methods = useForm<UpdateUserPasswordDataType>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: zodResolver(changeUserPasswordValidation),
    mode: 'all',
  });
  const {
    formState: { isValid },
    reset,
  } = methods;

  const handleGetDefaultGooglePassword = async () => {
    setGetPasswordFetching(true);
    const toastId = toast.loading('Đang xử lý. Vui lòng chờ...');
    try {
      await authService.getDefaultGooglePassword();
      toast.success('Thành công! Vui lòng kiểm tra email', { duration: 1000, id: toastId });
      setCanGetDefaultPassword(false);
    } catch (error) {
      toast.error('Có lỗi xảy, ra. Vui lòng thử lại sau.', {
        duration: 1500,
        id: toastId,
      });
    } finally {
      setGetPasswordFetching(false);
    }
  };

  const handleSubmitChangePassword = async (data: UpdateUserPasswordDataType) => {
    setUpdateFetching(true);
    const toastId = toast.loading('Đang lưu thay đổi. Vui lòng chờ...');
    try {
      await userService.updateUserPassword(data);
      reset({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Đổi mật khẩu thành công!', { duration: 1000, id: toastId });
    } catch (error) {
      toast.error('Có lỗi xảy, ra. Hãy kiểm tra lại thông tin hoặc vui lòng thử lại sau.', {
        duration: 1500,
        id: toastId,
      });
    } finally {
      setUpdateFetching(false);
    }
  };

  return (
    <div className='tw-flex tw-gap-[48px]'>
      <FormProvider {...methods}>
        <form
          className='tw-w-[350px] tw-mt-[24px] tw-space-y-[12px] tw-flex-shrink-0'
          onSubmit={methods.handleSubmit(handleSubmitChangePassword)}
        >
          <RHFLoginPasswordInput<UpdateUserPasswordDataType>
            name='oldPassword'
            label='Mật khẩu cũ:'
            placeholder='Nhập mật khẩu cũ của bạn...'
          />
          <RHFPasswordInput<UpdateUserPasswordDataType>
            name='newPassword'
            label='Mật khẩu mới:'
            placeholder='Nhập mật khẩu mới của bạn...'
          />
          <RHFLoginPasswordInput<UpdateUserPasswordDataType>
            name='confirmNewPassword'
            label='Xác nhận lại mât khẩu:'
            placeholder='Xác nhận lại mật khẩu mới...'
          />
          <div className='tw-pt-[12px]'>
            <Button disabled={!isValid || updateFetching} loading={updateFetching} type='submit'>
              Thay đổi mật khẩu
            </Button>
          </div>
        </form>
      </FormProvider>
      <div className='tw-flex tw-flex-col tw-gap-2 tw-mt-[40px] tw-items-end'>
        <div className='tw-flex tw-gap-4 tw-items-center'>
          <span className='tw-text-[16px]'>
            <MdOutlineInfo />
          </span>
          <Typography level='body-sm' color='neutral' variant='plain' textAlign={'justify'}>
            Nếu bạn đang đăng nhập bằng tài khoản <span className='tw-text-primaryColor tw-font-semibold'>Google</span>{' '}
            . Hãy kiểm tra lại email đă đăng ký để xem lại mật khẩu mặc định nếu chưa từng thay đổi. Hoặc bạn có thể yêu
            cầu cấp lại mật khẩu, hãy làm theo hướng dẫn sau đây:
          </Typography>
        </div>
        <div className='tw-flex tw-items-center tw-gap-4'>
          {canGetDefaultPassword ? (
            <Button
              variant='plain'
              loading={getPasswordFetching}
              disabled={getPasswordFetching}
              onClick={() => handleGetDefaultGooglePassword()}
            >
              Cấp lại mật khẩu
            </Button>
          ) : (
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography level='body-sm' color='neutral' component='div'>
                Thử lại sau
              </Typography>
              <Timer second={30} onEnd={() => setCanGetDefaultPassword(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DisableAccount() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleCloseModal = () => {
    if (!loading) {
      setModalOpen(false);
    }
  };

  const { resetAuthState, resetUserState } = useAppStore(
    useShallow((state) => ({
      resetAuthState: state.resetAuthState,
      resetUserState: state.resetUserState,
    })),
  );

  const handleDisableAccount = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang lưu thay đổi. Vui lòng chờ...');
    try {
      await authService.disableAccount();
      toast.success('Tài khoản của bạn đã tạm ẩn! Bạn sẽ được chuyển hướng về trang Đăng nhập thông báo này.', {
        duration: 1000,
        id: toastId,
      });
      navigate('/auth/login');
      resetAuthState();
      resetUserState();
    } catch (error) {
      toast.error('Có lỗi xảy, ra. Hãy kiểm tra lại thông tin hoặc vui lòng thử lại sau.', {
        duration: 1500,
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <ModalLayout isOpen={modalOpen} onCloseModal={handleCloseModal}>
        <div className='tw-w-[400px]'>
          <DialogTitle>
            <span className='tw-flex tw-items-center tw-justify-center'>
              <MdOutlineInfo />
            </span>
            Bạn muốn tạm khoá tài khoản?
          </DialogTitle>
          <div className='tw-my-2'>
            <Divider />
          </div>
          <Typography level='body-md'>
            Hành đọng này sẽ tạm ẩn tài khoản của bạn. Sau khi khoá, các thông tin về tài khoản vễ tạm ẩn với tất cả mọi
            người.
          </Typography>
          <DialogActions>
            <Button
              variant='solid'
              color='danger'
              disabled={loading}
              loading={loading}
              onClick={() => handleDisableAccount()}
            >
              Xác nhận
            </Button>
            <Button variant='plain' color='neutral' onClick={handleCloseModal}>
              Trở lại
            </Button>
          </DialogActions>
        </div>
      </ModalLayout>

      <div className='tw-mt-[24px] tw-flex tw-justify-end'>
        <Button variant='plain' color='danger' onClick={() => setModalOpen(true)}>
          <span className='tw-inline-flex tw-items-center tw-justify-center tw-text-[16px] tw-mr-2'>
            <MdDisabledVisible />
          </span>
          <span>Tạm khoá tài khoản</span>
        </Button>
      </div>
    </React.Fragment>
  );
}

const SettingPage: React.FC = () => {
  const { params } = useUrl();
  const navigate = useNavigate();
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  React.useEffect(() => {
    if (currentUser && Number(params.userId) !== currentUser?.userId) {
      navigate('/403');
    }
  }, [currentUser]);

  return (
    <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-p-[24px]'>
      <header>
        <Typography level='h4'>Cài đặt tài khoản</Typography>
      </header>

      <main className='tw-my-[24px] tw-space-y-[48px]'>
        <div>
          <Divider sx={{ '--Divider-childPosition': `${0}%` }}>
            <Typography variant='soft' color='primary' level='title-md'>
              Mật khẩu
            </Typography>
          </Divider>
          <ResetPassword />
        </div>

        <div>
          <Divider sx={{ '--Divider-childPosition': `${0}%` }}>
            <Typography variant='plain' color='danger' level='title-md'>
              Khoá tài khoản
            </Typography>
          </Divider>
          <DisableAccount />
        </div>
      </main>
    </div>
  );
};

export default SettingPage;
