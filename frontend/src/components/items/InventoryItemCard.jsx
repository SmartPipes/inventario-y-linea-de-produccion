import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';

const InventoryItemCard = ({ item }) => {
    return (
        <Card title={item.item_name} image={item.image_icon}>
            <p>Precio: ${item.item_price ? item.item_price.toFixed(2) : 'N/A'}</p>
            <p>Disponible: {item.stock.toFixed(2)} Unidades</p>
        </Card>
    );
};

InventoryItemCard.propTypes = {
    item: PropTypes.shape({
        item_name: PropTypes.string.isRequired,
        item_price: PropTypes.number,
        stock: PropTypes.number.isRequired,
        image_icon: PropTypes.string.isRequired,
    }).isRequired,
};

export default InventoryItemCard;
