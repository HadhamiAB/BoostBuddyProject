import Modal from 'react-modal';
import '../css/button.css';

const LoginModal = ({ isOpen, onClose, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Login success Message"
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '350px',
                    border: '1px solid #ccc',
                    borderRadius:'50px',
                    background: '#fff',
                    padding: '50px',
                    alignItems:'center',
                    justifyContent:'center',
                }
            }}
        >
            <div>
                <h2>{message}</h2>
                
                
            </div>
        </Modal>
    );
};

export default LoginModal;
