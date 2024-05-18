import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:'30px',
  boxShadow: 29,
  p: 4,
};
export default function TransitionsModal({ open, handleClose, title, description }) {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" 
              variant="h6" component="h2">
                {title}
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                {description}
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }
  