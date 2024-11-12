import LogoIcon from '@/assets/LogoIcon';
import RHFRoleChoices from '@/components/RHFRoleChoices';
import useUrl from '@/hooks/useUrl.hook';
import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { userRoleDataType } from '@/types/user.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { updateUserRoleValidation } from '@/validations/auth.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, IconButton, Typography } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RolePage = () => {
  const {
    state: { userDetail },
  } = useUrl();
  if (!userDetail) {
    toast.error('Có lỗi xảy ra. Vui lòng thử lại sau');
    return <>Forbidden</>;
  }
  const navigate = useNavigate();
  const [canResend, setCanResend] = useState(false);

  const methods = useForm({
    resolver: zodResolver(updateUserRoleValidation),
  });
  const { isValid, isSubmitting } = methods.formState;

  const verifyMutation = useMutation({
    mutationFn: (data: userRoleDataType) => userService.updateUserDetail(data),
    onError: () => {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      methods.resetField('otpCode');
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success('Xác thực thành công. Trang sẽ chuyển hướng ngay sau thông báo này.', {
        duration: 1500,
        onAutoClose: () => {
          toast.success('Xác thực thành công. Trang sẽ chuyển hướng ngay sau thông báo này.', {
            duration: 1000,
            onAutoClose: () => {
              if (!userDetail.role) {
                navigate('/auth/role', {
                  state: {
                    userDetail,
                  },
                });
              } else if (!userDetail.isEmailVerified) {
                navigate('/auth/verify', {
                  state: {
                    userDetail,
                  },
                });
              } else {
                navigate('/');
              }
            },
          });
        },
      });
    },
  });

  const onSubmit = async (data: userRoleDataType) => {
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
                  Xin Chào,{' '}
                  <Typography variant='soft' sx={{ fontWeight: 600 }}>
                    {`${userDetail.firstName} ${userDetail.lastName}`}
                  </Typography>
                </Typography>
                <Typography level='body-md'>
                  Hãy cho chúng tôi biết mục đích lựa chọn của bạn. Vui lòng làm theo hưỡng dẫn sau đây:
                </Typography>
              </div>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <RHFRoleChoices<userRoleDataType> name='role' label='Lựa chọn vai trò:' />
                {/* Submit button */}
                <Button type='submit' fullWidth disabled={!isValid || isSubmitting} loading={isSubmitting}>
                  Xác nhận
                </Button>
              </form>
            </FormProvider>
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

export default RolePage;
