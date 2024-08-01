import React from 'react';
import  Navbar  from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { GlobalStyles } from './Styled/Global.styled';
import { CartProvider } from './context/CartContext';

const App = () => {
    return (
        <div className='App'>
            <CartProvider>
                <Navbar />
                <Outlet />
                <GlobalStyles />
            </CartProvider>
        </div>
    );
};

export default App;
