// src/components/Card.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';
import UpdateModal from './ModalsInv/UpdateModal';
import { FormGroup } from '../../../Styled/ModalStyled';

const Card = ({ title, image, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardTitle, setCardTitle] = useState(title);
    const [cardImage, setCardImage] = useState(image);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTitleChange = (e) => {
        setCardTitle(e.target.value);
    };

    const handleImageChange = (e) => {
        setCardImage(e.target.value);
    };

    return (
        <>
            <InventoryCard className="inventory-card" onClick={handleOpenModal}>
                <CardBody>
                    <CardHeader>
                        <CardTitle>{cardTitle}</CardTitle>
                    </CardHeader>
                    {children}
                </CardBody>
                <CardImage src={cardImage} alt={cardTitle} />
            </InventoryCard>
            <UpdateModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form>
                    <FormGroup>
                        <label>Title</label>
                        <input type="text" value={cardTitle} onChange={handleTitleChange} placeholder="Enter new title" />
                    </FormGroup>
                    <FormGroup>
                        <label>Image URL</label>
                        <input type="text" value={cardImage} onChange={handleImageChange} placeholder="Enter new image URL" />
                    </FormGroup>
                    {children}
                </form>
            </UpdateModal>
        </>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Card;
