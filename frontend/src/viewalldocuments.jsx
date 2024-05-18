import Navbar from "./navbar";
import axios from "axios";
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from './authContext.jsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchBar from "./modals/searchbar.jsx";
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { Modal } from '@mui/material';
import RatingModal from "./modals/rating.jsx";
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

const getLabelText = (value) => {
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
            'Authorization': `Token ${localStorage.getItem('token')}`
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

const ViewAllDocuments = () => {
  const { authenticated } = useAuth();
  const [documentElements, setDocumentElements] = useState([]);
  const [Search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  useEffect(() => {
    const fetchingData = async () => {
      const apiUrl = 'http://127.0.0.1:8000/apimanagedocuments/view/';
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });
        const documents = response.data;
        console.log("Success", documents);
        setDocumentElements(documents);
      } catch (error) {
        console.error("Error fetching data ", error);
      }
    };
    fetchingData();
  }, []);

  const filteredDocuments = documentElements.filter(document => {
    return document.subject_name.toLowerCase().includes(Search.toLowerCase()) ||
      document.speciality.toLowerCase().includes(Search.toLowerCase()) ||
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
    if (authenticated) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/apimanagedocuments/update_studypoints/${documentId}/`,
          { documentId: documentId },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token  ${localStorage.getItem('token')}`
            },
          }
        );
        console.log("Update Success", response);
        setSnackbarState({ open: true, vertical: 'top', horizontal: 'left', message: '+ 1' });

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

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleOpenModal = (documentId) => {
    setSelectedDocumentId(documentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
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
        <div className="container" style={styles.documentsContainer}>
          <style>{slideIn}</style>
          {filteredDocuments.slice((page - 1) * 6, page * 6).map((document) => (
            <div key={document.id} style={{ ...styles.documentContainer, backgroundColor: '#E4DAF6' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.documentContainerHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E4DAF6'} >
              <div>
                <div key={document.speciality} style={{ ...styles.imageContainer, backgroundImage: `url(${specialityImages[document.speciality]})` }}>

                  <VisibilityIcon onClick={() => handleViewClick(document.id)}
                    style={{ backgroundColor: 'transparent', color: 'black', marginLeft: '10px', marginTop: '10px' }} />

                </div>
                <div style={styles.infoContainer}>
                  <div style={styles.titlecss}>{document.title}</div>
                  <div style={styles.subjectname}> <p style={styles.p}>Subject : </p> {document.subject_name}</div>
                  <div style={styles.type}> <p style={styles.p}>Type : </p>{document.type}</div>
                  <div style={styles.year}> {document.year}</div>
                  <div onClick={() => handleOpenModal(document.id)}>
                    <HoverRating documentId={document.id} />
                    <div>{document.averageRating}</div> 
                                      </div>
                </div>
              </div>
            </div>
          ))}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
          >
            <RatingModal documentId={selectedDocumentId} onClose={handleCloseModal} />
          </Modal>
        </div>
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleSnackbarClose}
        message={message}
        key={vertical + horizontal}
      />
        <Stack spacing={2} sx={{ marginTop: 110, marginLeft: 80 }}>
          <Pagination count={Math.ceil(filteredDocuments.length / 6)}
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
    </>
  );
};

const styles = {
  pagecontainer: {
    backgroundPosition: 'left',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '2200px 1280px',
    width: '100%',
    height: '100%',
  },
  documentsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr  ',
    gridtemplateRows: '5% 5% 5% ',
    marginTop: '50px ',
    padding: '0 50px',
    marginLeft: ' 70px',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '25px'
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
    color: 'black',
    padding: '10px',
    marginRight: ' 10px',
    marginBottom: ' -70px',
    height: '400px',
    width: '350px',
    borderRadius: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)',
    transition: 'background-color .3s ease-in-out',
    animation: 'slideIn 0.5s ease',
    backgroundColor: '#E4DAF6',
  },
  documentContainerHover: {
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  menu: {
    padding: '3px',
  },
  titlecss: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  subjectname: {
    display: 'flex',
    justifyContent: 'left',
    marginTop: '15px',
  },
  year: {
    display: 'flex',
    justifyContent: 'right',
    marginTop: '5px',
    marginRight: '15px',
    marginBottom: '15px',
  },
  type: {
    display: 'flex',
    justifyContent: 'left',
    marginTop: '5px',
    marginRight: '15px',
  },
  p: {
    fontWeight: 'bold',
  },
};

export default ViewAllDocuments;
