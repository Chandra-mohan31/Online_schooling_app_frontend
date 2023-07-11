import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    p: 4,
    border: '1px solid black',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
};

export default function AlertModal({openModal,closeModal,open,alertMessage}) {

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
            justifyContent:"space-evenly"
          }}>
          
            <Typography id="modal-modal-description" sx={{ textAlign:"center" }}>
              {alertMessage}
            </Typography>
            <Button onClick={closeModal} variant='outlined' color='warning' sx={{mt:2}}>Close</Button>
            </Box>
        </Box>
      </Modal>
  );
}