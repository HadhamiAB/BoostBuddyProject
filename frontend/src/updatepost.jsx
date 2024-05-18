import Navbar from "./navbar";
import { useState , useEffect} from "react";
import axios from "axios";
import cookies from 'react-cookies';
import {useNavigate, useParams } from 'react-router-dom';
import {Link } from 'react-router-dom';
import * as React from 'react';
import TitleIcon from '@mui/icons-material/Title';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import EventIcon from '@mui/icons-material/Event';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './css/button.css';
import './css/sendbtn1.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PropTypes from 'prop-types';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import BusinessIcon from '@mui/icons-material/Business';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import backgroundImage from './assets/IE.png'; 
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,#B293D7 0%, #782DFC 50%, #782DFC 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,#B293D7 0%, #782DFC 50%, #782DFC 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, #B293D7 0%, #782DFC 50%, #782DFC 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, #B293D7 0%, #782DFC 50%, #782DFC 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <BusinessIcon />,
    2: <PostAddIcon />,
    3: <AddReactionIcon />,
    4: <FilePresentIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};


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
const UpdatePosts=()=>{
    const navigate = useNavigate();
    const { id } = useParams();
    const emptyForm={
        title:'' ,
        companyName :'', 
        location :'',
        contactInformation:'',
        startDate :'',
        endDate :'', 
        description:'', 
        skillsGained:'' ,
        report :[],
}
const [formdata , setformdata]=useState(emptyForm);
const [activeStep, setActiveStep] = React.useState(0);
const [updatealertStatus, setupdateAlertStatus] = React.useState({ severity: '', message: '' });
const steps = ['Company Information', 'Internship ', 'Skills Gained', 'Upload Report'];

const handleNext = () => {
  console.log(formdata);

  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const handleBack = () => {
  console.log(formdata);

  setActiveStep((prevActiveStep) => prevActiveStep - 1);
};

useEffect(() => {
    fetchPostData(id); 
}, [id]);
const fetchPostData = (id) => {      
    const apiUrl =`http://127.0.0.1:8000/apimanageinternships/updateIE/${id}/`;    
    axios.get(apiUrl)
    .then((response) => {
        const postData = response.data;
        setformdata(postData);
    })
    .catch((error) => {
        console.error("Error fetching post data:", error);
    });
}; 
const editPost=()=>{   
  const apiUrl =`http://127.0.0.1:8000/apimanageinternships/updateIE/${id}/`;    
  const csrftoken = cookies.load('csrftoken');
  event.preventDefault();

  // Create a new FormData instance
  // Append all form data to it
  const formData = new FormData(); // used to send formdata understandble by server
  for (const key in formdata) { // iterate over fields 
    if (formdata[key] instanceof Array && formdata[key].length > 0) { //check if report is selected or not cuz it's an array field
        formdata[key].forEach((file) => formData.append(key, file)); //appending to data cuz there could be multiple files added
    } else if (key !== 'report') { //skip the field report when no update /file was selected/made
        formData.append(key, formdata[key]);
    }
}

  axios.put(apiUrl, formData,{
 
      withCredentials: true,
      headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrftoken,
          'Authorization': `Token ${localStorage.getItem('token')}`

      },
  })
  .then((response) => {
      console.log("Success", response.data);
      setupdateAlertStatus({ severity: 'success', message: 'Post updated successfully!' });     

      //alert("Post  successfully!");
      setTimeout(() => {   navigate('/manageIE'); }, 3000); 
  })
  .catch((error) => {
      console.error("Error updating post:", error);
      setupdateAlertStatus({ severity: 'error', message: 'Failed to update post.' });

  });
};
const handleInput=(event) =>{
    const{name,value, type, files }=event.target;
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

// style={styles.pageContainer}

    return(
    <>
    <Navbar />
    <div className="container" style={styles.pageContainer}>
    <Stack sx={{ width: '100%' }} spacing={4}>
    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
        <form onSubmit={editPost} style={styles.form}>
        {activeStep === 0 && (
      <>
        <div className="form-group" style={styles.formGroup}>
    
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TitleIcon sx={{ mr: 1, my: 3.2 }} />
        <TextField id="outlined-basic" label="Title"
         placeholder="What position did you fullfil at the company ?"
        variant="outlined" name="title" value={formdata.title}
        onChange={handleInput} style={styles.input}
        />
      </Box>
        </div>
        <div className="form-group" style={styles.formGroup}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <ApartmentIcon sx={{ mr: 1, my: 3.2 }}/>
  <TextField 
    id="companyName" 
    label="Company Name" 
    variant="outlined" 
    name="companyName" 
    placeholder="Company Name"
    value={formdata.companyName}
    onChange={handleInput} 
    style={styles.input}
  /> </Box>
</div>
<div className="form-group" style={styles.formGroup}>
<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>

  <AddLocationAltIcon sx={{ mr: 1, my: 3.2 }} style={{display:'flex', alignItems:'center'}}/>
  <TextField 
    id="location" 
    label="Location" 
    variant="outlined" 
    name="location" 
    placeholder="Company Location"
    value={formdata.location}
    onChange={handleInput} 
    style={styles.input}
  /></Box>
</div>
<div className="form-group" style={styles.formGroup}>
<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
  <ConnectWithoutContactIcon sx={{ mr: 1, my:5.5 }}/>
  <TextField 
    id="contactInformation" 
    label="Contact Information" 
    variant="outlined" 
    name="contactInformation" 
    placeholder="Provide the company's contact information such as email or phone number."
    value={formdata.contactInformation}
    onChange={handleInput} 
    style={styles.contentinput}
    multiline
    rows={3}

  /></Box>
</div>
        <button onClick={handleNext} 
        className="space-btn" style={{marginTop:'40px', color:'#782DFC' , marginBottom:'65px',
        width:'110px',marginLeft:'80px',marginRight:'90px',height:'40px',backgroundColor:'#f8f0fb', padding:5}}
        >Next</button></>
    )}
  {activeStep === 1 && (
      <><div style={styles.date}>
        <div className="form-group" style={styles.formGroup}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
         <EventIcon sx={{ mr: 1, my:3.5 }}/>
         <TextField 
            id="startDate" 
            label="Start Date " 
            variant="outlined" 
            name="startDate" 
            value={formdata.startDate}
            type="date"
            onChange={handleInput} 
            style={{...styles.input,padding:'18px'}}
          />
     </Box>
        </div>
        <div className="form-group" style={styles.formGroup}>
  <Box sx={{ display: 'flex', alignItems: 'flex-end', marginLeft:'20px'}}>
    <EventBusyIcon sx={{ mr: 1, my: 3.5 }} />
    <TextField
      id="endDate"
      label="End Date"
      variant="outlined"
      name="endDate"
      value={formdata.endDate}
      type="date"
      onChange={handleInput}
      style={{...styles.input,padding:'15px'}}
    />
  </Box>
</div>
</div>
<div className="form-group" style={styles.formGroup}>
  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
    <TextField
      id="description"
      label="Internship Description"
      variant="outlined"
      name="description"
      placeholder="Describe your overall internship experience. What did you like ? What did you dislike ?"
      value={formdata.description}
      onChange={handleInput}
      multiline
      rows={8}
      style={styles.contentinput}
    />
  </Box>
</div>
        <button onClick={handleBack}  className="space-btn" style={{marginTop:'45px', color:'#782DFC' , 
         width:'110px',marginLeft:'0px',backgroundColor:'#f8f0fb',marginRight:'940px',height:'40px', padding:5}}>Back</button>
        <button onClick={handleNext}  className="space-btn" style={{marginTop:'-40px', color:'#782DFC' , 
        marginBottom:'102px',backgroundColor:'#f8f0fb',
        width:'110px',marginLeft:'80px',marginRight:'90px',height:'40px', padding:5}}>Next</button>
      </>
    )}
    {activeStep === 2 && (
      <>
        <div className="form-group" style={styles.formGroup}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' , marginTop:'30px' }}>
    <AddTaskOutlinedIcon sx={{ mr: 1, my: 12.5 }} />
    <TextField
      id="skillsGained"
      label="skills Gained"
      variant="outlined"
      name="skillsGained"
      placeholder="What skills do you think you gained and what did you learn from this experience ?"
      value={formdata.skillsGained}
      onChange={handleInput}
      multiline
      rows={8}
      style={{...styles.contentinput ,}}
    />
  </Box>

        </div>
        <button onClick={handleBack}  className="space-btn" style={{marginTop:'45px', color:'#782DFC' , 
        width:'110px',backgroundColor:'#f8f0fb',marginLeft:'0px',marginRight:'940px',height:'40px', padding:5}}>Back</button>
        <button onClick={handleNext}  className="space-btn" style={{marginTop:'-40px', color:'#782DFC' , 
        marginBottom:'148px',backgroundColor:'#f8f0fb',
        width:'110px',marginLeft:'80px',marginRight:'90px',height:'40px', padding:5}}>Next</button>
        </>
    )}
    {activeStep === 3 && (
      <>
        <div className="form-group" style={styles.formGroup}>
        <Tooltip title="Upload your report  ">

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{width:'30%',marginLeft:'280px',backgroundColor:'#782DFC'}}
          
          >
            Upload Report
            <VisuallyHiddenInput
              type="file"
              id="report"
              name="report"
              accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .ppt, .pptx" 
              onChange={handleInput}
              multiple
              
            />
          </Button></Tooltip>
        </div>
        <div className="container" style={{marginTop:'100px',marginRight:'0px'}}>
                    <button type="submit" 
                className="button" style={{marginLeft:'150px',backgroundColor:'#f8f0fb',}}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Update Post
                      </button>
                    </div>
                    <button onClick={handleBack}  className="space-btn" style={{marginTop:'75px', color:'#782DFC' , 
         width:'110px',marginLeft:'0px',marginRight:'940px',height:'40px',backgroundColor:'#f8f0fb', padding:5}}>Back</button>
          <Link to='/manageIE'>
        <button onClick={handleNext}  className="space-btn" style={{marginTop:'-40px', color:'#782DFC' , 
        marginBottom:'140px',
        width:'110px',marginLeft:'80px',backgroundColor:'#f8f0fb',marginRight:'90px',height:'40px', padding:5}}>Finish</button></Link>
      <Stack sx={{ width: '40%', marginRight:'80px', marginBottom:'30px' }} spacing={2}>
      {updatealertStatus.message && (
            <Alert variant="filled" severity={updatealertStatus.severity}>
              {updatealertStatus.message}
            </Alert>
          )}
        </Stack>
   
           </>
          )}
        </form>  </Stack>
  
      </div>
            </>
);};
const styles = {
    pageContainer: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: 'left bottom',
      backgroundRepeat: 'no-repeat', 
      backgroundSize: '600px 650px', 
      width:'100%',
      height:'100%',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      margin :'0',
    },
    formContainer: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      width: '800px',
      height: '1350px',
      marginTop :'20px',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems:'flex-end',
      marginTop :'60px',
      marginLeft: '-505px',
  
    },
    formGroup: {
      marginBottom: '0px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'right',
      justifyContent:'right',  
      width: '50%',
    },
  
    input: {
      width: '90%',
      padding: '10px',
      
    },
    contentinput:{
      marginLeft:'10px',
        fontSize:'16px',
        width:'88%'
    },
    date:{
      display:'flex',
      marginTop:'-30px',
      marginRight:' 108px',
      marginBottom:' 20px',
  
    }
    
};
export default UpdatePosts;