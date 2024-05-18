import Navbar from './navbar.jsx';
import'./css/home.css';
import CardFlip from './css/cards.jsx';
const Home = () => {
  return (
    <div className="home-page" > 
      <div className="navbar">
        <Navbar />
      </div>

      <div className="slides" >
        <section style={styles.page}>
          <h1 style={{marginTop:'80px', marginLeft:'40px'
            , width:'250px' , textAlign:'left',
            fontFamily:'Segoe Print, Arial, Helvetica, sans-serif',
            textShadow: '8px 2px 8px #888',

          }}>Boost </h1>
          <h1 style={{marginTop:'170px', marginLeft:'0px'
            , width:'120px' , textAlign:'left',
            fontFamily:'Segoe Print, Arial, Helvetica, sans-serif'
          ,            textShadow: '8px 2px 8px #888',

          }}> Buddy </h1>
          <CardFlip 
            frontTitle="Documents" 
            frontContent="Dive into a world of knowledge and discovery. Flip the card to start your journey!" 
            backTitle="Documents" 
            backContent="Step into your personal document hub, where managing your files is a breeze and exploring others" 
            link="/viewalldocuments"
            place="Go to Documents"
          />
          <CardFlip 
            frontTitle="Posts" 
            frontContent="Step into the shoes of interns who’ve been there. Flip the card to explore real internship experiences that could shape your future!" 
            backTitle="Posts" 
            backContent="Welcome to your interactive post board! A single click lets you craft, modify, or remove your experiences, and immerses you in the internship journeys shared by others!" 
            link="/viewallposts"
            place="Go to posts"
          />
          <CardFlip 
            frontTitle="Tips" 
            frontContent="Ready to level up your soft skills? One click unveils a wealth of tips" 
            backTitle="Tips" 
            backContent="Embark on a journey of self-improvement! One click opens a world where you can create, tweak, or remove your tips, and delve into a sea of wisdom shared by others!" 
            link="/viewalltips"
            place="Go to Tips"
          />
        </section>
     
    </div>
  </div>
  );
};
const styles={
page:{
  backgroundImage: `url(src/assets/homebg1.jpg)`,
    backgroundPosition: 'left',
    backgroundRepeat: 'no-repeat', 
    backgroundSize: '800px 780px',
    width:'150vh',
    minHeight: '100vh', 

    height: '100%', },
};
export default Home;
