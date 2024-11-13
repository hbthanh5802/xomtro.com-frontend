import GoogleIcon from '@/assets/GoogleIcon';
import authService from '@/services/auth.service';
import { useAppStore } from '@/store/store';
import { Button } from '@mui/joy';
import { useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const GoogleAuthButton: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, setAccessToken } = useAppStore(
    useShallow((state) => ({
      setCurrentUser: state.setCurrentUser,
      setAccessToken: state.setAccessToken,
    })),
  );

  const handleGoogleAuth = async (credential: string) => {
    const toastId = toast.loading('Vui lòng chờ');
    setLoading(true);
    try {
      const response = await authService.googleAuth({ credential });
      const {
        userDetail,
        meta: { accessToken },
      } = response.data;
      setCurrentUser(userDetail);
      setAccessToken(accessToken);
      toast.success('Thành công! Bạn sẽ được chuyển hướng ngay sau đó', {
        duration: 1500,
        id: toastId,
      });
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
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!', {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      const { access_token } = response;
      if (!access_token) {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      } else {
        handleGoogleAuth(access_token);
      }
    },
    onError: () => console.log('Login failed!'),
  });

  return (
    <Button
      variant='soft'
      color='neutral'
      fullWidth
      startDecorator={<GoogleIcon width='40px' />}
      onClick={() => login()}
      loading={loading}
      disabled={loading}
    >
      Tiếp tục với Google
    </Button>
  );
};

export default GoogleAuthButton;
