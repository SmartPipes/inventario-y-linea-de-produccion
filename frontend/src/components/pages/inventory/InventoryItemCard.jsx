import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const InventoryItemCard = ({ item }) => {
    return (
        <Card 
            inventory_id={item.inventory_id}
            item_id={item.item_id}
            item_name={item.item_name} 
            image_icon={item.image_icon} 
            item_price={item.item_price} 
            item_type={item.item_type}
            rawMaterial_id={item.rawMaterial_id}
            stock={item.stock} 
        />
    );
};

InventoryItemCard.propTypes = {
    item: PropTypes.shape({
        inventory_id: PropTypes.number.isRequired,
        item_id: PropTypes.number.isRequired,
        rawMaterial_id: PropTypes.number.isRequired,
        item_type: PropTypes.string.isRequired,
        item_name: PropTypes.string.isRequired,
        image_icon: PropTypes.string.isRequired,
        item_price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
    }).isRequired,
};

export default InventoryItemCard;
