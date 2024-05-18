import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';


//global state : share with it auth across app
const AuthContext = createContext();

//manaage state across components 
export const AuthProvider = ({ children }) => {
  //track auth status
  const [authenticated, setAuthenticated] = useState(false);
  //save user data
  const [user, setUser] = useState(null); 

  const login = (userData) => {
    
    setAuthenticated(true);
    setUser(userData);

    localStorage.setItem('user', JSON.stringify(userData));

  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');

   };
   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setAuthenticated(true);
      setUser(userData);
    }
  }, []);
  return (
    //access authContext and return each state
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
