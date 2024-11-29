import { DialogTitle, Drawer, DrawerProps, ModalClose } from '@mui/joy';
import { ReactNode } from 'react';

interface DrawerWrapperProps {
  closeButton?: boolean;
  children?: ReactNode;
  title?: ReactNode;
}

const DrawerWrapper = (props: DrawerWrapperProps & DrawerProps) => {
  const { closeButton, children, title, ...other } = props;
  return (
    <Drawer {...other}>
      {closeButton && <ModalClose />}
      {title && <DialogTitle>{title}</DialogTitle>}
      {children}
    </Drawer>
  );
};

export default DrawerWrapper;
