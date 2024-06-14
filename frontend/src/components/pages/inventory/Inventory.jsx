import React, { useState } from 'react';
import InventoryNavBar from './InventoryNavBar';
import InventoryList from './InventoryList';
import { MainContent } from '../../../Styled/Production.styled';

const InventoryPage = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const applyFilters = (filters) => {
        setSelectedFilters(filters);
    };

    return (
        <MainContent>
            <InventoryNavBar applyFilters={applyFilters} />
            <InventoryList selectedFilters={selectedFilters} />
        </MainContent>
    );
};

export default InventoryPage;
