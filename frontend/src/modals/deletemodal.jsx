import Modal from 'react-modal';

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Confirmation"
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                },
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '270px',
                    border: '1px solid #ccc',
                    borderRadius:'50px',
                    background: '#fff',
                    padding: '20px'
                }
            }}
        >
            <h2 style={{marginTop:'10px',marginBottom:'10px', textAlign:'center'}}>Are you sure you want to delete this ?</h2>
 <h4 style={{marginTop:'10px',marginBottom:'10px', textAlign:'center'}}></h4>
            <div style={{display:'flex', flexDirection:'row' , justifyContent:'center', marginTop:'50px'}}>
            <button  className="space-btn" 
            style={{backgroundColor:'#782dfc', color:'white', 
            padding:'5px' , marginTop:'', marginBottom:'',marginLeft:'0px', marginRight:''
        ,width:'90px',height:'40px',border:'2px solid black',borderRadius:'10px'
        }}
            onClick={onDelete}>Delete</button>
                <button className="space-btn" onClick={onClose}
                style={{backgroundColor:'#782dfc', color:'white', 
                padding:'5px' , marginTop:'', marginBottom:'',marginLeft:'40px', marginRight:'20px'
                ,width:'90px',height:'40px',border:'2px solid black',borderRadius:'10px'}}
                >Cancel</button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
