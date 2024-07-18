import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const InventoryItemCard = ({ item }) => {
    return (
        <Card 
            inventory_id={item.inventory_id}
            item_id={item.item_id}
            item_name={item.item_name} 
            item_description={item.item_description}
            image_icon={item.image_icon} 
            item_price={item.item_price} 
            stock={item.stock}
            item_type={item.item_type}
            warehouse={item.warehouse_name} // Asegurar que pasas el nombre correcto del almacén
        />
    );
};

InventoryItemCard.propTypes = {
    item: PropTypes.shape({
        inventory_id: PropTypes.number.isRequired,
        item_id: PropTypes.number.isRequired,
        item_name: PropTypes.string.isRequired,
        item_description: PropTypes.string,
        image_icon: PropTypes.string.isRequired,
        item_price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        item_type: PropTypes.string.isRequired,
        warehouse_name: PropTypes.string.isRequired, // Ajustar esto según cómo se llame en tus datos
    }).isRequired,
};

export default InventoryItemCard;
