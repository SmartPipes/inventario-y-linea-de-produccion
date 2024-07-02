import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';
import { NavBarContainer, NavBarActionsFiltersContainer } from '../../../Styled/InventoryNavBar.styled';

const CategoryNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage, onSearchChange }) => {
    return (
        <NavBarContainer>
            <NavBarMenu title="Categorías" />
            <NavBarActionsFiltersContainer>
                <NavBarActions newItemPath="/inventory/new-category" />
                <NavBarFilters 
                    applyFilters={applyFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchPlaceholder="Buscar en categorías..."
                    filters={[]}
                    onSearchChange={onSearchChange}
                />
            </NavBarActionsFiltersContainer>
        </NavBarContainer>
    );
};

export default CategoryNavBar;
