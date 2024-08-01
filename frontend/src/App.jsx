import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { GlobalStyles } from './Styled/Global.styled';
import Login from './components/pages/User/Login';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name'));

  if (!token) {
    return <Login setToken={setToken} setUserRole={setUserRole} setUserName={setUserName} />;
  }

  return (
    <div className='App'>
      <Navbar userRole={userRole} userName={userName} />
      <Outlet />
      <GlobalStyles />
    </div>
  );
};

export default App;
