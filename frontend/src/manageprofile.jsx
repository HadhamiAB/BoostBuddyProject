import { useState , useEffect } from 'react';
import Navbar from './navbar.jsx';
import axios from "axios";
import cookies from 'react-cookies';
import {useNavigate} from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import HttpsIcon from '@mui/icons-material/Https';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
const ManageProfile =()=>{
const navigate = useNavigate();
    const emptyForm = {
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        is_student: false,
        is_teacher: false,
    };
const [formdata,setformdata]=useState(emptyForm);
const [showPassword, setShowPassword] = useState(false);
const [updateresult, setupdateresult] = React.useState({ severity: '', message: '' });

useEffect(() => {
    const userId = getUserId();
    if (userId) {
        fetchUserData(userId);
    }
}, []);
const getUserId = () => {
    //get user id from authentication
    return localStorage.getItem('user_id');
};
const fetchUserData =async (userId) => {
    try{
    const apiUrl = `http://127.0.0.1:8000/apisignup/manageprofile/${userId}/`;
   const response=await axios.get(apiUrl)
            const userData = response.data;
            setformdata(userData);
        }catch(error)  {
            console.error("Error fetching user data:", error);
        }
};    
const updateUserdata = async (event) => {
  // Prevent the page from refreshing
  event.preventDefault();

  const userId = getUserId(); 
  if (!userId) {
    console.error("User ID not found.");
    return;
  }
  try {
    const apiUrl = `http://127.0.0.1:8000/apisignup/manageprofile/${userId}/`;
    const csrftoken = cookies.load('csrftoken');
    const response = await axios.put(apiUrl, formdata , {
      withCredentials:true,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    });
    console.log("Success", response.data);
    setupdateresult({ severity: 'success', message: 'Profile updated successfully!' });
    setTimeout(() => {navigate('/');}, 30000); 
  } catch(error) {
    setupdateresult({ severity: 'error', message: 'Error updating profile' });
    console.error("Error updating profile:", error);
  }
};

    const handleInput = (event) => {
    const { name, value } = event.target;
    setformdata({ ...formdata, [name]: value });
    };

    const handleCheckBox = (event) => {
    const { name, checked } = event.target;
    setformdata({ ...formdata, [name]: checked });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
      
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return (
        <>
        <Navbar />
        <div className="container" style={styles.pageContainer}>
                <div className="form-container" style={styles.formContainer}>
                <div style={styles.h1div}>
                 <h1 style={styles.h1style}>
                 
                    < HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',marginRight:'10px' ,marginLeft:'-50px'   ,
          marginTop: '10px',marginBottom:'-14px'
}} /> 
                        Manage Profile
                        < HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',marginLeft:'10px',marginTop: '10px',marginBottom:'-14px'}}/>
</h1></div>
                        
                      
                    <form onSubmit={updateUserdata} style={styles.form}>
                    <div className="nameContainer" style={{...styles.nameInputContainer,
      marginLeft:'-20px'}}>
  <label htmlFor=""><PersonIcon style={{marginTop:'8px',marginLeft:'10px',marginRight:'0px'}}/></label>
  <TextField 
  id="first_name" 
  name="first_name" 

  label="First Name" variant="standard" 
  value={formdata.first_name}
  onChange={handleInput} 
  />

  <TextField 
    id="last_name"
    name="last_name" 
    label="Last Name"
    value={formdata.last_name}
    onChange={handleInput} 
    variant="standard"
  />
</div>
<div className="form-group" style={styles.formGroup}>
  <label htmlFor="email"><EmailIcon style={{marginTop:'15px', marginRight:'10px' , marginLeft:'-15px'}}/></label>
  <TextField 
    type="email" 
    id="email"
    name="email" 
    label="Email"  
      value={formdata.email}
    onChange={handleInput} 
    variant="standard"
    style={styles.input}
  />
</div>
<div className="form-group" style={styles.formGroup}>
  <label htmlFor="username"><BadgeIcon style={{marginTop:'8px', marginRight:'10px' , marginLeft:'-15px'}} /></label>
  <TextField 
    type="text" 
    id="username"
    name="username" 
    label="Username"
        value={formdata.username}
    onChange={handleInput} 
    variant="standard"  style={styles.input}
  />
</div>

<div className="form-group" style={styles.formGroup}>
<label htmlFor="password"><HttpsIcon style={{marginTop:'12px' , marginRight:'10px' , marginLeft:'-15px'}}/></label>
  <FormControl variant="filled">
    <InputLabel htmlFor="filled-adornment-password"  

    >Password</InputLabel>
    <FilledInput 
      type={showPassword ? 'text' : 'password'}
      id="password"
      name="password" 
      value={formdata.password} 
      onChange={handleInput}
      
      endAdornment={
        <InputAdornment position="end" style={{height:'40px'}}>
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }  style={{width:'380px',height:'40px', backgroundColor:'white'}}
    />
  </FormControl>
</div>
<div className="form-group" style={styles.formGroup}>

<FormControlLabel
        control={
          <Checkbox
            checked={formdata.is_student}
            onChange={handleCheckBox}
            name="is_student"
            color="primary"
          />
        }
        label="Student"
        style={{marginLeft:'70px'}}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formdata.is_teacher}
            onChange={handleCheckBox}
            name="is_teacher"
            color="primary"
          />
        }
        label="Teacher"
        style={{marginLeft:'40px'}}
      />
    </div>
    <button type="submit" className="space-btn"  style={{color:'#742BF7' , width:'230px', 
    height:'50px', fontSize: 20 , padding:'0px',marginTop:'0px',marginLeft:' 85px',backgroundColor:'#F8F0FB'
  }}>
      Update Profile 
    </button>

    <Stack sx={{ width: '100%' }} spacing={2}>
        {updateresult.message && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
           <Alert variant="filled" severity={updateresult.severity}>
        {updateresult.message}
      </Alert>
      {updateresult.severity === 'success' && (
        <img src="./src/assets/check.gif" alt="Check" style={{ width: '70px', height: '50px' }} /> 
       )} </div>
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
        backgroundImage: `url(./src/assets/bg2.jpg)`,
        backgroundSize: ' cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'left',
        width:  '1700px',
        margin :'0',
      },
      formContainer: {
        background: 'white',
        padding: '40px',
        borderRadius: '70px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        width: '500px',
        height: '620px',
        display:'flex',
        flexDirection:'column',
        justifyContent:'start',
        marginLeft:'40px',
        marginTop:'-45px'
      },

      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      formGroup: {
        marginBottom: '10px',
      },
      nameInputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width:'420px',
        gap: '10px',
        marginBottom:'10px',
    
      },

      input: {
        padding: '5px',
        borderRadius: '5px',
        //border: '1px solid #ccc',
        width: '90%',
      },
      h1style: {
        textAlign: 'center',
        marginTop: '-20px',
        marginBottom: '20px',
      },
    h1div:{
      display:'flex',justifyContent:'center',alignItems:'center',marginLeft:'40px'
    }
};
export default ManageProfile;