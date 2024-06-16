import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../../Styled/InventoryForm.styled';

const NavBarActions = () => {
    const navigate = useNavigate();

    const handleNewButtonClick = () => {
        navigate('/inventory/new-item');
    };

    return (
        <Button onClick={handleNewButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo
        </Button>
    );
};

export default NavBarActions;
