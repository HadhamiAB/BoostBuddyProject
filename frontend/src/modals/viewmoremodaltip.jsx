import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import '../css/button.css';
import Divider from '@mui/material/Divider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius:2,
  //borderRadius:'30px',
  pt: 2,
  px: 4,
  pb: 3,
  overflow:'auto'

};

function TipModal({ open, handleClose, title,tip}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="tip-modal-title"
      aria-describedby="tip-modal-description"
    >
      <Box sx={{ ...style, width: 800, height: 600 }}>
        <h2 id="tip-modal-title"  style={{padding:'10px'}}>{title}</h2>
        <Divider />
        <p id="tip-modal-description" style={{padding:'20px'}}>
          {tip}
        </p>
        <button className='space-btn' onClick={handleClose}
        style={{width:'100px', color:'black' , marginLeft:'590px',backgroundColor:'white'}}
        
        >Close</button>
      </Box>
    </Modal>
  );
}

export default function TipElement({title, tip }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p>{tip.substring(0, 160)}...</p>
      <Button onClick={handleOpen}
      style={{color:'black', textDecoration:'underline'}}>View More</Button>
      <TipModal open={open} handleClose={handleClose} title={title} tip={tip} />
    </div>
  );
}
