import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { GlobalStyles } from './Styled/Global.styled';
import { CartProvider } from './context/CartContext';
import Login from './components/pages/Auth/Login';
import { logout } from './ApiClient';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      logout();
      setToken(null);
      setUserRole(null);
      setUserName(null);
    }
  }, [location]);

  if (!token) {
    return <Login setToken={setToken} setUserRole={setUserRole} setUserName={setUserName} />;
  }

  return (
    <div className='App'>
      <CartProvider>
        <Navbar userRole={userRole} userName={userName} setToken={setToken} setUserRole={setUserRole} setUserName={setUserName} />
        <Outlet />
        <GlobalStyles />
      </CartProvider>
    </div>
  );
};

export default App;
