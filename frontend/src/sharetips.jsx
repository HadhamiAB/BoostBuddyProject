import Navbar from "./navbar";
import NestedADDModal from "./modals/addtipmodal.jsx";
import { useState ,useEffect } from 'react';
import axios  from "axios";
import cookies from 'react-cookies';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TipElement from "./modals/viewmoremodaltip";
import DeleteConfirmationModal from './modals/deletemodal.jsx';
import TransitionsModal from "./modals/docsuccessdelete.jsx";
import SearchBar from "./modals/searchbar.jsx";
import NestedUpdateModal from "./modals/updatetip.jsx";
import Pagination from '@mui/material/Pagination';
import './css/heartanimation.css'
import Stack from '@mui/material/Stack';

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
const ShareTips =() => {

    const [tipinformation, settipinformation] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); 
    const [Search , setSearch]=useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false); // State for delete success modal
    const [selectedTip, setSelectedTip] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTipId, setSelectedTipId] = useState(null);
    const [page, setPage] = useState(1); 
    const [openTipId, setOpenTipId] = useState(null);

    const handleLikeClick = async (tip) => {
        const apiUrl = `http://127.0.0.1:8000/mindmattersapi/like_tip/${tip.id}/`;
        try {
          const response = await axios.post(apiUrl, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
          });
          console.log("Success", response.data);
         
         settipinformation(tipinformation.map(t => t.id === tip.id ? {...t, likes: t.likes + 1} : t));
        } catch(error) {
        console.error("Error liking tip", error);
        }
      };
    useEffect(() => {
    const fetchingTips=async () => {
        const apiUrl ='http://127.0.0.1:8000/mindmattersapi/viewusertip/';
        const csrftoken = cookies.load('csrftoken');
        try{
            const response= await axios.get(apiUrl , {
                withCredentials:true,
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token  ${localStorage.getItem('token')}`

                },
            });
            const tips=response.data;
            console.log("Success", tips);
            settipinformation(tips);
        }catch(error){
            console.error("Error fetching tips ", error);
        }
    };
        fetchingTips();
    },[]);
    const handleDeleteConfirmation = (tipID) => {
        setSelectedTip(tipID);
        setDeleteConfirmation(true);
        handleClose();
      };
    
      const handleDeleteCancel = () => {
        setDeleteConfirmation(false);
        setSelectedTip(null);
      };
      const handleDeleteConfirm = async () => {
        try {  
            const response = await axios.delete( `http://127.0.0.1:8000/mindmattersapi/delete/${selectedTip}/` ,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            });
            const updatedTips = tipinformation.filter(tip => tip.id !== selectedTip);
            settipinformation( updatedTips);
            console.log("Delete Success", response);
            setDeleteSuccess(true); 

        } catch (error) {
            console.error("Delete Error", error);
        }finally {
            setDeleteConfirmation(false);
            setSelectedTip(null);
          }}; 
    const filteredTips = tipinformation.filter(tipcontent => {
        return tipcontent.title.toLowerCase().includes(Search.toLowerCase()) ||
        tipcontent.tip.toLowerCase().includes(Search.toLowerCase());
    });
    const handleClick = (event,id) => {
        setAnchorEl(event.currentTarget);
        setOpenTipId(id);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };        
      const closeDeleteSuccessModal = () => {
        setDeleteSuccess(false); // Close the delete success modal
      };
      const handleOpenModal = (id) => {
        console.log('Opening modal with id:', id);

        setSelectedTipId(id);
        setModalOpen(true);
      };
      
      
    
      
      const handleChange = (event, value) => {
        setPage(value);
      };
    return (
        <>
        <Navbar />
           <div style={styles.page}>
            <div>
            <SearchBar
            placeholder="Search for Tips "
            value={Search}
            onChange={(e) => setSearch(e.target.value)}
            tooltipTitle="Type tip topic or a key word "
                
                /></div> 
                   <style>{slideIn}</style>

                <NestedADDModal />
            <div style={styles.container}>
          {filteredTips.slice((page - 1) * 6, page * 6).map((tipcontent) => (
           <div key={tipcontent.id} style={styles.tipcontainer}>
           <MoreVertIcon onClick={(event) => handleClick(event, tipcontent.id)}  style={styles.menu} />
           <Menu
             id="simple-menu"
             anchorEl={anchorEl}
             keepMounted
             open={Boolean(anchorEl)}
             onClose={handleClose}
           >
             <MenuItem onClick={() => handleDeleteConfirmation(openTipId)}>
               <DeleteIcon />
               Delete
             </MenuItem>
             <MenuItem onClick={() => handleOpenModal(openTipId)}>
             <EditIcon  />
              Edit
             </MenuItem>
           </Menu>
           <div style={styles.titlecss}>{tipcontent.title}</div>
           <div style={{marginTop:'5px',padding:'10px',}}>
             <TipElement title={tipcontent.title} tip={tipcontent.tip} />
           </div>
           <div style={styles.likeContainer}>
           <input type="checkbox" id={`toggle-heart-${tipcontent.id}`} className="like" onClick={() => handleLikeClick(tipcontent)} />
                <label htmlFor={`toggle-heart-${tipcontent.id}`} className="hearth" aria-label='like'>
                    
                </label>
             {tipcontent.likes}  
           </div>
         </div>
         
          ))}
              {deleteConfirmation && (
          <DeleteConfirmationModal
            isOpen={deleteConfirmation}
            onClose={handleDeleteCancel}
            onDelete={handleDeleteConfirm}
          />
        )}
        <TransitionsModal open={deleteSuccess} handleClose={closeDeleteSuccessModal}
           title="" 
           description=
           {
             <>
             <h2 style={{marginTop:'10px',marginBottom:'10px',
              textAlign:'center'}}>Tip deleted successfully</h2>

               
               <img src="./src/assets/sucess.gif" alt="Success " 
               style={{marginLeft:'120px'}} />
               </>}
            />
  {modalOpen && <NestedUpdateModal open={modalOpen} 
  setOpen={setModalOpen} selectedTipId={selectedTipId} />}
  </div>
  <Stack spacing={2} sx={{ marginTop: '-120px ',marginLeft:80}}>
        <Pagination count={Math.ceil(filteredTips.length / 6)} 
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
       </div>
        </>

    );

};
const styles ={

    page:{
      minHeight:'100vh',
      width:'100%',
      height:'100%',
      margin :'0',

    },
   container: {
    width:'1550px',
    marginLeft:'70px',
    marginTop:'10px',
    height:'100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', 
    gridGap: '10px',
    justifyContent: 'space-evenly',
    padding: '0 20px',

    },
    likeContainer: {
      position: 'absolute',
      left: '190px',
      Top:'80px',
      bottom: '0px',
      display: 'flex',
      alignItems: 'center',
      },
      
      tipcontainer :{
        position: 'relative',
        width:'300px',
        marginLeft:'100px',
        marginTop:'0px',
        height:'270px',
        borderRadius:'20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', 
        background:'linear-gradient(to top right,white 50%, #cec8ef   40% )',
      },
     
        menu:{
            padding:'5x',
            marginTop:'7px',
            marginLeft:'0px',
            marginBottom:'5px'
        },
        titlecss:{
          marginTop:'-20px', textAlign:'center', 
          fontWeight:'bold',fontSize:'18px' },
};
export default ShareTips;