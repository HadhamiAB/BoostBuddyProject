import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import axios from 'axios';
import cookies from 'react-cookies';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import  '../css/sendbtn1.css';
import TextField from '@mui/material/TextField';

//import { useNavigate } from 'react-router-dom';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  height:460,
  bgcolor: 'white', 
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  p: 4,
};


  export default function NestedADDModal() {
    const [open, setOpen] = React.useState(false);
    const emptyForm={
      title: '',
      tip: '', 
       };
    const [alerttip, setAlertTip] = React.useState({ severity: '', message: '' });
    const [formdata , setformdata]=React.useState(emptyForm);

  //  const navigate = useNavigate();
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setformdata(emptyForm);
      };
    

    
      const handleAdd = async (event) => {
        event.preventDefault();
        const apiUrl = 'http://127.0.0.1:8000/mindmattersapi/addtip/';
        const csrftoken = cookies.load('csrftoken');
        try{ 
       const response =await axios.post(apiUrl, formdata, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          });
          const TipData = response.data;
          console.log("Success", TipData);
          setformdata(emptyForm);
          setAlertTip({ severity: 'success', message: 'Your Tip was added successfully!' });     

        }catch(error){
          console.error("Error", error);
          setAlertTip({ severity: 'error', message: 'Failed to add Tip.' });

        }};
  return (
    <div >
     <Button onClick={handleOpen} >
     <AddCircleOutlinedIcon 
        style={{fontSize: 55 ,marginTop:'30px',marginLeft:'40px', 
        backgroundColor:'transparent' ,  color:' black',
      }} />
        </Button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <h2 id="parent-modal-title" style={{textAlign:'center'}}>Add a Tip</h2>
          <form onSubmit={handleAdd} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <label style={{ fontSize:"18px", color:"black" }}>
                            Title: </label>
                          <TextField id="outlined-basic"
                          label="Write the topic name for the tip" 
                          variant="outlined"
                          value={formdata.title}
                          onChange={(e) => setformdata({...formdata,
                             title: e.target.value})}
                             name="title" 

                          />

             <label style={{ fontSize:"18px", color:"black", marginRight:'10px' }}>
                            Tip: </label>
                            <TextField
                            id="outlined"
                            label="Insert your tip here"
                            multiline
                            onChange={(e) => setformdata({...formdata, tip: e.target.value})}   
                        value={formdata.tip} 
                        name="tip" 
                        //style={{overflow:'auto'}}
                        maxRows={3}
                        />
            
                       
                        <div style={{width:'400px',display:'flex',flexDirection:'row',justifyContent:'center', marginTop:'20px'}}>
            <Button type="submit" className='space-btn' style={{width:'100px',
            color:'#2E1A47',marginLeft:'0px',marginRight:'60px'}}>Add</Button>
            <Button onClick={handleClose} className='space-btn' style={{width:'100px',color:'#2E1A47'}}>Cancel</Button>
          </div>  <Stack sx={{ width: '100%' }} spacing={2}>
        {alerttip.message && (
          <Alert variant="filled" severity={alerttip.severity}>
            {alerttip.message}
          </Alert>
        )}
      </Stack>
          </form>
        </Box>

      </Modal>

    </div>
  );
}