import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';
import UpdateModal from './ModalsInv/UpdateModal';
import { FormGroup } from '../../../Styled/ModalStyled';
import { Labels } from '../../../Styled/Global.styled';

// Configuración global de axios para incluir el token en cada solicitud
axios.defaults.baseURL = 'https://smartpipes.cloud/api/inventory/';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3Nzc3OTk1LCJpYXQiOjE3MTc2OTE1OTUsImp0aSI6IjhmYWVhNDcxZjlmYTQ4MDM4NTBkZjhhZjQ2N2VhZTkyIiwidXNlcl9pZCI6Mn0.OIpuwLQOeVb_OMZMI1MG0t2Me6yy7R8Jn-i6eo92urM';

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
        saveChanges({ name: newTitle, description: "Descripción actualizada", price: cardPrice, status: "Active" }, 'products');
    };

    const handlePriceChange = (e) => {
        const newPrice = parseFloat(e.target.value);
        setCardPrice(newPrice);
        saveChanges({ name: cardTitle, description: "Descripción actualizada", price: newPrice, status: "Active" }, 'products');
    };

    const handleStockChange = (e) => {
        const newStock = parseInt(e.target.value, 10);
        setCardStock(newStock);
        saveChanges({ stock: newStock, item_id: item_id, item_type: "product", warehouse: "default" }, 'inventory');
    };

    const saveChanges = async (data, type) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = type === 'products' ? `products/${item_id}/` : `inventory/${inventory_id}/`;
            const response = await axios.put(url, data);
            console.log('Respuesta del servidor:', response.data);
        } catch (err) {
            setError(err);
            console.error('Error al actualizar:', err.response ? err.response.data : err.message);
        } finally {
            setIsLoading(false);
        }
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
                    {isLoading && <p>Actualizando...</p>}
                    {error && <p>Error al actualizar: {error.message}</p>}
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
