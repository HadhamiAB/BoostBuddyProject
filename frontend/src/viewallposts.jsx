import * as React from 'react';
import { useState ,useEffect } from 'react';
import axios from "axios";
import Navbar from "./navbar";
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
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import './css/btn.jsx'
import './css/heartanimation.css'
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
const ViewAllPosts = ()=>{
    const [posts, setPosts] = useState([]); 
    const [Search , setSearch]=useState('');
    const [page, setPage] = useState(1); 
    const [open, setOpen] = React.useState(false);
    const [currentPost, setCurrentPost] = React.useState(null);
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
           //const csrftoken = cookies.load('csrftoken');

          const apiUrl = 'http://127.0.0.1:8000/apimanageinternships/viewallposts/';
          try {
          const response  =await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
              //'X-CSRFToken': csrftoken,
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
    
    
    const fileredPost = posts.filter(post =>{
        return post.title.toLowerCase().includes(Search.toLowerCase()) ||
        post.description.toLowerCase().includes(Search.toLowerCase())||
        post.companyName.toLowerCase().includes(Search.toLowerCase())||
        post.skillsGained.toLowerCase().includes(Search.toLowerCase())
       } );
       const handleChange = (event, value) => {
        setPage(value);
      };

    const handleOpen = (post) => {
      setCurrentPost(post);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
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
      />         <style>{slideIn}</style>

  <div className="postsContainer" style={styles.postsContainer}>
  <div style={styles.postContainer}>
  {fileredPost.slice((page - 1) * 6, page * 6).map(post => (
            <div key={post.id}>
           <Card sx={{ maxWidth: 345  ,boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', 
            borderRadius:'10px' , height:320 ,backgroundColor:'white  '}}>
              <CardHeader 
               // title={post.title}
                subheader={post.startDate + " / " + post.endDate}
                subheaderTypographyProps={{ style:
                   { color: 'black' } }}
              />
              <Divider sx={{ borderColor: 'black' }}/>
              <CardContent>
                <Typography variant="h5" component="div" 
                style={{color:'black',textAlign:'center'}}>
                  {post.title}
                </Typography>
                <Divider sx={{ borderColor: 'black' , marginBottom:'10px'}} />
                <Typography variant="body1" color="text.secondary" 
                 style={{color:'black'}}>
                  {post.description.substring(0, 150)}...
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
                  onClick={() => handleOpen(post)}
                  aria-label="show more"
                >
                  <PreviewIcon  style={{color:'black',fontSize:'30px'}}/>
                </IconButton>
              </CardActions></div>
            </Card>
            </div>
         ))}
  </div>
      </div>
      <Stack spacing={2} sx={{ marginTop: 0 ,marginLeft:80}}>
        <Pagination count={Math.ceil(fileredPost.length / 6)} 
        page={page} onChange={handleChange} size="large"
         sx={{ 
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: 'black',
            color: 'white', 
          },
          '& .MuiPaginationItem-page:hover': {
            backgroundColor: 'black',
            color: 'white', 
          },
        }}
      />
      </Stack>
      <PostModal open={open} handleClose={handleClose} post={currentPost} />
      </div></>
    );

};

const styles={

  page:{
   // backgroundImage: `url(src/assets/post.jpg)`,
 
    backgroundColor:'#cec8ef ',
    width:'100%',
    minHeight:'100vh',
    height:'100%'
  },
    postsContainer:{
    
     // height:'1500px',
      marginLeft:'50px',
      marginTop:'0px',
      display: 'flex',
     flexDirection: 'row',
     justifyContent: 'center',
    },
    postContainer:{
      borderRadius:'20px',
      width:'1500px',
      marginLeft:'50px',
      marginTop:'60px',
      marginBottom:'30px',
      display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
    backgroundColor:'',
    height:'100%',
    transition: 'background-color .3s ease-in-out',
    animation: 'slideIn 0.5s ease',
    },
    post:{
      borderRadius:'20px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)',   
         width:'1450px',
      marginLeft:'20px',
      marginTop:'30px',
      marginBottom:'30px',
      padding:'10px',
    
    
    },

    };
export default ViewAllPosts;