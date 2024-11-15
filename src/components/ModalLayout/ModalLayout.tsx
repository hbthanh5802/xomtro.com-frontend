import { Modal, ModalClose, Sheet } from '@mui/joy';
import React, { ReactNode } from 'react';

const ModalLayout = (props: { isOpen: boolean; onCloseModal: (reason?: string) => void; children: ReactNode }) => {
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
      <Sheet variant='outlined' sx={{ minWidth: 300, borderRadius: 'md', p: 3 }}>
        <ModalClose
          variant='outlined'
          onClick={() => onCloseModal('closeClick')} // Custom lý do closeClick
        />
        {children}
      </Sheet>
    </Modal>
  );
};

export default ModalLayout;
