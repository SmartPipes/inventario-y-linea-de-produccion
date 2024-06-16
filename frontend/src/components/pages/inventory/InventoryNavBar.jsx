import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';

const InventoryNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage }) => {
    return (
        <>
            <NavBarMenu />
            <NavBarActions />
            <NavBarFilters 
                applyFilters={applyFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default InventoryNavBar;
