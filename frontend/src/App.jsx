import {  Navigate, useLocation,BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import SignUp from './signupform.jsx';
import Home from './home.jsx';
import LogIn from './loginform.jsx';
import ManageDocuments from './managedocuments.jsx';
import ManageInternships from './manageinternships.jsx';
import UpdateDocuments from './updateDocument.jsx';
import AddInternshipExperience from './addIE.jsx';
import Feedback from './feeback.jsx';
import ManageProfile from './manageprofile.jsx';
import UpdatePosts from './updatepost.jsx';
import GainDownloadPoints from './servefiles.jsx';
import { AuthProvider, useAuth } from './authContext';
import ViewTips from './ViewTips.jsx';
import ShareTips from './sharetips.jsx';
import ViewDashboard from './dashboard.jsx';
import ViewAllDocuments from './viewalldocuments.jsx';
import ViewAllPosts from './viewallposts.jsx';
import AddDocument from './adddocument.jsx';
const App = () => {
  // Define routes
  let routes = [
    { path: '/', element: <Home /> },
    { path: '/feedback', element: <Feedback /> },
    { path: '/manageprofile', element: <ManageProfile /> },
    { path: '/managedocuments', element: <ManageDocuments /> },
    { path: '/adddocument', element: <AddDocument /> },
    { path: '/viewalldocuments', element: <ViewAllDocuments /> },
    { path: '/updatedocument/:id', element: <UpdateDocuments /> },
    { path: '/gaindownloadpoints/:id', element: <GainDownloadPoints /> },
    { path: '/manageIE', element: <ManageInternships /> },
    { path: '/viewallposts', element: <ViewAllPosts /> },
    { path: '/updatepost/:id', element: <UpdatePosts /> },
    { path: '/addIE', element: <AddInternshipExperience /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element: <LogIn /> },
    { path: '/viewalltips', element: <ViewTips /> },
    { path: '/sharetips', element: <ShareTips /> },
    { path: '/dashboard', element: <ViewDashboard /> },
  ];

  return (
    //store and pass auth status
    <AuthProvider>
      <Router>
        <AppRoutes routes={routes} />
      </Router>
    </AuthProvider>
  );
};

const AppRoutes = ({ routes }) => {
  //check authentication status 
  const { authenticated } = useAuth();
  //access to current URL 
  const location = useLocation();
  const protectedRoutes = ['/managedocuments', '/manageIE', '/dashboard', '/viewalldocuments', '/viewallposts','/sharetips','/viewalltips'];

  if (authenticated) {
    //path:URL , element :component to render 
    routes.push({ path: '/managedocuments', element: <ManageDocuments /> });
    routes.push({ path: '/manageIE', element: <ManageInternships /> });
    routes.push({ path: '/dashboard', element: <ViewDashboard /> });
    routes.push({ path: '/viewalldocuments', element: <ViewAllDocuments /> });
    routes.push({ path: '/viewallposts', element: <ViewAllPosts /> });
    routes.push({  path: '/sharetips', element: <ShareTips />  });
    routes.push({  path: '/viewalltips', element: <ViewTips />  });
  }

  if (!authenticated && protectedRoutes.includes(location.pathname)) {
    // replace : can't go back to previous page 
    return <Navigate to="/login" replace />;
  }
  //useRoutes match current location with defined routes 
  let element = useRoutes(routes);

  return element;
};

export default App;