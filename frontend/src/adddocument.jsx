import * as React from 'react';
import axios from "axios";
import Navbar from './navbar.jsx';
import cookies from 'react-cookies';
import {useNavigate  } from 'react-router-dom';
import { useAuth } from './authContext.jsx';
import TitleIcon from '@mui/icons-material/Title';
import SubjectIcon from '@mui/icons-material/Subject';
import SourceIcon from '@mui/icons-material/Source';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import TodayIcon from '@mui/icons-material/Today';
import './css/button.css';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const AddDocument=() =>{
  const navigate = useNavigate();

  const { authenticated } = useAuth();
    const emptyForm={
        title: '',
        type: '', 
        content: '',
        date_added: new Date().toISOString().split('T')[0],    
        speciality:'', 
        subject_name: '', 
        year: '', 
        file: [], 
         };
    const [formdata , setformdata]=React.useState(emptyForm);
    const [alert, setAlert] = React.useState({ severity: '', message: '' });
    const [snackbarState, setSnackbarState] = React.useState({
      open: false,
      vertical: 'top',
      horizontal: 'right',
      message: ''
    });
    const { vertical, horizontal, open, message } = snackbarState;
    const handleSnackbarClose = () => {
      setSnackbarState({ ...snackbarState, open: false });
    };
        const handleInput = (event) => {
            const { name, value, type, files  } = event.target;
            if (type === 'file') {
              // Handle multiple files
              setformdata({ ...formdata, [name]: files });
            } else {
              setformdata({ ...formdata, [name]: value });
            }
          };
          
       const apiUrl = 'http://127.0.0.1:8000/apimanagedocuments/add/';
       const csrftoken = cookies.load('csrftoken');

       const addDocument =(event)=>{
               event.preventDefault();
               // To handle multiple files adding
               const formData = new FormData();
               formData.append('title', formdata.title);
               formData.append('type', formdata.type);
               formData.append('content', formdata.content);
               formData.append('date_added', formdata.date_added);
               formData.append('speciality', formdata.speciality);
               formData.append('subject_name', formdata.subject_name);
               formData.append('year', formdata.year);
           
               // Append each file to the FormData
               for (const file of formdata.file) {
                formData.append('file', file);
              }   
               axios.post(apiUrl, formData ,  {
                 withCredentials: true,
                 headers: {
                      'X-CSRFToken': csrftoken,
                     'Content-Type': 'multipart/form-data',
                     'Authorization': `Token ${localStorage.getItem('token')}`

                 },
             })
             .then((response) => {
              const data = response.data;
              console.log("Success", data); 
                 localStorage.setItem('documentId', response.data.id);
                 console.log(localStorage.getItem('documentId'));
                 handleAddClick();
                 setAlert({ severity: 'success', message: 'Your Document was added successfully!' });     
                 setSnackbarState({ open: true, vertical: 'top', horizontal: 'center', message: '+1' });

                  setformdata(emptyForm);

                  setTimeout(() => {
                    navigate('/managedocuments');
                  }, 5000);             })
             .catch((error) => {
                 console.error("Error", error);
                 setAlert({ severity: 'error', message: 'Failed to add document.' });

             }); };
             const handleAddClick = async () => {
              const documentId = localStorage.getItem('documentId');
              const csrftoken = cookies.load('csrftoken');
              if (authenticated && documentId) {
                try {
                  const response = await axios.post(
                    `http://127.0.0.1:8000/apimanagedocuments/updateaddpoints/${documentId}/`,
                    { documentId: documentId },
                    {
                      withCredentials: true,
                      headers: {
                        'X-CSRFToken': csrftoken,
                        'Authorization': `Token  ${localStorage.getItem('token')}`
                      },
                    }
                  );
                  console.log("Update Success", response);
                } catch (error) {
                  console.error("Update Error", error);
                }
              } else {
                console.log("User is not authenticated or document ID is not available");
              }
            };
            
             return (
              <>
              <Navbar />
              <div style={styles.pageContainer}>

          <form onSubmit={addDocument} style={styles.formContainer}>
        
            <img src="./src/assets/add.gif" alt="gif" style={{height:'100px',marginTop:'-10px',marginLeft:'620px'}}/>
            <h2 style={styles.h1} >
            
            Add a Document

            </h2>
          <div className="form-group" style={{...styles.formGroup,...styles.title}}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TitleIcon sx={{ mr: 1, my: 0.5 }} />
        <TextField id="input-with-sx" label="Title" 
        variant="standard" name="title" value={formdata.title}
        onChange={handleInput} style={styles.input}
        />
      </Box>
                    </div>
                    <div className="form-group" style={{...styles.formGroup,...styles.date}}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <MoreTimeIcon sx={{ mr: 1, my: 0.5 }} />
                    <TextField
                      id="date_added"
                      label="Date Added"
                      type="date"
                      variant="standard"
                      name="date_added"
                      value={formdata.date_added}
                      onChange={handleInput}
                      style={styles.input}
                    />
                  </Box>
                </div>
                    <div className="form-group" style={styles.formGroup}>
                      <select
                        id="type"
                        name="type"
                        value={formdata.type}
                        onChange={handleInput}
                        required
                        style={styles.select}
                      >
                        <option value="">Select Type</option>
                        <option value="exam">Exam</option>
                        <option value="summary">Summary</option>
                        <option value="course">Course</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group" style={{...styles.formGroup,...styles.yearcss}}>
                      <select
                        id="speciality"
                        name="speciality"
                        value={formdata.speciality}
                        onChange={handleInput}
                        required
                        style={styles.select}
                      >
                        <option value="">Select Speciality</option>
                        <option value="informatique">Informatique De Gestion</option>
                        <option value="science_gestion">Science De Gestion</option>
                        <option value="economie">Economie</option>
                        <option value="master_pro">Master Professionnels</option>
                        <option value="master_recherche">Master De Recherche </option>
                      </select>
                    </div>
                    <div className="form-group" style={{...styles.formGroup,...styles.yearcss2}}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <TodayIcon sx={{ mr: 1, my: 0.5 }} />
                      <TextField
                        id="year"
                        label="Year"
                        type="number"
                        variant="standard"
                        name="year"
                        onChange={handleInput}
                        value={formdata.year}

                        style={styles.input}
                        inputProps={{ min: "2014", max: "2024" }}
                      />
                    </Box>
                  </div>
 
                    <div className="form-group" style={{...styles.formGroup,...styles.yearcss1}}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <SubjectIcon sx={{ mr: 1, my: 0.5 }} />
                      <TextField
                        id="subject_name"
                        label="Subject Name"
                        variant="standard"
                        name="subject_name"
                        value={formdata.subject_name}
                        onChange={handleInput}
                        style={styles.input}
                      />
                    </Box>
                  </div>
                    <div className="form-group" style={styles.formGroup}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <SourceIcon sx={{ mr: 1, my: 0.5 }} />
                    <TextField
                      id="content"
                      label="Content Description"
                      variant="standard"
                      name="content"
                      placeholder='Provide more details about the document added and share links to ressources that can help understand these documents better'
                      value={formdata.content}
                      onChange={handleInput}
                      style={styles.input}
                      multiline
                      rows={3}
                    />
                  </Box>
                </div>
                    <div className="form-group" style={styles.formGroup}>
                    <Tooltip title="You can select one or multiple files ">
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={{width:'30%',marginLeft:'20px'
                    ,backgroundColor:'#782DFC', marginBottom:'55px',marginTop:'25px'}}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      id="file"
                      name="file"
                      accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .ppt, .pptx" 
                      onChange={handleInput}
                      multiple
                      required
                    />
                  </Button>    
</Tooltip>
                </div>
                    <div className="container">
                    <button type="submit" className="button" style={styles.btn}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Add Document
                      </button>
                    </div>
                    <Stack sx={{ width: '60%' , marginTop:'-110px'}} spacing={2}>
        {alert.message && (
          <Alert variant="filled" severity={alert.severity}>
            {alert.message}
          </Alert>
        )}
      </Stack>
                  </form>
                  <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
    </div>
    </>
            );
};
const styles = {
  h1:{
    textAlign:'left',
    marginBottom:'50px',
    marginTop :'-60px',
    marginLeft :'50px',
    fontFamily: 'Arial',
    color:'black',
    fontWeight:'bold',
    fontSize:'30px',
    
  },

  pageContainer: {
    backgroundImage: `url(src/assets/addbg.jpg)`,
    backgroundPosition: 'right bottom',
    backgroundRepeat: 'no-repeat', 
    backgroundSize: '950px 650px', 
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    height: '100%',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    width:  '100%',
    margin :'0',
  },
  formContainer: {
    background: 'white',
    padding: '10px',
    borderRadius: '50px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    width: '800px',
    height: '720px',
    marginTop :'20px',
    marginBottom :'70px',
    marginLeft:'80px',

  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  formGroup: {
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    width: '94%',
    marginLeft:'10px',
  },

  select: {
    width: '45%',
    padding: '10px',
    borderRadius: '5px',
    marginLeft:'30px',
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '0px',
  },
  title:{
    width:'45%',
    marginLeft:'10px',
    //marginTop:'-82px',

  },
  date:{
    width:'45%',
    marginLeft:'390px',
    marginTop:'-82px',

  },
  yearcss:{
    width:'92%',
    marginLeft:'390px',
    marginTop:'-82px',

  },
  yearcss1:{
    width:'45%',
    marginLeft:'390px',
    marginTop:'-90px',

  },
  yearcss2:{
    width:'45%',
    marginLeft:'20px',
    //marginTop:'-90px',

  },
  contentinput:{
      width :'750px',
      height :'100px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize:'16px',
  },
  btn:{
    marginTop :'-155px',
    marginLeft :'540px',
    marginBottom :'40px',
    width:'200px',
    color:'white',
    backgroundColor:'#782DFC'
  },
}; 
 export default AddDocument;
