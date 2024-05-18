import { Link } from 'react-router-dom';
import { useState } from "react";
import ReorderIcon from '@mui/icons-material/Reorder';
import { useAuth } from './authContext.jsx';
import "./css/navbarcss.css";
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';

const DropdownMenu1 = () => {
  return (
    <div className="dropdownMenu1">
      <Link to="/viewalltips">View Tips</Link>
      <Link to="/sharetips">Share Tips</Link>
    </div>
  );
};

const DropdownMenu2 = () => {
  return (
    <div className="dropdownMenu2">
      <Link to="/viewalldocuments">View Documents</Link>
      <Link to="/managedocuments">Manage Documents</Link>
    </div>
  );
};
const DropdownMenu3 = () => {
  return (
    <div className="dropdownMenu3">
      <Link to="/viewallposts">View Posts</Link>
      <Link to="/manageIE">Manage Posts</Link>
    </div>
  );
};
const Navbar = () => {
  const [openLinks, setOpenLinks] = useState(false);
  const [openDropdown1, setOpenDropdown1] = useState(false);
  const [openDropdown2, setOpenDropdown2] = useState(false);
  const [openDropdown3, setOpenDropdown3] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { authenticated, logout } = useAuth();
  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };
return (
    <div className="navbar">

    <div className="leftSide" id={openLinks ? "open" : "close"}>
    <img src="src/assets/image.png"
     alt="Logo" style={{width:'160px',height:'140px'}} />
    <div className="hiddenLinks">
     
          <Link to="/" >Home</Link>
          <div 
            onMouseEnter={() => setOpenDropdown2(true)}
            onMouseLeave={() => setOpenDropdown2(false)}
          >
          <Link > Documents</Link>
          {openDropdown2 && <DropdownMenu2 />}
          </div>
          <div 
            onMouseEnter={() => setOpenDropdown3(true)}
            onMouseLeave={() => setOpenDropdown3(false)}
          >
          <Link  > Posts</Link>
          {openDropdown3 && <DropdownMenu3 />}
          </div>          <div 
            onMouseEnter={() => setOpenDropdown1(true)}
            onMouseLeave={() => setOpenDropdown1(false)}
          >
            <Link >Mind Matters</Link>
            {openDropdown1 && <DropdownMenu1 />}
          </div>          
          <Link to="/signup">Sign Up</Link>          
          </div>
      </div>
      <div className="rightSide">
          <Link to="/" >Home</Link>
          <div 
            onMouseEnter={() => setOpenDropdown2(true)}
            onMouseLeave={() => setOpenDropdown2(false)}
          >
          <Link > Documents</Link>
          {openDropdown2 && <DropdownMenu2 />}
          </div>          
          <div 
            onMouseEnter={() => setOpenDropdown3(true)}
            onMouseLeave={() => setOpenDropdown3(false)}
          >
          <Link > Posts</Link>
          {openDropdown3 && <DropdownMenu3 />}
          </div>              <div 
            onMouseEnter={() => setOpenDropdown1(true)}
            onMouseLeave={() => setOpenDropdown1(false)}
          >
            <Link >Mind Matters</Link>
            {openDropdown1 && <DropdownMenu1 />}
          </div>
          <Link to="/signup">Sign Up</Link>

          <button onClick={toggleNavbar}>
              <ReorderIcon />
        </button>
      </div>
      <div style={{ marginTop:'15px',marginRight:'40px',width:'40px',height:'50px'}}>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle style={{fontSize:'50px',color:'white',marginTop:'-16px'}}/>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {authenticated ? (
              <>
                <MenuItem onClick={handleClose}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#b393eb', 
                  } 
                }}
                ><Link to="/manageprofile"
                style={{textDecoration:'none',color:'black'}}
                >Manage Profile</Link></MenuItem>
                <MenuItem onClick={handleClose}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#b393eb', 
                  } 
                }}
                ><Link to="/dashboard"
                style={{textDecoration:'none',color:'black'}}
                >Dashboard</Link></MenuItem>
                <MenuItem onClick={handleClose}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#b393eb', 
                  } 
                }}
                ><Link to="/feedback"
                style={{textDecoration:'none',color:'black'}}
                >Leave Feedback</Link></MenuItem>
                <MenuItem onClick={handleLogout}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#b393eb', 
                  } 
                }}
                >Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleClose}
              sx={{ 
                '&:hover': { 
                  backgroundColor: '#b393eb', 
                } 
              }}
              ><Link to="/login"
              style={{textDecoration:'none',color:'black'}}
              >Login</Link></MenuItem>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
