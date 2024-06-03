import React, { useEffect, useState } from 'react';
import { useHeaderButton } from '../../contexts/HeaderButtonContext';
import InventoryItemCard from '../items/InventoryItemCard';
import axios from 'axios';


const InventoryList = () => {
    const { setButtonProps } = useHeaderButton();
    const [items, setItems] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setButtonProps({
            text: 'Nuevo Almacén',
            onClick: () => setShowAddForm(true),
        });

        fetchItems();
    }, [setButtonProps]);

    const fetchItems = async () => {
        const response = await axios.get('http://127.0.0.1:8080/api/inventory/items/');
        setItems(response.data);
    };

    return (
        <div className="inventory-list">
            {items.map(item => (
                <div className="inventory-card" key={item.inventory_id}>
                    <InventoryItemCard item={item} />
                </div>
            ))}
            {showAddForm && <AddInventoryForm onClose={() => setShowAddForm(false)} />}
        </div>
    );
};

export default InventoryList;
