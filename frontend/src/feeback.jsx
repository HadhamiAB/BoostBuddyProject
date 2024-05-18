import axios from "axios";
import * as React from 'react';

import { useState } from 'react';
import cookies from 'react-cookies';
import {useNavigate  } from 'react-router-dom';
import Navbar from "./navbar";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './css/sendbuttons.css';
import  './css/sendbtn1.css';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TextField from '@mui/material/TextField';

const Feedback =()=>{
    const navigate = useNavigate();
    const emptyForm=  {
        name:'',
        email:'',
       // contactNumber:'',
        comment:'',
    };
    const [formdata  , setFormdata]=useState(emptyForm);
    const [feedbackalert  , setfeedbackalert]=React.useState({ severity: '', message: '' });
    const handleinput =(event)=>{
        const {name , value}= event.target;
        setFormdata({ ...formdata, [name]: value });
    }
    const apiurl='http://127.0.0.1:8000/feedbackapi/addfeedback/';
    const sendFeedback=(event)=>{
        event.preventDefault();
        document.getElementById('send').checked = true; 
        const csrftoken = cookies.load('csrftoken');
        console.log(formdata);
        axios.post(apiurl, formdata, {
            withCredentials:true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        }).then((response)=>{
            const data= response.data;
            console.log("Success",data);
            setfeedbackalert({ severity: 'success', message: 'Thank you for your feedback !' })

            setFormdata(emptyForm);
            setTimeout(() => {
            navigate('/');},5000);
        }).catch((error) => {
            console.error("Error", error);
            setfeedbackalert({ severity: 'error', message: 'Failed to send feedback !' })

        }); };

          
    return(
        <>  
            <Navbar />
            <div className="container" style={styles.pageContainer}>
             
                <div className="form-container" style={styles.formContainer}>
                    <h1 style={{ textAlign:'center', color: 'black' ,      marginBottom: '10px',
                      }}>Leave a feedback</h1> 
                    <form onSubmit={sendFeedback} style={styles.form} method="post" id='myForm'>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="name" style={{ fontSize: '18px', color: 'black' ,marginRight:'19px'}}>
                              <DriveFileRenameOutlineIcon style={{ fontSize: '20px', color: 'black',marginRight:'10px',marginTop:'10px'}} />
                              Name </label>
                              <TextField id="outlined-basic" 
                              label="Name" variant="outlined" placeholder='Name' className="form-control"
                              value={formdata.name} name="name"
                              onChange={handleinput}
                              style={{
                                  padding: '10px',
                                  fontSize: '16px',
                                  width:'77%',

                              }}/>
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="email" style={{ fontSize: '18px', color: 'black' ,marginRight:'24px'}}>
                              <AlternateEmailIcon style={{ fontSize: '20px', color: 'black',marginRight:'10px',marginTop:'10px'}} />
                              Email </label>
                            <TextField
                            id="outlined-basic" 
                            label="Email" variant="outlined"
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder='Email'
                                value={formdata.email}
                                onChange={handleinput}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    width:'77%',

                                }}
                            />
                        </div> 
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="contactNumber" style={{ fontSize: '18px', color: 'black' }}>
                              <ContactPhoneIcon style={{ fontSize: '20px', color: 'black',marginRight:'10px',marginTop:'10px'}} />
                              Number  </label>
                            <TextField
                            id="outlined-basic" 
                            label="Number" variant="outlined"
                                type="tel"
                                className="form-control"
                                name="contactNumber"
                                placeholder='Contact Number'
                                value={formdata.contactNumber}
                                onChange={handleinput}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    width:'77%',
                                }}
                            />
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="comment" style={{ fontSize: '18px', color: 'black', display:'flex',justifyContent:'left',
                          }}>Feedback <RateReviewIcon style={{ fontSize: '20px', color: 'black',marginLeft:'10px',marginTop:'5px'}}/> </label>
                            <TextField
                                type="text"
                                className="form-control"
                                id="outlined-basic" 
                            label="Feedback" variant="outlined"
                                name="comment"
                                placeholder='Did you find the platform helpful ? Do you have any suggestions ? '
                                value={formdata.comment}
                                onChange={handleinput}
                                multiline
                                rows={3}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                   height: '100px',
                                   width:'100%',

                                }}
                            />
                        </div>
                        
                        <button type="submit" className="space-btn" onClick={sendFeedback}
                              style={{
                                  color: '#2E1A47',
                                  padding: '10px 20px',
                                  marginLeft: '16px',
                                  marginTop: '16px',
                                  borderRadius: '5px',
                                  cursor: 'pointer'
                              }}>
                              Send Feedback
                          </button>
                        <input type="checkbox" name="send" id="send" />
                        <label htmlFor="send" className="send">
                            <div className="rotate">
                                <div className="move">
                                    <div className="part left"></div>
                                    <div className="part right"></div> 
                                </div> 
                            </div> 
                        </label>
                        <Stack sx={{ width: '100%',marginTop: '16px', }} spacing={2}>
                            {feedbackalert.message && (
                                <Alert variant="filled" severity={feedbackalert.severity}>
                                    {feedbackalert.message}
                                </Alert> 
                            )}  
                        </Stack> 
                    </form> 
                </div> 
                </div>
        </>
    );
    
    
};
const styles = {
    pageContainer: {
      background: `url(./src/assets/star.gif) no-repeat , url(./src/assets/feedback.gif) no-repeat`,
      backgroundPosition: 'top left, right bottom',
      backgroundSize: '200px 250px ,500px 250px', 
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      //width:  '700px',
      margin :'0',
    },
    formContainer: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      width: '550px',
      height: '620px',
      marginTop :'0px',
      marginLeft :'00px',

    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '500px',

    },
    formGroup: {
      marginBottom: '10px',
  },
  formControl: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
  },
  label: {
      fontSize: '18px',
      color: '#333',
      marginBottom: '10px',
  },
    contentinput:{
        width :'500px',
        height :'100px',
    }
};
export default Feedback;