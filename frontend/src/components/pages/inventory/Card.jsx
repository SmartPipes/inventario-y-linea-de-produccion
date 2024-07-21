import React from 'react';
import PropTypes from 'prop-types';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody, CardFooter, PriceTag } from '../../../Styled/Inventory.styled';

const Card = ({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse, onCardClick }) => {
    const handleCardClick = () => {
        onCardClick({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse });
    };

    return (
        <InventoryCard onClick={handleCardClick}>
            <CardImage src={image_icon} alt={item_name} />
            <CardBody>
                <CardHeader>
                    <CardTitle>{item_name}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <PriceTag>Price: ${item_price}</PriceTag>
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
    onCardClick: PropTypes.func.isRequired,
};

export default Card;
