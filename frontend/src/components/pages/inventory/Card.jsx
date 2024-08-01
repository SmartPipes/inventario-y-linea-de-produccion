import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_URL_INVENTORYSUM } from '../Config';
import { InventoryCard, CardHeader, CardTitle, CardImage, CardBody, CardFooter, PriceTag, StockTag } from '../../../Styled/Inventory.styled';
import { apiClient } from '../../../ApiClient';

const Card = ({ inventory_id, item_id, item_name, item_description, image_icon, item_price, stock, item_type, warehouse, onCardClick }) => {
    const [totalStock, setTotalStock] = useState(null);

    useEffect(() => {
        const fetchTotalStock = async () => {
            try {
                const response = await apiClient.get(API_URL_INVENTORYSUM);
                const stockData = response.data.find(item => item.item_id === item_id && item.item_type === item_type);
                if (stockData) {
                    setTotalStock(stockData.total_stock);
                }
            } catch (error) {
                console.error('Error fetching total stock:', error);
                // Puedes agregar un mensaje de error aquí si es necesario
            }
        };

        fetchTotalStock();
    }, [item_id, item_type]);

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
    onCardClick: PropTypes.func.isRequired,
};

export default Card;
