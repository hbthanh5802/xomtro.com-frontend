import { Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';

interface ModalLayoutProps {
  isOpen: boolean;
  onCloseModal: (reason?: string) => void;
  children: ReactNode;
  title?: ReactNode | string;
  content?: ReactNode | string;
}

const ModalLayout = (props: ModalLayoutProps) => {
  const { isOpen, onCloseModal, children } = props;

  return (
    <Modal
      aria-labelledby='close-modal-title'
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      open={isOpen}
      onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: 'escapeKeyDown' | 'backdropClick') => {
        onCloseModal(reason);
      }}
    >
      <ModalOverflow>
        <ModalDialog
          aria-labelledby='nested-modal-title'
          aria-describedby='nested-modal-description'
          sx={(theme) => ({
            [theme.breakpoints.only('xs')]: {
              top: 'unset',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: 'none',
              maxWidth: 'unset',
            },
          })}
        >
          <div className={`tw-animate-fade tw-animate-once tw-animate-duration-300 tw-animate-ease-in-out tw-w-fit`}>
            {props?.title && (
              <Typography id='nested-modal-title' level='h2'>
                {props?.title}
              </Typography>
            )}
            {props?.content && (
              <Typography id='nested-modal-description' textColor='text.tertiary'>
                {props?.content}
              </Typography>
            )}
            <ModalClose
              variant='outlined'
              onClick={() => onCloseModal('closeClick')} // Custom lý do closeClick
            />
            {children}
          </div>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
};

export default ModalLayout;
