import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody, CardFooter, PriceTag, StockInfo } from '../../../Styled/Inventory.styled';

const Card = ({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse, children }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/inventory/new-item', {
            state: {
                item_id,
                item_name,
                item_description,
                image_icon,
                item_price,
                stock,
                item_type,
                warehouse,
                isEditMode: true
            }
        });
    };

    return (
        <InventoryCard className="inventory-card" onClick={handleCardClick}>
            <CardImage src={image_icon} alt={item_name} />
            <CardBody>
                <CardHeader>
                    <CardTitle>{item_name}</CardTitle>
                </CardHeader>
                <PriceTag>Precio: ${item_price}</PriceTag>
                <StockInfo>Disponible: {stock} Unidades</StockInfo>
                <CardFooter>
                    <p>Almacén: {warehouse}</p>
                    {children}
                </CardFooter>
            </CardBody>
        </InventoryCard>
    );
};

Card.propTypes = {
    inventory_id: PropTypes.number.isRequired,
    item_id: PropTypes.number.isRequired,
    item_name: PropTypes.string.isRequired,
    item_description: PropTypes.string,
    image_icon: PropTypes.string.isRequired,
    item_price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    item_type: PropTypes.string.isRequired,
    warehouse: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Card;
