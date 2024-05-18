import Navbar from "./navbar";
import { Link   } from 'react-router-dom';
import cookies from 'react-cookies';
import axios from "axios";
import { useState ,useEffect } from 'react';
import DeleteConfirmationModal from './modals/deletemodal.jsx';
import TransitionsModal from "./modals/docsuccessdelete.jsx";
import { useAuth } from './authContext.jsx'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchBar from "./modals/searchbar.jsx";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { Modal } from '@mui/material';
import RatingModal from "./modals/rating.jsx";
import { Tooltip } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}
const HoverRating = ({ documentId }) => {
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const handleRatingChange = (event, newValue) => {
    setValue(newValue);
    sendRatingToBackend(newValue);
  };
const sendRatingToBackend = async (ratingValue) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/apimanagedocuments/sendrate/${documentId}/`,
      { value: ratingValue },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          //'X-CSRFToken': csrftoken,
          'Authorization': `Token  ${localStorage.getItem('token')}`
        },
      }
    );
    console.log("Rating Success", response);
  } catch (error) {
    console.error("Rating Error", error);
  }
};

return (
  <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
    <Rating
      name="hover-feedback"
      value={value}
      precision={0.5}
      getLabelText={getLabelText}
      onChange={handleRatingChange}
      onChangeActive={(event, newHover) => {
        setHover(newHover);
      }}
      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
    />
    {value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>}
  </Box>
);
};
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
const ManageDocuments=()=>{
        const { authenticated   } = useAuth();
        const [documentElements, setDocumentElements] = useState([]);
        const [selectedDocument, setSelectedDocument] = useState(null);
        const [deleteConfirmation, setDeleteConfirmation] = useState(null);
        const [Search , setSearch]=useState('');
        const [anchorEl, setAnchorEl] = useState(null); // anchor ==dom elem menu in  anchored to 
        const [deleteSuccess, setDeleteSuccess] = useState(false); // State for delete success modal
        const [page, setPage] = useState(1); 
       // const colors = [ '#C0CCFA',  '#f8f0fb', '#D1BEE7',  
       // '#F0E9F7'];
        useEffect(() => {

            const fetchingData = async () => {
            const apiUrl = 'http://127.0.0.1:8000/apimanagedocuments/viewuserdocuments/';
            try {
            const response  =await axios.get(apiUrl, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                //'X-CSRFToken': csrftoken,
                'Authorization': `Token ${localStorage.getItem('token')}`
                },
            }); 
                const documents = response.data;
                console.log("Success", documents);
                setDocumentElements(documents);
    
            }catch(error) {
                console.error("Error fetching data ", error);
            } };
            fetchingData(); 
            },[]);
        const handleDeleteConfirmation = (documentId) => {
            setSelectedDocument(documentId);
            setDeleteConfirmation(true);
            handleClose();
          };
        
          const handleDeleteCancel = () => {
            setDeleteConfirmation(false);
            setSelectedDocument(null);
          };
          const handleDeleteConfirm = async () => {
            try {  
                const response = await axios.delete( `http://127.0.0.1:8000/apimanagedocuments/delete/${selectedDocument}/` ,{
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            //'X-CSRFToken': csrftoken,
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        },
                    });
                    const updatedDocuments = documentElements.filter(document => document.id !== selectedDocument);
                    setDocumentElements( updatedDocuments);
                    console.log("Delete Success", response);
                    setDeleteSuccess(true); // Open the delete success modal
                    //alert("Document deleted successfully");

                } catch (error) {
                    console.error("Delete Error", error);
                }finally {
                    setDeleteConfirmation(false);
                    setSelectedDocument(null);
                  }}; 
                  const filteredDocuments = documentElements.filter(document => {
                    return document.title.toLowerCase().includes(Search.toLowerCase()) ||
                    document.type.toLowerCase().includes(Search.toLowerCase());
                });
                const [snackbarState, setSnackbarState] = React.useState({
                  open: false,
                  vertical: 'top',
                  horizontal: 'center',
                  message: ''
                });
                
                const { vertical, horizontal, open, message } = snackbarState;
                
                const handleSnackbarClose = () => {
                  setSnackbarState({ ...snackbarState, open: false });
                };
                const handleViewClick = async (documentId) => {
                  const csrftoken = cookies.load('csrftoken');
                  if (authenticated  ) {
                      try {
                          const response = await axios.post(
                              `http://127.0.0.1:8000/apimanagedocuments/update_studypoints/${documentId}/`,
                              { documentId: documentId },
                              {
                                  withCredentials: true,
                                  headers: {
                                      'Content-Type': 'application/json',
                                      'X-CSRFToken': csrftoken,
                                      'Authorization': `Token  ${localStorage.getItem('token')}`
                                  },
                              }
                          );  `http://127.0.0.1:8000/admin/`
                          console.log("Update Success", response);
                          setSnackbarState({ open: true, vertical: 'bottom', horizontal: 'left', message: '+ 1' });

                          setTimeout(() => {
                            window.open(`/gaindownloadpoints/${documentId}`, '_blank');
                          }, 3000);
                      } catch (error) {
                          console.error("Update Error", error);
                      }

                  } else {
                      console.log("User is not authenticated");

                  }
              };
              const handleClick = (event) => {
                setAnchorEl(event.currentTarget);
              };
            
              const handleClose = () => {
                setAnchorEl(null);
              };        
              const closeDeleteSuccessModal = () => {
                setDeleteSuccess(false); // Close the delete success modal
              };
              const handleChange = (event, value) => {
                setPage(value);
              };
              const [modalOpen, setModalOpen] = useState(false);

              const handleOpenModal = () => {
                setModalOpen(true);
              };
            
              const handleCloseModal = () => {
                setModalOpen(false);
              };
              const specialityImages = {
                'informatique': 'src/assets/BI.gif',
                'science_gestion': 'src/assets/gestion.gif',
                'economie': 'src/assets/eco.gif',
                'master_pro': 'src/assets/mpro.gif',
                'master_recherche': 'src/assets/mrech.gif',
              };
     return (
        <>
        <Navbar />
        <div style={styles.pagecontainer}>

        <SearchBar
  placeholder="Search for a document"
  value={Search}
  onChange={(e) => setSearch(e.target.value)}
tooltipTitle="Type subject name or document type or your major "
/>
        <Link to='/adddocument'>

        <Fab color="primary" aria-label="add" 
        style={{fontSize: 50 ,marginTop:'35px',
        marginLeft:'35px',marginBottom:'10px',color:'white',backgroundColor:'#211A1D'}}>
        <Tooltip title="ADD Document ">
        <AddIcon style={{fontSize: 50}} /></Tooltip>
      </Fab>
   </Link>
        <div className="container" style={styles.documentsContainer}>
        <style>{slideIn}</style>
        {filteredDocuments.slice((page - 1) * 6, page * 6).map((document) => (
         <div key={document.id} style={{...styles.documentContainer, backgroundColor: '#E4DAF6' }} 
         onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.documentContainerHover.backgroundColor}
         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E4DAF6'} 
         >
                <div>
                <div key={document.speciality} style={{...styles.imageContainer, backgroundImage: `url(${specialityImages[document.speciality]})`}}>        

               < MoreVertIcon onClick={handleClick} style={styles.menu} />            
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
                <MenuItem onClick={() => handleDeleteConfirmation(document.id)}>
                    <DeleteIcon />Delete</MenuItem>
                <MenuItem onClick={() => handleViewClick(document.id)}>
                    <VisibilityIcon />View</MenuItem>
                  <Link to={`/updatedocument/${document.id}`} style={{color:'black', textDecoration:'none'}}>
                <MenuItem> <EditIcon />Edit</MenuItem>
                </Link>
            </Menu>
            </div>  
             <div style={styles.infoContainer}>
       
            <div style={styles.titlecss}>{document.title}</div>
        <div style={styles.subjectname}> <p style={styles.p}>Subject : </p> {document.subject_name}</div>
        <div style={styles.type}> <p style={styles.p}>Type : </p>{document.type}</div>
        <div style={styles.year}> {document.year}</div>              
        <div onClick={handleOpenModal}>
              <HoverRating documentId={document.id} />
            </div>
            <Modal
              open={modalOpen}
              onClose={handleCloseModal}
            >
              <RatingModal documentId={document.id} />
            </Modal>

        </div> 
          </div>  </div> ))}
        </div> 
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
               textAlign:'center'}}>Document deleted successfully</h2>

                
                <img src="./src/assets/sucess.gif" alt="Success " 
                style={{marginLeft:'120px'}} />
                </>}
             />
  <Stack spacing={2} sx={{ marginTop: 100 ,marginLeft:80}}>
        <Pagination 
        count={Math.ceil(filteredDocuments.length / 6)}
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
        }} />
      </Stack>
      </div> 
   
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
        </>
    );
  };
const styles ={
  pagecontainer:{

   // backgroundImage: `url(src/assets/1.jpg)`,
    backgroundPosition: 'left',
    backgroundRepeat: 'no-repeat', 
    backgroundSize: '2200px 1280px', 
    width:'100%',
    height:'100%'
},
    inputstyle:{
        marginLeft :'1270px',
        marginRight :'0px',
        marginTop: '20px ',
        fontSize:'14px',
        width:'300px',
        height:'30px',
    
    },
    documentsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr ',
        gridtemplateRows: '5% 5% 5% ',
        //gridGap: '150px',
         //justifyContent: 'space-evenly',
        marginTop: '20px ',
        padding: '0 50px',
        marginLeft:' 120px',

    },
    imageContainer: {
      width: '100%',
      height: '200px',
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat', 
      backgroundSize: 'cover',
      borderRadius:'25px'

    },
    infoContainer: {
      width: '100%',
      height: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    documentContainer: {
        //display: 'flex',
        //flexDirection: 'column',
        //justifyContent: 'space-evenly',
        padding: '10px',
        marginRight:' 10px',
        marginBottom:' -70px',
        marginTop: '-30px ',
        height:'400px',
        width:'350px',
        borderRadius:'20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)', 
        transition: 'background-color .3s ease-in-out',
        animation: 'slideIn 0.5s ease',  
        backgroundColor: '#E4DAF6',      },
        documentContainerHover:{
            backgroundColor: 'white',
            cursor:'pointer'
    
        },
        menu:{
            padding:'3px',
            marginLeft:'10px',marginTop:'10px'
        },
        titlecss:{
            display:'flex',
            justifyContent: 'center',
            fontWeight:'bold',
        },
        subjectname:{
            display:'flex',
            justifyContent: 'left',
            marginTop:'20px',

        },
        year:{
            display:'flex',
            justifyContent: 'right',
            marginTop:'5px',
            marginRight:'15px',
            marginBottom:'15px',
      
        },
        type:{
            display:'flex',
            justifyContent: 'left',
            marginTop:'5px',
            marginRight:'15px',
      
        },
        p:{
        fontWeight:'bold',
        },
};


export default ManageDocuments ;
