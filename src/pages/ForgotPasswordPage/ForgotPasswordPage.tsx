import LogoIcon2 from '@/assets/LogoIcon2';
import RHFInput from '@/components/RHFInput';
import RHFPasswordInput from '@/components/RHFPasswordInput';
import Timer from '@/components/Timer';
import authService from '@/services/auth.service';
import { ForgotPasswordDataType } from '@/types/auth.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { forgotPasswordValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography } from '@mui/joy';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [canResend, setCanResend] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [canGetPassword, setCanGetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const methods = useForm<ForgotPasswordDataType>({
    defaultValues: {
      email: '',
      otpCode: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(forgotPasswordValidation),
    mode: 'onBlur',
  });
  const { getValues, formState, setError, resetField } = methods;
  const { isValid, isSubmitting } = formState;

  const handleGetForgotPassword = async () => {
    setCanResend(false);
    setIsSending(true);
    setLoading(true);
    try {
      const { email } = getValues();
      await authService.getForgotPassword(email);
      resetField('email', { defaultValue: email });
      setCanGetPassword(true);
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      if (errorResponse?.status === 404) {
        setError('email', { message: 'Địa chỉ email không tồn tại hoặc không chính xác!' });
      }
      toast.error('Xin lỗi, chúng tôi tạm thời chưa thể gửi mã. Vui lòng thử lại sau!');
    } finally {
      setIsSending(false);
      setLoading(false);
    }
  };

  const handleCompleteForgotPassword = async (data: ForgotPasswordDataType) => {
    setLoading(true);
    try {
      await authService.completeForgotPassword(data);
      toast.success(
        'Lấy lại mật khẩu thành công. Bạn sẽ được truyển hướng về trang Đăng nhập ngay sau thông báo này!',
        {
          duration: 1500,
        },
      );
      navigate('/auth/login');
    } catch (error) {
      const errorResponse = handleAxiosError(error);
      if (errorResponse?.status === 401) {
        setError('otpCode', { message: 'Mã xác thực không chính xác. Vui lòng kiểm tra lại' });
      }
      toast.error('Có lỗi xảy ra, vui lòng thử lại thông tin hoặc thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box component='header' sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Link to={'/home/rental'}>
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                {/* <IconButton variant='soft' color='primary' size='md'> */}
                {/* <LogoIcon width='24px' color='#185EA5' /> */}
                <LogoIcon2 width={32} height={32} />
                {/* </IconButton> */}
                <Typography
                  level='title-lg'
                  sx={(theme) => ({
                    [theme.getColorSchemeSelector('light')]: {
                      color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                  })}
                >
                  Xóm Trọ
                </Typography>
              </Box>
            </Link>
            {/* <ColorSchemeToggle /> */}
          </Box>
          <Box
            component='main'
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            {!canGetPassword ? (
              <div className='tw-space-y-4'>
                <Typography level='h3' sx={{ textAlign: 'center' }}>
                  Xác thực người dùng
                </Typography>
                <Typography level='body-md'>
                  Hãy cho chúng tôi biết{' '}
                  <Typography variant='soft' sx={{ fontWeight: 600 }}>
                    địa chỉ email
                  </Typography>{' '}
                  của bạn. Hãy làm theo hướng dẫn dưới đây:
                </Typography>
              </div>
            ) : (
              <div className='tw-space-y-4'>
                <Typography level='h3' sx={{ textAlign: 'center' }}>
                  Xác thực tài khoản
                </Typography>
                <Typography level='body-md'>
                  Vì lý do bảo mật, một mã xác thực tài khoản gồm 6 chữ số đã được gửi tới:{' '}
                  <Typography variant='soft' sx={{ fontWeight: 600 }}>
                    {getValues().email}
                  </Typography>{' '}
                  Hãy kiểm tra và làm theo hướng dẫn dưới đây.
                </Typography>
              </div>
            )}
            {/* Form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleCompleteForgotPassword)}>
                <>
                  <RHFInput<ForgotPasswordDataType>
                    type='email'
                    name='email'
                    label='Nhập địa chỉ email'
                    placeholder='VD: abc@gmail.com'
                    disable={canGetPassword}
                  />
                  {!canGetPassword && (
                    <Button
                      size='sm'
                      type='button'
                      onClick={() => handleGetForgotPassword()}
                      disabled={loading}
                      loading={loading}
                    >
                      Tiếp tục
                    </Button>
                  )}
                </>
                {canGetPassword && (
                  <>
                    {/* OTP input */}
                    <RHFInput<ForgotPasswordDataType>
                      name='otpCode'
                      label='Nhập mã tại đây:'
                      placeholder='VD: 123456'
                      type='text'
                    />
                    {/* password input */}
                    <RHFPasswordInput<ForgotPasswordDataType>
                      name='password'
                      label='Thiết lập mật khẩu:'
                      placeholder='VD: Abc@321'
                    />
                    {/* confirmPassword input */}
                    <RHFPasswordInput<ForgotPasswordDataType>
                      name='confirmPassword'
                      label='Xác nhận lại mật khẩu:'
                      placeholder='VD: Abc@321'
                    />
                    {/* Submit button */}
                    <Button type='submit' fullWidth disabled={!isValid || isSubmitting} loading={isSubmitting}>
                      Lấy lại mật khẩu
                    </Button>
                    <div className='tw-flex tw-items-center tw-space-x-1'>
                      <Typography level='body-md' component='div'>
                        Chưa nhận được mã?
                      </Typography>
                      {canResend ? (
                        <Button
                          size='sm'
                          variant='soft'
                          loading={isSending}
                          disabled={isSending || !canResend}
                          onClick={() => handleGetForgotPassword()}
                        >
                          Gửi mã
                        </Button>
                      ) : (
                        <Typography level='body-md' component='div'>
                          Thử lại sau <Timer second={30} onEnd={() => setCanResend(true)} className='tw-inline-block' />
                        </Typography>
                      )}
                    </div>
                  </>
                )}
              </form>
            </FormProvider>
            <Button
              size='sm'
              variant='plain'
              onClick={() => {
                if (canGetPassword) {
                  setCanGetPassword(false);
                } else {
                  navigate('/auth/login');
                }
              }}
            >
              Quay lại
            </Button>
          </Box>
          <Box component='footer' sx={{ py: 3 }}>
            <Typography level='body-xs' sx={{ textAlign: 'center' }}>
              © xomtro.com {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
