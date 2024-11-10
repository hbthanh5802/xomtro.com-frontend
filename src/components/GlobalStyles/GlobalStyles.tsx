import { CssBaseline, CssVarsProvider } from '@mui/joy';
import React, { ReactNode } from 'react';
import './GlobalStyles.css';

interface GlobalStylesType {
  children: ReactNode;
}

const GlobalStyles: React.FC<GlobalStylesType> = ({ children }) => {
  return (
    <CssVarsProvider>
      <div>{children}</div>
      <CssBaseline />
    </CssVarsProvider>
  );
};

export default GlobalStyles;
