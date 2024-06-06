import React, { useState } from 'react';
import InventoryNavBar from './InventoryNavBar';
import InventoryList from './InventoryList';

const InventoryPage = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const applyFilters = (filters) => {
        setSelectedFilters(filters);
    };

    return (
        <div>
            <InventoryNavBar applyFilters={applyFilters} />
            <InventoryList selectedFilters={selectedFilters} />
        </div>
    );
};

export default InventoryPage;
