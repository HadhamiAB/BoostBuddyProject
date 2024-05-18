import { Button } from '@mui/material';
import axios from 'axios';
import cookies from 'react-cookies';
import { useAuth } from './authContext.jsx'; 
import LogoutModal from "./modals/logoutmodal.jsx";
import { useState} from "react";
import LogoutIcon from '@mui/icons-material/Logout';

const Logout=()=>{
const { logout } = useAuth();
const [ModalisOpen, setModalislOpen] = useState(false);

const handleLogout = () => {
    axios.post('http://127.0.0.1:8000/apilogin/logout/', {}, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.load('csrftoken'),
        },
    })
    .then((response) => {
        console.log("Logout Success", response.data);
        alert("You have been logged out.");
        logout();
      
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        setModalislOpen(true);  
})
    .catch((error) => {
        console.error("Logout Error", error);
    });};
    const closeModal = () => {
        setModalislOpen(false);
    };
    

return (
    <>
     {ModalisOpen && (
                <LogoutModal
                    isOpen={ModalisOpen}
                    onClose={closeModal}
                    message={"You have been logged out !"}
                />
            )}
<Button onClick={handleLogout} style={{ color:' white',
textDecoration: 'none',width:'40px'}}> <LogoutIcon style={{ fontSize: 40 }} /></Button>


</>);
};export default Logout;
