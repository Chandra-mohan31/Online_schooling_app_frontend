import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    p: 4,
    // border: '1px solid white',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '15px',
};

export default function GeneralModal({closeModal,open,children}) {

  return (
      <Modal
        open={open}
        onClose={closeModal}
        
        
      >
        <Box sx={style}>
          <Box sx={{
            display: "flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center"
          }}>
          <IconButton onClick={closeModal} sx={{
            alignSelf:"flex-end"
          }}>
            <ClearIcon />
          </IconButton>
           {children}
            
            </Box>
        </Box>
      </Modal>
  );
}