import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  height: 460,
  bgcolor: 'white',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  p: 4,
};

const RatingModal = ({ documentId, onClose }) => {
  const [ratingCounts, setRatingCounts] = useState([]);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/apimanagedocuments/getrate/${documentId}/`);
        console.log(response.data);
        setRatingCounts(response.data);

        // Calculate average rating
        const totalRatings = ratingCounts.reduce((acc, curr) => acc + curr.count, 0);
        const totalRatingValue = ratingCounts.reduce((acc, curr) => acc + curr.value * curr.count, 0);
        const average = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
        setAverageRating(average);

      } catch (error) {
        setError(error);
      }
    };

    fetchData(); // Fetch ratings data when the modal is opened
  }, [documentId, ratingCounts]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        {ratingCounts.length === 0 ? (
          <div>No ratings yet.</div>
        ) : (
          <>
       

            {ratingCounts.map(({ value, count }) => (
              <div key={value} style={{display:'flex', padding:'6px',
               marginLeft:'20px', marginTop:'4px'}}>
      <Typography component="legend" sx={{ fontWeight: 'bold', marginTop:'4px' }}>{count}</Typography>
<Rating name={`star-rating-${value}`} value={value} 
readOnly precision={0.5} sx={{ fontSize: '28px' , marginLeft:'10px'}} />
              </div>
            ))}   
       <Typography component="legend" sx={{ fontWeight: 'bold',
        marginTop:'-20px' ,fontSize:'30px'
            ,marginLeft:'280px',}}>Average Rating</Typography>
            <Rating name="average-rating" value={averageRating}
             sx={{ fontSize: '35px' , marginLeft:'320px'}}
            readOnly precision={0.5} />
          </>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            color: 'inherit',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default RatingModal;
