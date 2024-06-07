import React, { useEffect, useState } from 'react';
import { useHeaderButton } from '../../contexts/HeaderButtonContext';
import InventoryItemCard from '../items/InventoryItemCard';
import axios from 'axios';

const InventoryList = () => {
    const { setButtonProps } = useHeaderButton();
    const [items, setItems] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3NjY1NjM5LCJpYXQiOjE3MTc1NzkyMzksImp0aSI6IjQ1Yzc5Njk3NzBiNDQ1ZjVhNGJjMmRkZDI4OTJkMGViIiwidXNlcl9pZCI6M30._py6D2qlXQjl_a1k19p-evTIREor_akEIJDJJm0RUQM';

    useEffect(() => {
        setButtonProps({
            text: 'Nuevo Almacén',
            onClick: () => setShowAddForm(true),
        });

        fetchItems();
    }, [setButtonProps]);

    const fetchItems = async () => {
        try {
            const response = await axios.get('https://smartpipes.cloud/api/inventory/inventory/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    return (
        <div>
            {items.map(item => (
                <InventoryItemCard key={item.inventory_id} item={item} />
            ))}
            {showAddForm && <AddInventoryForm onClose={() => setShowAddForm(false)} />}
        </div>
    );
};

export default InventoryList;
