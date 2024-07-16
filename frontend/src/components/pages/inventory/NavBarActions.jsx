import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../../Styled/InventoryForm.styled';

const NavBarActions = ({ newItemPath }) => {
    const navigate = useNavigate();

    const handleNewButtonClick = () => {
        navigate(newItemPath);
    };

    return (
        <Button onClick={handleNewButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> New
        </Button>
    );
};

export default NavBarActions;
