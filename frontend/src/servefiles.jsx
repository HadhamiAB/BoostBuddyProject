import  {useState , useEffect ,useRef} from "react";
import { Document, Page } from 'react-pdf';
import { useParams} from 'react-router-dom';//useNavigate,
import { pdfjs } from 'react-pdf';
import axios from 'axios'; 
import cookies from 'react-cookies'; 
import { useAuth } from './authContext.jsx';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const GainDownloadPoints=()=>{
const { authenticated } = useAuth();


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const { id } = useParams(); // get the document ID from the URL
const [file, setFile] = useState(null);
const [startTime, setStartTime] = useState(Date.now());
const [fileType, setFileType] = useState(null);
const [numPages, setNumPages] = useState(null);
const [documentdata, setdocumentdata] = useState([]);
const timeSpentRef = useRef(0);

const onDocumentLoadSuccess = ({ numPages }) => {
  setNumPages(numPages);
}


useEffect(() => {
const documentContent = async (documentId) => {
    //const csrftoken = cookies.load('csrftoken');
    try {
     const response=   await axios.get(
            `http://localhost:8000/apimanagedocuments/getdetails/${documentId}/`, 
            
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    //'X-CSRFToken': csrftoken,
                    'Authorization': `Token  ${localStorage.getItem('token')}`
                },
            }
        );
        const data=response.data;
        console.log("data fetched correctly ", response.data);
        setdocumentdata(data);
    } catch (error) {
        console.error("Error:", error);
    }
};
documentContent(id); 
            },[id]);
            
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
            
const handleDownloadClick = async (documentId) => {
    const csrftoken = cookies.load('csrftoken');
    if (authenticated) {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/apimanagedocuments/updatedownloadpoints/${documentId}/`,
                { documentId: documentId },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                        'Authorization': `Token  ${localStorage.getItem('token')}`
                    },
                }
            );
            console.log("Update Success", response);
            setSnackbarState({ open: true, vertical: 'bottom', horizontal: 'right', message: ' + 1 ' });
        } catch (error) {
            console.error("Update Error", error);
        }
    } else {
        console.log("User is not authenticated");
    }
};
const renderFile = () => {
    if (!file) {
      return <div>Loading ..... </div >;
    }
    switch (fileType) {
      case 'application/pdf':
        return (
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} style={{ overflow: 'auto' }}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={window.innerWidth / 2} />
            ))}
          </Document>
        );
      case 'image/jpeg':
      case 'image/png':
        return <img src={file} alt="Document" />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Display Word files
        // This is a simplification, you might need to handle this differently
        return <iframe src={file} title="Document" />;
      default:
        return <div>Unsupported file type</div>;
    }
  };
  //,borderTop: '1px solid black',
  const sendTimeSpent = async (timeSpent) => {
    const csrftoken = cookies.load('csrftoken');
    //const timeSpentInMinutes = timeSpent / 60;
    try {
        await axios.post(
            `http://localhost:8000/apimanagedocuments/time-spent/${id}/`, 
            { timeSpent: timeSpent  },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token  ${localStorage.getItem('token')}`
                },
            }
        );
    } catch (error) {
        console.error("Error:", error);
    }
};
//const [timeSpent, setTimeSpent] = useState(0);
const [totalTimeSpent, setTotalTimeSpent] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setTotalTimeSpent(totalTimeSpent => totalTimeSpent + 1);
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);

// This useEffect will send totalTimeSpent to the server every minute
useEffect(() => {
  if (totalTimeSpent % 60 === 0) { // If totalTimeSpent is a multiple of 60
    sendTimeSpent(totalTimeSpent / 60); // Send totalTimeSpent in minutes
  }
}, [totalTimeSpent]);
useEffect(() => {
setStartTime(Date.now());
axios.get(`http://localhost:8000/apimanagedocuments/servepdf/${id}/`, {
responseType: 'blob' // Important
})
.then(response => {
setFile(URL.createObjectURL(response.data));
setFileType(response.headers['content-type']);
})
.catch(error => {
console.error("Error:", error);
});
return () => {
//const timeSpent = Date.now() - startTime;
sendTimeSpent(timeSpentRef.current);
};
}, [id]);

  return (
    <>
  <div style={{display: 'flex', padding: '5px'  }}>
    <div style={{ width: '50%', 
    height: '100vh', 
    overflow: 'auto', 
    position: 'fixed', 
    top: 0, 
    left: 0,
    zIndex: 1,
    padding: '10px', display:'flex', border:'4px solid #782DFC',
    justifyContent:'flex-start', marginRight:'20px'  }}>
      {renderFile()}
    </div>
    <div style={{  height:'50px'
, width: '50%',  
     paddingTop: '0px', marginTop:'0px',marginBottom:'10px',marginLeft:'1110px',
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',borderBottom: '1px solid black', }}>
      <h4 style={{ padding:'10px'}}>Date Added:</h4>
        <p style={{ padding:'10px'}}>{new Date(documentdata.date_added).toLocaleDateString()}</p>
        <h4 style={{ padding:'10px'}}>Time Spent:</h4>
        <p style={{ padding:'10px'}}>
        {String(Math.floor(totalTimeSpent / 60)).padStart(2, '0')}:{String(totalTimeSpent % 60).padStart(2, '0')}minutes</p>
        <div>
        <a href={file} download onClick={() => handleDownloadClick(id)} style={{  marginRight: '10px',padding:'20px' }}>
   
            <DownloadForOfflineIcon style={{ fontSize:'50px',marginTop: '0px'}}/>
        </a>
      </div>
    </div> 

    </div>   

    <div style={{ width: '39%', height: '100%', overflow: 'auto', padding: '10px',
    marginLeft :'1050px',boxSizing: 'border-box', display: 'flex', flexDirection: 'column', marginTop:'0px' }}>
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <h2>Document Content:</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p>{documentdata.content}</p>
        </AccordionDetails>
      </Accordion>        
      </div>
     
  
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

export default GainDownloadPoints;

{/* const [chatInput, setChatInput] = useState('');
const [chatMessages, setChatMessages] = useState([]);

const handleInputChange = (event) => {
  setChatInput(event.target.value);
};
  
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const response = await axios.post('http://localhost:8000//apimanagedocuments/chatbotapi/chat/', { message: chatInput });
  setChatMessages([...chatMessages, { role: 'user', content: chatInput }, { role: 'assistant', content: response.data.message }]);
  setChatInput('');
};  <div style={{ marginTop: '100px' }}>
      <form onSubmit={handleFormSubmit} style={{marginTop:'100px', border:'1px solid black'}} >
        <input type="text" value={chatInput} onChange={handleInputChange} style={{width: '80%', height: '40px'}} />
  <button type="submit" style={{width: '20%', height: '40px'}}>Send</button>
      </form>
      <ul>
        {chatMessages.map((message, index) => (
          <li key={index}>{message.role === 'user' ? 'You: ' : 'Assistant: '}{message.content}</li>
        ))}
      </ul>
    </div>  */}