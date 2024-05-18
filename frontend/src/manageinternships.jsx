import Navbar from "./navbar";
import { Link } from "react-router-dom";
import * as React from 'react';
import axios from "axios";
import { useState ,useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteConfirmationModal from './modals/deletemodal.jsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import cookies from 'react-cookies';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchBar from "./modals/searchbar.jsx";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PreviewIcon from '@mui/icons-material/Preview';
import Button from '@mui/material/Button';
import { Tooltip } from "@mui/material";
import './css/heartanimation.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import TransitionsModal from "./modals/docsuccessdelete.jsx";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24, 
  pt: 2, 
  px: 4,
  pb: 3,  
  minHeight:'80vh', 
  maxHeight: '80vh', 
  overflow: 'auto', 
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function PostModal({ open, handleClose, post }) {
  if (post && post.report) {
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', bgcolor: '#782dfc'  }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h4" component="div">
              {post.title}
            </Typography>
            <Button autoFocus color="inherit" href={post.report} download>
              Download Report
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Company" secondary={post.companyName} 
            primaryTypographyProps={{ sx: { fontSize: '20px',fontWeight:'bold' } }}
            secondaryTypographyProps={{ sx: { fontSize: '15px' ,
             color:'black' , marginLeft:'10px'} }}
            />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Location" secondary={post.location}
               primaryTypographyProps={{ sx: { fontSize: '20px',fontWeight:'bold' } }}
               secondaryTypographyProps={{ sx: { fontSize: '15px' ,
                color:'black' , marginLeft:'10px'} }} />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Contact" secondary={post.contactInformation}
               primaryTypographyProps={{ sx: { fontSize: '20px',fontWeight:'bold' } }}
               secondaryTypographyProps={{ sx: { fontSize: '15px' ,
                color:'black' , marginLeft:'10px'} }} />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Description" secondary={post.description} 
               primaryTypographyProps={{ sx: { fontSize: '20px',fontWeight:'bold' } }}
               secondaryTypographyProps={{ sx: { fontSize: '15px' ,
                color:'black' , marginLeft:'10px'} }}/>
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="Skills Gained" secondary={post.skillsGained} 
               primaryTypographyProps={{ sx: { fontSize: '20px',fontWeight:'bold' } }}
               secondaryTypographyProps={{ sx: { fontSize: '15px' ,
                color:'black' , marginLeft:'10px'} }}/>
          </ListItemButton>
        </List>
      </Dialog>
    );
  }
  return null;
}

const slideIn = `
  @keyframes slideIn {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
const ManageInternships=()=>{
  const [posts, setPosts] = useState([]); 
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [Search , setSearch]=useState('');
  const [anchorEl, setAnchorEl] = useState(null); // anchor ==dom elem menu in  anchored to 
  const [page, setPage] = useState(1); 
  const [currentPost, setCurrentPost] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const handleLikeClick = async (post) => {
    const apiUrl = `http://127.0.0.1:8000/apimanageinternships/like_post/${post.id}/`;
    try {
      const response = await axios.post(apiUrl, {}, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
      });
      console.log("Success", response.data);
      // Update the post's likes in the state
      setPosts(posts.map(p => p.id === post.id ? {...p, likes: p.likes + 1} : p));
    } catch(error) {
      console.error("Error liking post", error);
    }
  };
  useEffect (()=>{
      const fetchingData = async () => {
        const csrftoken = cookies.load('csrftoken');
        const apiUrl = 'http://127.0.0.1:8000/apimanageinternships/viewuserposts/';
        
        try {
        const response  =await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Token ${localStorage.getItem('token')}`

            },
        }); 
            const postData = response.data;
            setPosts(postData);
            console.log("Success", posts);
          }catch(error) {
              console.error("Error fetching data ", error);
          } 
        };
  
          fetchingData();    
        }, []); 
        const handleDeleteConfirmation = (postId) => {
          setSelectedPostId(postId);
          setDeleteConfirmation(true);
          handleClose();
        };
      
        const handleDeleteCancel = () => {
          setDeleteConfirmation(false);
          setSelectedPostId(null);
        };
      
        const handleDeleteConfirm = async () => {
          try {
            await axios.delete(`http://127.0.0.1:8000/apimanageinternships/deleteIE/${selectedPostId}/`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`

              },
            });
            const updatedPosts  = posts.filter(post => post.id !== selectedPostId);
            setPosts(updatedPosts);
            setDeleteSuccess(true);
           // alert('Post deleted successfully!');
          } catch (error) {
            console.error('Error deleting post:', error);
          } finally {
            setDeleteConfirmation(false);
            setSelectedPostId(null);
          }
        };
      const fileredPost = posts.filter(post =>{
          return post.title.toLowerCase().includes(Search.toLowerCase()) ||
          post.description.toLowerCase().includes(Search.toLowerCase())||
          post.companyName.toLowerCase().includes(Search.toLowerCase())||
          post.skillsGained.toLowerCase().includes(Search.toLowerCase())
         } );
         const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
      
        const handleClose = () => {
          setAnchorEl(null);
        };
        const handleChange = (event, value) => {
          setPage(value);
        };
        const handleOpenModal = (post) => {
          setCurrentPost(post);
          setOpen(true);
        };
        const handleCloseModal = () => {
          setOpen(false);
        };
        const closeDeleteSuccessModal = () => {
          setDeleteSuccess(false); // Close the delete success modal
        };
    return (
        <>
        <Navbar />
      <div style={styles.page}>
      <SearchBar
        placeholder="Search for a post"
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
      tooltipTitle="Type post title or company name or a key word "
      />
                  <style>{slideIn}</style>       
        <div style={{
        borderRadius:'45px',
        height:'70px', width:'75px',marginLeft:'30px', marginTop:'20px'}}>
        <Link to='/addIE'>
        <Tooltip title="ADD Post ">

      <AddCircleIcon 
        style={{color :'black',
        
        fontSize: 60 ,marginTop:'10px',
        marginLeft:'13px',marginBottom:'0px'}} /></Tooltip>
   </Link>
    
  </div>  
  <div className="postsContainer" style={styles.postsContainer}>
        <div style={styles.postContainer}>
          {fileredPost.slice((page - 1) * 6, page * 6).map(post => (
            <Card key={post.id} sx={{ maxWidth: 345  ,boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', 
            orderRadius:'10px' , height:320 ,backgroundColor:'white  '}}>
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={handleClick}>
                    <MoreVertIcon style={{padding:'3px', color:'black',
                  marginBottom:'0px'
                  }} />
                  </IconButton>
                }
                //user={post.user.username}
                subheader={post.startDate + " / " + post.endDate}
                subheaderTypographyProps={{ style:
                  { color: 'black' } }}     />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                
              >
                <MenuItem onClick={() => handleDeleteConfirmation(post.id)}>
                  <DeleteIcon />Delete
                </MenuItem>
                <Link to={`/updatepost/${post.id}`} style={{color:'black', textDecoration:'none'}}>
                  <MenuItem><EditIcon />Update</MenuItem>
                </Link>
              </Menu>
              <CardContent>
              <Divider sx={{ borderColor: 'black' }}/>
              <Typography variant="h5" component="div" 
                style={{color:'black',textAlign:'center', padding:'3px'}}>
                  {post.title}
                </Typography>
                <Divider sx={{ borderColor: 'black' }}/>
                <Typography variant="body2" color="text.secondary"  style={{color:'black'}}>
                  {post.description.substring(0, 190)}...
                </Typography>
              </CardContent>
             
              <div style={{display:'flex',
               alignItems:'center', justifyContent:'flex-start' 
             , width:'150px', height:'40px', position:'absolute'}}>
              <CardActions disableSpacing>
              <input type="checkbox" id={`toggle-heart-${post.id}`} className="like" onClick={() => handleLikeClick(post)} />
                <label htmlFor={`toggle-heart-${post.id}`} className="hearth" aria-label='like'>
                    
                </label>
               
                {post.likes}  {/* Display the number of likes */}
                <IconButton
                  onClick={() => handleOpenModal(post)}
                  aria-label="show more"
                >
                  <PreviewIcon  style={{color:'black',fontSize:'30px'}}/>
                </IconButton>
              </CardActions></div>
            </Card>  
             
          ))}
        </div>
      </div>
      <Stack spacing={2} sx={{ marginTop: 0 ,marginLeft:80 , }}>
        <Pagination count={Math.ceil(fileredPost.length / 6)}
         page={page} onChange={handleChange} size="large" sx={{ 
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: 'black',
            color: 'white', 
          },
          '& .MuiPaginationItem-page:hover': {
            backgroundColor: 'black',
            color: 'white', 
          },
        }}/>
      </Stack>
      <PostModal open={open} 
      handleClose={handleCloseModal} post={currentPost} />
      {deleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={deleteConfirmation}
          onClose={handleDeleteCancel}
          onDelete={handleDeleteConfirm}
        />
      )}
        <TransitionsModal open={deleteSuccess} handleClose={closeDeleteSuccessModal}
            title="" 
            description={
              <>
              <h2 style={{marginTop:'10px',marginBottom:'10px', textAlign:'center'}}>Post deleted successfully</h2>

                
                <img src="./src/assets/sucess.gif" alt="Success " 
                style={{marginLeft:'120px'}}
                />
              </>
            } />
      </div>
    </> );
};
const styles={
  inputstyle:{
    marginLeft :'1370px',
    marginRight :'0px',
    marginTop: '20px ',
    fontSize:'14px',
    width:'300px',
    height:'30px',
    minHeight:'100vh',

},
page:{
  // backgroundImage: `url(src/assets/post.jpg)`,
  backgroundPosition: ' right',
  backgroundRepeat: 'no-repeat', 
  backgroundSize: '1720px 880px', 
  width:'100%',
  height:'100%',
  minHeight:'100vh',
  backgroundColor:'#cec8ef ',

},
    postsContainer:{
      
     // height:'1500px',
      marginLeft:'20px',
      marginTop:'0px',
       display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    postContainer:{
      borderRadius:'20px',
      //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
      width:'1500px',
      marginLeft:'80px',
      marginTop:'0px',
      marginBottom:'30px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      backgroundColor:'',
      transition: 'background-color .3s ease-in-out',
      animation: 'slideIn 0.5s ease',


    },
    post:{
      borderRadius:'20px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)',   
         width:'1450px',
      marginLeft:'30px',
      marginTop:'30px',
      marginBottom:'30px',
      padding:'10px',
    
    
    },
};
export default ManageInternships;