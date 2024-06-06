import React, { useEffect, useState } from 'react';
import InventoryItemCard from './InventoryItemCard';
import axios from 'axios';
import { Titles } from '../../../Styled/Global.styled';
import { InventoryContainer, InventorySubContainer } from '../../../Styled/Inventory.styled';

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
            <Titles style={{ textAlign: 'center' }}>INVENTORY LIST</Titles>
            <InventoryContainer>
                <InventorySubContainer>
                    {items.map(item => (
                        <InventoryItemCard key={item.inventory_id} item={item} />
                    ))}
                </InventorySubContainer>
            </InventoryContainer>
        </div>
    );
};

export default InventoryList;
