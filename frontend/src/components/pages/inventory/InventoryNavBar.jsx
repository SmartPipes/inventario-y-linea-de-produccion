import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';
import { NavBarContainer, NavBarActionsFiltersContainer } from '../../../Styled/InventoryNavBar.styled';

const InventoryNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage }) => {
    return (
        <NavBarContainer>
            <NavBarMenu title="Inventory" />
            <NavBarActionsFiltersContainer>
                <NavBarActions newItemPath="/inventory/new-item" />
                <NavBarFilters 
                    applyFilters={applyFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchPlaceholder="Buscar en inventario..."
                    filters={['Products', 'Raw Material', 'Precio ASC', 'Warehouse']}
                />
            </NavBarActionsFiltersContainer>
        </NavBarContainer>
    );
};

export default InventoryNavBar;
