import React, { useEffect } from 'react';
import { useHeaderButton } from '../../contexts/HeaderButtonContext';
import InventoryItemCard from '../items/InventoryItemCard';
import axios from 'axios';

const InventoryList = () => {
    const { setButtonProps } = useHeaderButton();
    const [items, setItems] = useState([]);

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
        <div>
            {items.map(item => (
                <InventoryItemCard key={item.inventory_id} item={item} />
            ))}
        </div>
    );
};

export default InventoryList;
