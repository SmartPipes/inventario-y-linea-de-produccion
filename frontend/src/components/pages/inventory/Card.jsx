import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody } from '../../../Styled/Inventory.styled';

const Card = ({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, children }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/inventory/new-item', {
            state: {
                item_id: item_id,
                item_name: item_name,
                item_description: item_description,
                image_icon: image_icon,
                item_price: item_price,
                stock: stock,
                item_type: item_type,
                isEditMode: true
            }
        });
    };

    return (
        <InventoryCard className="inventory-card" onClick={handleCardClick}>
            <CardBody>
                <CardHeader>
                    <CardTitle>{item_name}</CardTitle>
                </CardHeader>
                <p>Precio: ${item_price}</p>
                <p>Disponible: {stock} Unidades</p>
                {children}
            </CardBody>
            <CardImage src={image_icon} alt={item_name} />
        </InventoryCard>
    );
};

Card.propTypes = {
    inventory_id: PropTypes.number.isRequired,
    item_id: PropTypes.number.isRequired,
    item_name: PropTypes.string.isRequired,
    item_description: PropTypes.string, // Added description prop
    image_icon: PropTypes.string.isRequired,
    item_price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    item_type: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Card;
