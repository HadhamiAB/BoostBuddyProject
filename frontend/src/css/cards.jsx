import './cards.css';
import './button.css';
import { Link } from 'react-router-dom';
const CardFlip = ({ frontTitle, frontContent, backTitle, backContent,link ,place}) => {
  return (
    <div className="maincontainer">
      <div className="thecard">
        <div className="thefront">
          <h1>{frontTitle}</h1>
          <p>{frontContent}</p>
        </div>
        <div className="theback">
          <h1>{backTitle}</h1>
          <p>{backContent}</p>
          <Link to={link}>
            <button 
          className="space-btn" 
          style={{backgroundColor:'white', color:'black', 
          fontSize:'14px',
          padding:'5px' , marginTop:'', marginBottom:'',marginLeft:'0px', marginRight:''
      ,width:'150px',height:'40px',
      }}
            >{place}</button>
          </Link>        </div>
      </div>
    </div>
  );
};

export default CardFlip;
