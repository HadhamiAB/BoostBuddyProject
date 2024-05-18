import { useState} from "react";
import axios from "axios";
import cookies from 'react-cookies';
import {Link } from 'react-router-dom';
import { useAuth } from './authContext.jsx'; 
import Person4Icon from '@mui/icons-material/Person4';
import PasswordIcon from '@mui/icons-material/Password';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginModal from "./modals/loginmodal.jsx";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import  './css/sendbtn1.css';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
const Login=() =>{
  const { login } = useAuth();
 const emptyForm={username:"",password:""};
    const [formdata , setformdata]=useState(emptyForm);
    const [showPassword, setShowPassword] = useState(false);

    const handleInput=(event)=>{
        const {name , value}=event.target;
        setformdata({...formdata , [name]: value});
    };
    const [wrongCredentials, setwrongCredentials] = useState(null);
    const [ModalisOpen, setModalislOpen] = useState(false);

const apiUrl = 'http://127.0.0.1:8000/apilogin/login/';
    const handleLogin =(event)=>{
        event.preventDefault();
        // Get the CSRF token from the cookie
        const csrftoken = cookies.load('csrftoken');
        axios.post(apiUrl, formdata ,  {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
          },
      })
      .then((response) => {
          const data = response.data;
          console.log("Success", data);
          
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('token', data.token);
          login(data);
          setModalislOpen(true);

          
          setwrongCredentials(null)
          setformdata(emptyForm);
      })
      .catch((error) => {
          // Set the login error if the credentials are incorrect
          if (error.response && error.response.status === 400) {
            setwrongCredentials('User not found , Please verify your input !');
          } else {
            console.error("Error", error);
          }
        }); };
    
        const closeModal = () => {
          setModalislOpen(false);
      };
      const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
      
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    return (
        <div className="container" style={styles.pageContainer}>
        <div className="form-container" style={styles.formContainer}>
        <img src="./src/assets/login.webp" alt="Check" style={{marginLeft:'170px', width: '120px', height: '100px' }} /> 

        <div style={styles.h1div}>
          <h1 style={styles.heading}>
         < HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',
         marginRight:'10px' ,marginLeft:'-50px'   ,
          marginTop: '10px',marginBottom:'-14px'
      }} />Log In  
      <HorizontalRuleIcon style={{fontSize :'50',color:'#742BF7',marginLeft:'10px',marginTop: '10px',marginBottom:'-14px'}}/>
           </h1></div>
      <form onSubmit={handleLogin} style={styles.form} method="post">
    <div className="form-group" style={styles.formGroup}>
      <label htmlFor="username"><Person4Icon  /></label>
      <TextField
       type="text" className="form-control" id="username"
        name="username" label="Username" value={formdata.username}
        onChange={handleInput} style={{...styles.input ,...styles.uname}} />
    </div>
    <div className="form-group" style={styles.formGroup}>
    <label htmlFor="password">
      <PasswordIcon style={{marginTop:'12px' , 
      marginRight:'26px' , marginLeft:'2px'}}/></label>
  <FormControl variant="outlined">
    <InputLabel htmlFor="outlined-adornment-password"  >Password</InputLabel>
    <OutlinedInput 
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
      }  style={{width:'385px',height:'54px', backgroundColor:'white'}}
    />
  </FormControl>
  
    </div>
      {wrongCredentials && <div style={{ color: 'red' }}>{wrongCredentials}</div>}
    <button type="submit" className="space-btn"  style={{color:'#742BF7' , width:'230px', 
    height:'50px', fontSize: 20 , padding:'0px',marginTop:'30px',marginLeft:' 105px',backgroundColor:'#F8F0FB',
 display:'flex',alignItems:'center',justifyContent:'center'
 }}>
      Log IN <LockOpenIcon style={{color:'#742BF7',fontSize: 27 ,marginTop:'8px',marginBottom:' 12px',marginLeft:' 5px'}}/>
    </button>
    {/*<small className="text-danger" style={styles.forgotpwd}>Forgot password ?</small>*/}
    <h6 style={styles.signupLink}>
      Don&apos;t have an account?{' '}
      <Link to="/signup" style={{color:'#742BF7'}}>Sign Up</Link>
    </h6>
  
    {ModalisOpen && (
                <LoginModal
                    isOpen={ModalisOpen}
                    onClose={closeModal}
                    message={<img
                       src="./src/assets/welcome.gif" 
                       alt="Welcome Back " 
                       style={{width:'280px',height:'235px',
                      marginLeft:'16px'
                      }}
                       />}
                />
            )}
    </form>
      </div>

      <h1 id="homelink" >
          <Link to="/" style={{ ...styles.homeLink, color: 'white ', textDecoration: 'none' }}>
          <SwitchAccessShortcutIcon  style={{  left: '1390px', color:'white ', fontSize:'58px',marginBottom: '-8px',
 }}/>  Home</Link>
        </h1>
    </div>

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
      padding: '20px',
      borderRadius: '70px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      width: '500px',
      height: '600px',
      marginLeft:'40px',
      marginTop:'-30px'
    },
    heading: {
      textAlign: 'center',
      marginTop: '10px',
      marginBottom: '55px',
      fontSize:'35px'

    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    formGroup: {
      marginBottom: '12px',
    },
    input: {
      padding: '8px',
      borderRadius: '5px',
      borderTop: 'None',
      borderLeft: 'None',
      borderRight: 'None',
      marginLeft: '20px',
      marginTop: '-20px',
      width: '400px',

    },
    uname:{
      marginBottom: '15px',

    },
    loginButton: {
      borderRadius: '5px',

    },
    homeLink: {
      position: 'fixed',
      bottom: '10px',
      left: '1350px',
      color:'white ',
      fontSize:'58px',
      textDecoration:'none',
    },
    forgotpwd : {
        textDecoration: 'underline',
    },
    signupLink:{
      fontSize :'14px',
      margin: '30px 105px',
    },
    h1style: {
      textAlign: 'center',
      marginTop: '-20px',
      marginBottom: '30px',
    },
  h1div:{
    display:'flex',justifyContent:'center',alignItems:'center',marginLeft:'50px'
  }
  };
    export default Login;