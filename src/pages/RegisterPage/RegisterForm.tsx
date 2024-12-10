import RHFInput from '@/components/RHFInput';
import RHFPasswordInput from '@/components/RHFPasswordInput';
import RHFPhoneInput from '@/components/RHFPhoneInput';
import RHFRoleChoices from '@/components/RHFRoleChoices';
import AuthServices from '@/services/auth.service';
import { RegisterDataType } from '@/types/auth.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { registerUserValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, Stack, Typography } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// import { Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const methods = useForm<RegisterDataType>({
    resolver: zodResolver(registerUserValidation),
  });
  const navigate = useNavigate();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { setError } = methods;
  const { isValid, isSubmitting } = methods.formState;

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDataType) => AuthServices.registerUser(data),
    onError: (error) => {
      const { status } = handleAxiosError(error)!;
      if (status === 409) {
        toast.error('Vui lòng kiểm tra lại thông tin');
        setError('email', { message: 'Email đã được sử dụng.' });
      }
    },
    onSuccess: (data) => {
      const { data: userDetailResponse } = data;
      toast.success('Tạo tài khoản thành công!');
      if (!userDetailResponse.isEmailVerified) {
        toast.info('Bạn sẽ tiến hành xác thực tài khoản ngay bây giờ!');
        navigate('/auth/verify', { state: { userDetail: userDetailResponse } });
      }
    },
  });

  const onSubmit = async (data: RegisterDataType) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <Stack sx={{ gap: 4, mt: 2 }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* User Full Name */}
          <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-2 tw-gap-[8px]'>
            {/* <div className=''> */}
            <RHFInput<RegisterDataType>
              name='firstName'
              label='Họ và đệm'
              placeholder='Nhập họ và đệm...'
              type='text'
            />
            {/* </div> */}
            {/* <div className=''> */}
            <RHFInput<RegisterDataType> name='lastName' label='Tên' placeholder='Nhập tên...' type='text' />
            {/* </div> */}
          </div>
          {/* Email */}
          <RHFInput<RegisterDataType>
            name='email'
            label='Email'
            placeholder='Nhập địa chỉ email của bạn...'
            type='email'
          />
          {/* Phone */}
          <RHFPhoneInput<RegisterDataType>
            name='phone'
            label='Số điện thoại'
            placeholder='Nhập số điện thoại của bạn'
          />
          {/* Password */}
          <RHFPasswordInput<RegisterDataType>
            name='password'
            label='Mật khẩu'
            placeholder='Thiết lập mật khẩu của bạn...'
          />
          {/* Role */}
          <RHFRoleChoices<RegisterDataType> name='role' label='Đăng ký với tư cách:' />

          <Stack sx={{ gap: 4, mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Checkbox
                onChange={() => setAgreeTerms(!agreeTerms)}
                checked={agreeTerms}
                size='sm'
                label={
                  <Typography>
                    Đồng ý với <Typography variant='soft'>Điều khoản</Typography> và{' '}
                    <Typography variant='soft'>Chính sách bảo mật.</Typography>
                  </Typography>
                }
                name='agreeTerms'
              />
              {/* <Link to={'/auth/login'}>Quên mật khẩu?</Link> */}
            </Box>
            <Button type='submit' fullWidth disabled={!agreeTerms || !isValid || isSubmitting} loading={isSubmitting}>
              Tạo tài khoản
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  );
};

export default RegisterForm;
