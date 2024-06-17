import React from 'react';
import {Navbar} from './components/Navbar';
import { Outlet } from 'react-router-dom';
import {GlobalStyles} from './Styled/Global.styled';
import { ChakraProvider } from '@chakra-ui/react';

const App = () => {
    return (
        <ChakraProvider>
        <div className='App'>
            <Navbar/>
            <Outlet/>
            <GlobalStyles/>
        </div>
        </ChakraProvider>
    );
};

export default App;
