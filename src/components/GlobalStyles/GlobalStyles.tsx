import { CssBaseline, CssVarsProvider, extendTheme, GlobalStyles as MuiGlobalStyles } from '@mui/joy';
import React, { ReactNode } from 'react';
import './GlobalStyles.css';

interface GlobalStylesTypeProps {
  children: ReactNode;
}

const customTheme = extendTheme();

const GlobalStyles: React.FC<GlobalStylesTypeProps> = ({ children }) => {
  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <MuiGlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '1000px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
      <div>{children}</div>
      <CssBaseline />
    </CssVarsProvider>
  );
};

export default GlobalStyles;
