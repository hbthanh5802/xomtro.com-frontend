import LogoIcon from '@/assets/LogoIcon';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import RegisterForm from '@/pages/RegisterPage/RegisterForm';
import { Divider, IconButton } from '@mui/joy';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Link } from 'react-router-dom';

export default function JoySignInSideTemplate() {
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
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component='h1' level='h3'>
                  Tạo tài khoản mới
                </Typography>
                <Typography level='body-sm'>
                  Đã có tài khoản?{' '}
                  <Link to='/auth/login'>
                    <Typography
                      level='body-sm'
                      textColor={'primary.600'}
                      sx={{
                        fontWeight: '500',
                      }}
                    >
                      Đăng nhập ngay!
                    </Typography>
                  </Link>
                </Typography>
              </Stack>
              <GoogleAuthButton />
            </Stack>
            <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector('light')]: {
                  color: { xs: '#FFF', md: 'text.tertiary' },
                },
              })}
            >
              or
            </Divider>
            {/* Register Form */}
            <RegisterForm />
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
}
