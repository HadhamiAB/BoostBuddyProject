import Navbar from "./navbar";
import { useState ,useEffect } from 'react';
import axios  from "axios";
import cookies from 'react-cookies';
import TipElement from "./modals/viewmoremodaltip";
import SearchBar from "./modals/searchbar.jsx";
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
const ViewTips =() => {

    const [tips, settips] = useState([]);
    const [Search , setSearch]=useState('');
    const [page, setPage] = useState(1); 

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
          // Update the post's likes in the state
         // Update the tip's likes in the state
            settips(tips.map(t => t.id === tip.id ? {...t, likes: t.likes + 1} : t));
        } catch(error) {
        console.error("Error liking tip", error);
        }
      };
    useEffect(() => {
    const fetchingTips=async () => {
        const apiUrl ='http://127.0.0.1:8000/mindmattersapi/viewalltips/';
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
            const fetchedtips=response.data;
            console.log("Success", fetchedtips);
           settips(fetchedtips);
        }catch(error){
            console.error("Error fetching tips ", error);
        }
    };
        fetchingTips();
    },[]);
    
    const filteredTips = tips.filter(tipcontent => {
        return tipcontent.title.toLowerCase().includes(Search.toLowerCase()) ||
        tipcontent.tip.toLowerCase().includes(Search.toLowerCase());
    });
    const handleChange = (event, value) => {
        setPage(value);
      };
    
     
    return (
        <>
        <Navbar />
          <div style={styles.pageContainer}>
            <SearchBar
                placeholder="Search for Tips "
                value={Search}
                onChange={(e) => setSearch(e.target.value)}
                tooltipTitle="Type tip topic or a key word "

                />
   <style>{slideIn}</style>
        <div style={styles.container}>
                {filteredTips.slice((page - 1) * 6, page * 6).map (tipcontent =>(
                <div key={tipcontent.id}  style={styles.tipcontainer}>
            
            <div style={{marginTop:'18px', textAlign:'center', fontWeight:'bold',fontSize:'18px'}}>
            {tipcontent.title}</div>
            <div style={{marginTop:'5px',padding:'10px',}}>
                
                <TipElement title={tipcontent.title} tip={tipcontent.tip} /></div>
                <div style={styles.likeContainer}>
                <input type="checkbox" id={`toggle-heart-${tipcontent.id}`} className="like" onClick={() => handleLikeClick(tipcontent)} />
                <label htmlFor={`toggle-heart-${tipcontent.id}`} className="hearth" aria-label='like'>
                    
                </label>
                {tipcontent.likes}
            </div></div>
               ))}
            </div>
            <Stack spacing={2} sx={{ marginTop: '-50px ',marginLeft:80}}>
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
     pageContainer: {
   minHeight:'100vh',
    width:'100%',
    height:'100%',
    margin :'0',
    
  },
    container:{
        width:'1550px',
        marginLeft:'70px',
        marginTop:'10px',
        height:'100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr', 
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
        marginTop:'60px',
        marginBottom:'0px',

        height:'270px',
        borderRadius:'20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 1)', 
        //background:'linear-gradient(to top right, #F0E9F7 20%, #BC9FC8  40% ,#F0E9F7 40%)',
        background:'linear-gradient(to top right,white 50%, #cec8ef   40% )',
      },

};
export default ViewTips;