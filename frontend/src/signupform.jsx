import { useState} from "react";
import * as React from 'react';
import axios from "axios";
import cookies from 'react-cookies';
import {Link , useNavigate} from 'react-router-dom';
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
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
const Signup=() =>{
  const navigate = useNavigate();
 const emptyForm={
first_name:"",
 last_name:"",
 email:"",
 username:"",
 password:"",
 is_student: false,
 is_teacher: false,
  }
    const [formdata , setformdata]=useState(emptyForm);
    const [wrongCredentials, setwrongCredentials] = React.useState({ severity: '', message: '' });
const [showPassword, setShowPassword] = useState(false);


    const handleInput=(event)=>{
        const {name , value}=event.target;
        setformdata({...formdata , [name]: value});
    };
    const handleCheckBox =(event)=>{
        const {name , checked}=event.target;
        // If the clicked checkbox is "is_teacher", uncheck "is_student" and vice versa
        if (name ==="is_teacher" && checked){
            setformdata({...formdata , is_teacher:checked, is_student: false});
        }else if (name ==="is_student" && checked){
            setformdata({...formdata , is_student:checked, is_teacher: false});
    }else{
      setformdata({ ...formdata, [name]: false });
    }
};

const apiUrl = 'http://127.0.0.1:8000/apisignup/signup/';
    const signup =(event)=>{
        event.preventDefault();
        // Get the CSRF token from the cookie
        const csrftoken = cookies.load('csrftoken');
        axios.postForm(apiUrl, formdata ,  {
          withCredentials: true,
          headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': csrftoken,
          },
      })
      .then((response) => {
          const data = response.data;
          console.log("Success", data);
          localStorage.setItem('user_id', data.user_id);
          setwrongCredentials({ severity: 'success', message: 'Account created successfully!' })
          setformdata(emptyForm);
          setTimeout(() => {navigate('/');}, 3000); 

      })
      .catch((error) => {
          setwrongCredentials({ severity: 'error', message: 'User with this data already exist !' });
          console.error("Error", error);
        
      }); };
      const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
      
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return (
        <div className="container" style={styles.pageContainer}>
        <div className="form-container" style={styles.formContainer}>
          <div style={styles.h1div}>
          <h1 style={styles.h1style}>
         < HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',marginRight:'10px' ,marginLeft:'-50px'   ,
          marginTop: '10px',marginBottom:'-14px'
}} /> Sign Up
 < HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',marginLeft:'10px',marginTop: '10px',marginBottom:'-14px'}}/>
</h1></div>
      <form onSubmit={signup} style={styles.form} method="post">
      <div className="nameContainer" style={{...styles.nameInputContainer,
      marginLeft:'-20px'}}>
  <label htmlFor=""><PersonIcon style={{marginTop:'8px',marginLeft:'10px',marginRight:'0px'}}/></label>
  <TextField id="first_name" 
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
  <label htmlFor="email"><EmailIcon style={{marginTop:'8px', marginRight:'10px' , marginLeft:'-15px'}}/></label>
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
    <InputLabel htmlFor="filled-adornment-password"  >Password</InputLabel>
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
      Get Started
    </button>
    <Stack sx={{ width: '100%' }} spacing={2}>
        {wrongCredentials.message && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
           <Alert variant="filled" severity={wrongCredentials.severity}>
        {wrongCredentials.message}
      </Alert>
      {wrongCredentials.severity === 'success' && (
        <img src="./src/assets/check.gif" alt="Check" style={{ width: '70px', height: '50px' }} /> 
       )} </div>
        )}
      </Stack>
    <h6 style={styles.loginLink}>
      Already have an account?{' '}
      <Link to="/login" style={{color:'#742BF7'}}>Log In</Link>
    </h6>
    </form>
      </div>
      <h1 id="homelink" >
          <Link to="/"  
          style={{ ...styles.homeLink,
           color: 'white ', textDecoration: 'none' }}>
            <SwitchAccessShortcutIcon  style={{  left: '1390px', color:'white ', fontSize:'58px',marginBottom: '-8px',
 }}/> Home</Link>
        </h1>
    </div>

    );

    };
const styles = {
  pageContainer: {
    //background: 'linear-gradient(to right , white 40%, transparent 60%), url(./src/assets/bg1.jpg) no-repeat right ',
    //backgroundSize: ' 80%, cover',
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
    marginLeft:'40px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  nameInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width:'420px',
    gap: '10px',
    marginBottom:'10px',

  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '5px',
    borderRadius: '5px',
    //border: '1px solid #ccc',
    width: '90%',
  },
  homeLink: {
    position: 'fixed',
    bottom: '10px',
    left: '1350px',
    color:'white ',
    fontSize:'58px',
    textDecoration:'none',
  },
  loginLink: {
    fontSize :'14px',
    margin: '20px 75px',
  },
  h1style: {
    textAlign: 'center',
    marginTop: '-20px',
    marginBottom: '30px',
  },
h1div:{
  display:'flex',justifyContent:'center',alignItems:'center',marginLeft:'40px'
}
};

    export default Signup;