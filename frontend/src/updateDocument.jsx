import Navbar from "./navbar";
import * as React from 'react';
import axios from "axios";
import { useEffect} from 'react';
import cookies from 'react-cookies';
import {useNavigate, useParams} from 'react-router-dom';
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
import backgroundImage from './assets/addbg.jpg'; 
import gif from './assets/add.gif';
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
const UpdateDocuments=()=>{
    const navigate = useNavigate();
    const { id } = useParams();
    const emptyForm={
        title: '',
        type: '', 
        content: '',
        date_added: '',    
        speciality:'', 
        subject_name: '', 
        year: '', 
        file: [], 
         };
           const [formdata , setformdata]=React.useState(emptyForm);
           const [updatealert, setupdateAlert] = React.useState({ severity: '', message: '' });

           useEffect(() => {
            fetchDocumentData(id); 
        }, [id]);
          const fetchDocumentData = (id) => {      
            const apiUrl =`http://127.0.0.1:8000/apimanagedocuments/update/${id}/`;    
            axios.get(apiUrl)
            .then((response) => {
                const documentData = response.data;
                setformdata(documentData);
            })
            .catch((error) => {
                console.error("Error fetching document data:", error);
            });
    };    
    const updateDocument = () => {
        const apiUrl = `http://127.0.0.1:8000/apimanagedocuments/update/${id}/`;
        const csrftoken = cookies.load('csrftoken');
        event.preventDefault();

          const formData = new FormData();  
          for (const key in formdata) {  
            if (formdata[key] instanceof Array && formdata[key].length > 0) { 
                formdata[key].forEach((file) => formData.append(key, file));  
            } else if (key !== 'file') {  
                formData.append(key, formdata[key]);
            }
          }
          axios.put(apiUrl, formData , { // Changed from formdata to formData
              withCredentials:true,
                  headers: {
                      'Content-Type':'multipart/form-data',
                      'X-CSRFToken': csrftoken,
                      'Authorization': `Token ${localStorage.getItem('token')}`

              },
          }).then((response) => {
              console.log("Success", response.data);
              //alert("Document updated successfully!");
              setupdateAlert({ severity: 'success', message: 'Document updated successfully !' });     

              setTimeout(() => {
                navigate('/managedocuments');
              }, 3000);             })
          
          .catch((error) => {
              console.error("Error updating document:", error);
              setupdateAlert({ severity: 'error', message: 'Failed to update document.' });

          });
      };
    const handleInput = (event) => {
        const { name, value, type, files  } = event.target;
        if (type === 'file') {
        // Handle multiple files
        const filesArray = Array.from(files);
        setformdata({ ...formdata, [name]: filesArray });    
        } else {
        // Handle undefined or null values
        const newValue = value !== undefined ? value : '';
        setformdata({ ...formdata, [name]: newValue });
    }       
};
    return (
        <>
        <Navbar />
        <div style={styles.pageContainer}>

    <form onSubmit={updateDocument} style={styles.formContainer}>
  
  
      <img src={gif} alt="gif" style={{height:'100px',marginTop:'-10px',marginLeft:'620px'}}/>
    <h2 style={styles.h1} >
      
      Update Document

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
                  value={formdata.year}
                  onChange={handleInput}
                  style={styles.input}
                  //inputProps={{ min: "2014", max: "2024" }}
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
                  Update Document
                </button>
              </div>
              <Stack sx={{ width: '60%' , marginTop:'-110px'}} spacing={2}>
  {updatealert.message && (
    <Alert variant="filled" severity={updatealert.severity}>
      {updatealert.message}
    </Alert>
  )}
</Stack>
            </form>
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'right ',
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
export default UpdateDocuments;