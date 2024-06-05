import React, { useEffect, useState } from 'react';
import InventoryItemCard from './InventoryItemCard';
import axios from 'axios';
import { Titles } from '../../../Styled/Global.styled';
import { InventoryContainer } from '../../../Styled/Inventory.styled';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/inventory/');
        setItems(response.data);
    };

    return (
        <div>
            <InventoryContainer>
                {items.map(item => (
                    <InventoryItemCard key={item.inventory_id} item={item} />
                ))}
            </InventoryContainer>
        </div>
    );
};

export default InventoryList;
