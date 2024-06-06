import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';
import UpdateModal from './ModalsInv/UpdateModal';
import { FormGroup } from '../../../Styled/ModalStyled';
import { Labels } from '../../../Styled/Global.styled';

const Card = ({ inventory_id, item_id, item_name, image_icon, item_price, stock, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardTitle, setCardTitle] = useState(item_name);
    const [cardPrice, setCardPrice] = useState(item_price);
    const [cardStock, setCardStock] = useState(stock);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setCardTitle(newTitle);
        saveChanges({ name: newTitle }, 'product');
    };

    const handlePriceChange = (e) => {
        const newPrice = parseFloat(e.target.value);
        setCardPrice(newPrice);
        saveChanges({ price: newPrice }, 'product');
    };

    const handleStockChange = (e) => {
        const newStock = parseInt(e.target.value, 10);
        setCardStock(newStock);
        saveChanges({ stock: newStock }, 'inventory');
    };

    return (
        <>
            <InventoryCard className="inventory-card" onClick={handleOpenModal}>
                <CardBody>
                    <CardHeader>
                        <CardTitle>{cardTitle}</CardTitle>
                    </CardHeader>
                    <p>Precio: ${cardPrice}</p>
                    <p>Disponible: {cardStock} Unidades</p>
                    {children}
                </CardBody>
                <CardImage src={image_icon} alt={cardTitle} />
            </InventoryCard>
            <UpdateModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form>
                    <FormGroup>
                        <Labels>Título</Labels>
                        <input
                            type="text"
                            value={cardTitle}
                            onChange={handleTitleChange}
                            placeholder="Ingresa el nuevo título"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Labels>Precio</Labels>
                        <input
                            type="number"
                            value={cardPrice}
                            onChange={handlePriceChange}
                            placeholder="Ingresa el nuevo precio"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Labels>Existencia</Labels>
                        <input
                            type="number"
                            value={cardStock}
                            onChange={handleStockChange}
                            placeholder="Ingresa la nueva existencia"
                        />
                    </FormGroup>
                    {children}
                </form>
            </UpdateModal>
        </>
    );
};

Card.propTypes = {
    inventory_id: PropTypes.number.isRequired,
    item_id: PropTypes.number.isRequired,
    item_name: PropTypes.string.isRequired,
    image_icon: PropTypes.string.isRequired,
    item_price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    children: PropTypes.node,
};

export default Card;
