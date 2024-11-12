import CustomRouter from '@/components/CustomRouter/CustomRouter.tsx';
import { env } from '@/configs/environment.config.ts';
import history from '@/utils/history.helper.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomRouter history={history}>
      <Toaster expand richColors />
      <GoogleOAuthProvider clientId={env.GG_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </CustomRouter>
  </StrictMode>,
);
