import React from 'react';
import PropTypes from 'prop-types';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody, PriceTag, StockTag } from '../../../Styled/Inventory.styled';

const Card = ({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse, totalStock, onCardClick }) => {
    const handleCardClick = () => {
        onCardClick({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse });
    };

    return (
        <InventoryCard onClick={handleCardClick} className="inventory-card">
            <CardHeader>
                <CardBody>
                    <CardTitle>{item_name}</CardTitle>
                    <PriceTag>Price: ${item_price}</PriceTag>
                    {totalStock !== null && <StockTag>Total Stock: {totalStock}</StockTag>}
                </CardBody>
                <CardImage src={image_icon} alt={item_name} />
            </CardHeader>
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
    totalStock: PropTypes.number, // Recibir totalStock como prop
    onCardClick: PropTypes.func.isRequired,
};

export default React.memo(Card);
