import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export function SuccessModal({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <Box sx={{  width: 250, height: 150 }}>
        <h2 id="success-modal-title">Success!</h2>
        <p id="success-modal-description">
          Your document was added successfully.
        </p>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
}
