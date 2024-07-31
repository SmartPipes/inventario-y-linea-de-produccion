import React from 'react';
import {Navbar} from './components/Navbar';
import { Outlet } from 'react-router-dom';
import {GlobalStyles} from './Styled/Global.styled';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
    return (
        <div className='App'>
            <Navbar/>
            <Outlet/>
            <GlobalStyles/>
        </div>
    );
};

export default App;
