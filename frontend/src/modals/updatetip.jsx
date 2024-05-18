import { useState ,useEffect} from 'react';
import * as React from 'react';
import axios  from "axios";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import  '../css/sendbtn1.css';
import Button from '@mui/material/Button';
import cookies from 'react-cookies';

import TextField from '@mui/material/TextField';


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
  export default function NestedUpdateModal({selectedTipId , open, setOpen}) {
    const emptyForm={
        title: '',
        tip: '', 
         };
    const [formdata , setformdata]=useState(emptyForm);

    const [updatealerttip, setupdatealerttip] = React.useState({ severity: '', message: '' });

    const handleClose = () => {
      setOpen(false);
    }; 
      const fetchTipData = (selectedTipId) => {     
       
        const apiUrl =`http://127.0.0.1:8000/mindmattersapi/update/${selectedTipId}/`;    
         axios.get(apiUrl)
          .then((response) => {
            console.log("success",response.data)
            const TipData = response.data;
            setformdata(TipData);
      }).catch ((error) =>{
        console.error("Error fetching Tip's data:", error);
      });
   
    }
    useEffect(() => {
      if (open) {
        fetchTipData(selectedTipId);
      }
    }, [selectedTipId, open]);
    
      const updateTip =async  () => {
        const apiUrl = `http://127.0.0.1:8000/mindmattersapi/update/${selectedTipId}/`;
        const csrftoken = cookies.load('csrftoken');  
      
        try {
          event.preventDefault();

          const response = await  axios.put(apiUrl, formdata , { 
              withCredentials:true,
                  headers: {
                      'Content-Type':'multipart/form-data',
                      'X-CSRFToken': csrftoken,
                      'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                  });
                  console.log("Success", response.data);
                  setupdatealerttip({ severity: 'success', message: 'Tip updated successfully!' });
                } catch (error) {
                  console.error("Error updating ", error)
                  setupdatealerttip({ severity: 'error', message: 'Error updating tip!' });
                }
              };
      
     const handleInput = (event) => {
      const { name, value } = event.target;
      setformdata({...formdata, [name]: value });
    };
    
        
  return (
    <div style={{backgroundColor:'transparent'}}>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <h2 id="parent-modal-title" style={{textAlign:'center'}}>Update Tip</h2>
          <form onSubmit={updateTip} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <label style={{ fontSize:"18px", color:"black" }}>
                            Title: </label>
          <TextField id="outlined-basic"
                          name="title"
                          label="Write the topic name for the tip" 
                          variant="outlined"
                          value={formdata.title}
                          onChange={handleInput}
                            /> 
             <label style={{ fontSize:"18px", color:"black", marginRight:'10px' }}>
                            Tip: </label>
                            <TextField  
                                id="outlined"
                                label="Insert your tip here"
                                multiline
                                name="tip" 
                                value={formdata.tip}
                                onChange={handleInput}
                                maxRows={3}
                            />
                        <div style={{width:'400px',display:'flex',flexDirection:'row',justifyContent:'center', marginTop:'20px'}}>
            <Button type="submit" className='space-btn' style={{width:'100px',
            color:'#2E1A47',marginLeft:'0px',marginRight:'60px'}}>Update</Button>
            <Button onClick={handleClose}
             className='space-btn'
              style={{width:'100px',color:'#2E1A47'}}>Cancel</Button>
          </div>  <Stack sx={{ width: '100%' }} spacing={2}>
        {updatealerttip.message && (
          <Alert variant="filled" severity={updatealerttip.severity}>
            {updatealerttip.message}
          </Alert>
        )}
      </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}  