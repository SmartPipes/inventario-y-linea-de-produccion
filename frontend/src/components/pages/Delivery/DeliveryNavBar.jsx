import React from 'react';
import NavBarMenu from './NavBarMenu';
import NavBarActions from './NavBarActions';
import NavBarFilters from './NavBarFilters';
import { NavBarContainer, NavBarActionsFiltersContainer } from '../../../Styled/DeliveryNavBar.styled';

const DeliveryNavBar = ({ applyFilters, currentPage, totalPages, setCurrentPage }) => {
    return (
        <NavBarContainer>
            <NavBarMenu title="Delivery" />
            <NavBarActionsFiltersContainer>
                <NavBarActions newItemPath="/delivery/new-item" />
                <NavBarFilters 
                    applyFilters={applyFilters}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchPlaceholder="Buscar en entregas..."
                    filters={['Carts', 'Sales', 'Payments', 'Cart Details', 'Sale Details']}
                />
            </NavBarActionsFiltersContainer>
        </NavBarContainer>
    );
};

export default DeliveryNavBar;
