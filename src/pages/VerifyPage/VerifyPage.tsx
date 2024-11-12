import LogoIcon from '@/assets/LogoIcon';
import RHFInput from '@/components/RHFInput';
import Timer from '@/components/Timer';
import useUrl from '@/hooks/useUrl.hook';
import authService from '@/services/auth.service';
import { VerifyUserDataType } from '@/types/auth.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { verifyUserValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, IconButton, Typography } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const VerifyPage = () => {
  const {
    state: { userDetail },
  } = useUrl();
  if (!userDetail) {
    toast.error('Có lỗi xảy ra. Vui lòng thử lại sau');
    return null;
  }
  const navigate = useNavigate();
  const [canResend, setCanResend] = useState(false);

  const methods = useForm({
    defaultValues: {
      email: userDetail.email,
      otpCode: '',
    },
    resolver: zodResolver(verifyUserValidation),
  });
  const { isValid, isSubmitting } = methods.formState;

  const verifyMutation = useMutation({
    mutationFn: (data: VerifyUserDataType) => authService.verifyUser(data),
    onError: () => {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      methods.resetField('otpCode');
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success('Xác thực thành công. Trang sẽ chuyển hướng ngay sau thông báo này.', {
        duration: 1500,
        onAutoClose: () => navigate('/'),
      });
    },
  });

  const onSubmit = async (data: VerifyUserDataType) => {
    await verifyMutation.mutateAsync(data);
  };

  const handleSendVerifyEmail = async () => {
    try {
      await authService.getVerifyUser(userDetail.email);
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setCanResend(false);
    }
  };

  useEffect(() => {
    if (canResend) {
      handleSendVerifyEmail();
    }
  }, []);

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
            <Link to={'/'}>
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton variant='soft' color='primary' size='md'>
                  <LogoIcon width='24px' color='#185EA5' />
                </IconButton>
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
            <FormProvider {...methods}>
              <div className='tw-space-y-4'>
                <Typography level='h3' sx={{ textAlign: 'center' }}>
                  Xác thực tài khoản
                </Typography>
                <Typography level='body-md'>
                  Vì lý do bảo mật, một mã xác thực tài khoản gồm 6 chữ số đã được gửi tới:{' '}
                  <Typography variant='soft' sx={{ fontWeight: 600 }}>
                    {userDetail.email}
                  </Typography>{' '}
                  Hãy kiểm tra và làm theo hướng dẫn dưới đây.
                </Typography>
              </div>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <RHFInput<VerifyUserDataType>
                  name='otpCode'
                  label='Nhập mã tại đây:'
                  placeholder='VD: 123456'
                  type='text'
                />
                {/* Submit button */}
                <Button type='submit' fullWidth disabled={!isValid || isSubmitting} loading={isSubmitting}>
                  Xác thực
                </Button>
              </form>
            </FormProvider>
            <div className='tw-flex tw-items-center tw-space-x-1'>
              <Typography level='body-md' component='div'>
                Chưa nhận được mã?
              </Typography>
              {canResend ? (
                <Button size='sm' variant='soft' onClick={() => handleSendVerifyEmail()}>
                  Gửi mã
                </Button>
              ) : (
                <Typography level='body-md' component='div'>
                  Thử lại sau <Timer second={30} onEnd={() => setCanResend(true)} className='tw-inline-block' />
                </Typography>
              )}
            </div>
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

export default VerifyPage;
