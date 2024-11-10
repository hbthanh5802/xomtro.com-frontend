import CustomRouter from '@/components/CustomRouter/CustomRouter.tsx';
import history from '@/utils/history.helper.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomRouter history={history}>
      <App />
    </CustomRouter>
  </StrictMode>,
);
