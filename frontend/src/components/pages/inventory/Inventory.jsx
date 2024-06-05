import React from 'react';
import InventoryList from './InventoryList';
import InventoryNavBar from './InventoryNavBar';

const InventoryPage = () => {
    return (
        <div>
            <InventoryNavBar />
            <InventoryList />
        </div>
    );
};

export default InventoryPage;
