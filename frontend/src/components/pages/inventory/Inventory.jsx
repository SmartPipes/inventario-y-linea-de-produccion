import React from 'react';
import InventoryList from './InventoryList';
import { MainContent } from '../../../Styled/Production.styled';

const InventoryPage = () => {
    return (
        <MainContent>
            <InventoryList />
        </MainContent>
    );
};

export default InventoryPage;
