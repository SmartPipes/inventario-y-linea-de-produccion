import React from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, ActionsContainer } from '../../../Styled/DeliveryNavBar.styled';

const NavBarActions = ({ newItemPath }) => {
    return (
        <ActionsContainer>
            <Link to={newItemPath}>
                <ActionButton>New Item</ActionButton>
            </Link>
        </ActionsContainer>
    );
};

export default NavBarActions;
