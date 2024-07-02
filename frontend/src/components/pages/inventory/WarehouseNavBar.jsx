import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';
import { NavBarContainer, NavBarActionsFiltersContainer } from '../../../Styled/InventoryNavBar.styled';

const WarehouseNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage, onSearchChange }) => {
    return (
        <NavBarContainer>
            <NavBarMenu title="Almacenes" />
            <NavBarActionsFiltersContainer>
                <NavBarActions newItemPath="/inventory/new-warehouse" />
                <NavBarFilters 
                    applyFilters={applyFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchPlaceholder="Buscar en almacenes..."
                    filters={[]}
                    onSearchChange={onSearchChange}
                />
            </NavBarActionsFiltersContainer>
        </NavBarContainer>
    );
};

export default WarehouseNavBar;
