import Modal from 'react-modal';
import { Link } from 'react-router-dom';
const LogoutModal = ({ isOpen, onClose, message  }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="LogOut success Message"
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
                    width: '300px',
                    height: '200px',
                    border: '1px solid #ccc',
                    borderRadius:'50px',
                    background: '#fff',
                    padding: '20px'
                }
            }}
        >   <div>
            <h2>{message}</h2>
         <Link to='/'><button className="btn btn-primary" onClick={onClose}>Close</button></Link>
            </div>
        </Modal>
    );
};

export default LogoutModal;
