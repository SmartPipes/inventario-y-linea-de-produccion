import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { GlobalStyles } from './Styled/Global.styled';
import Login from './components/pages/User/Login';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }, [token]);

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return (
        <div className='App'>
            <Navbar />
            <Outlet />
            <GlobalStyles />
        </div>
    );
};

export default App;
