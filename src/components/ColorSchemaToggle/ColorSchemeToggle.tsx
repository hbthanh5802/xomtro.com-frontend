import { useColorScheme } from '@mui/joy';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const ColorSchemeToggle = (props: IconButtonProps) => {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label='toggle light/dark mode'
      size='md'
      variant='outlined'
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
    </IconButton>
  );
};

export default ColorSchemeToggle;
