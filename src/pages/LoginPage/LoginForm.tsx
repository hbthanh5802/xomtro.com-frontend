import RHFInput from '@/components/RHFInput';
import RHFLoginPasswordInput from '@/components/RHFPasswordInput/RHFLoginPasswordInput';
import AuthServices from '@/services/auth.service';
import { useAppStore } from '@/store/store';
import { LoginUserDataType, RegisterDataType } from '@/types/auth.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { loginUserValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const LoginForm: React.FC = () => {
  const methods = useForm<LoginUserDataType>({
    resolver: zodResolver(loginUserValidation),
  });
  const navigate = useNavigate();
  const { setError } = methods;
  const { isValid, isSubmitting } = methods.formState;
  const { setCurrentUser, setAccessToken } = useAppStore(
    useShallow((state) => ({
      setCurrentUser: state.setCurrentUser,
      setAccessToken: state.setAccessToken,
    })),
  );

  const loginMutation = useMutation({
    mutationFn: (data: LoginUserDataType) => AuthServices.loginUser(data),
    onError: (error) => {
      const { status } = handleAxiosError(error)!;
      if (status === 401) {
        toast.error('Vui lòng kiểm tra lại thông tin.');
        setError('email', { message: 'Tài khoản hoặc mật khảu không chính xác.' });
        setError('password', { message: 'Tài khoản hoặc mật khảu không chính xác.' });
      } else if (status === 404) {
        toast.error('Vui lòng kiểm tra lại thông tin.');
        setError('email', { message: 'Tài khoản không tồn tại.' });
      }
    },
    onSuccess: (data) => {
      const {
        data: { userDetail, meta },
      } = data;
      toast.success('Đăng nhập thành công! Trang sẽ chuyển hướng ngay sau thông báo này.');
      if (!userDetail.isEmailVerified) {
        toast.info('Bạn sẽ tiến hành xác thực tài khoản ngay bây giờ!');
        navigate('/auth/verify', { state: { userDetail: userDetail } });
      } else if (!userDetail.role) {
        toast.info('Bạn sẽ tiến hành hoàn thiện tài khoản ngay sau thông báo này!');
        navigate('/auth/role', { state: { userDetail: userDetail } });
      } else {
        const { accessToken } = meta;
        setCurrentUser(userDetail);
        setAccessToken(accessToken);
        navigate('/home');
      }
    },
  });

  const onSubmit = async (data: LoginUserDataType) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <Stack sx={{ gap: 4, mt: 2 }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Email */}
          <RHFInput<RegisterDataType>
            name='email'
            label='Email'
            placeholder='Nhập địa chỉ email của bạn...'
            type='email'
          />
          {/* Password */}
          <RHFLoginPasswordInput<RegisterDataType>
            name='password'
            label='Mật khẩu'
            placeholder='Thiết lập mật khẩu của bạn...'
          />

          <Stack sx={{ gap: 4, mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Link to={'/auth/forgot-password'}>Quên mật khẩu?</Link>
            </Box>
            <Button type='submit' fullWidth disabled={!isValid || isSubmitting} loading={isSubmitting}>
              Đăng nhập
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  );
};

export default LoginForm;
