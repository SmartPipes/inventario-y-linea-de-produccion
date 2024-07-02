import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';
import { NavBarContainer, NavBarActionsFiltersContainer } from '../../../Styled/InventoryNavBar.styled';

const SupplierNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage, onSearchChange }) => {
    return (
        <NavBarContainer>
            <NavBarMenu title="Proveedores" />
            <NavBarActionsFiltersContainer>
                <NavBarActions newItemPath="/inventory/new-supplier" />
                <NavBarFilters 
                    applyFilters={applyFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchPlaceholder="Buscar en proveedores..."
                    filters={[]}
                    onSearchChange={onSearchChange}
                />
            </NavBarActionsFiltersContainer>
        </NavBarContainer>
    );
};

export default SupplierNavBar;
