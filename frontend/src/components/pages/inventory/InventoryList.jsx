import React, { useEffect, useState } from 'react';
import InventoryItemCard from './InventoryItemCard';
import axios from 'axios';
import { Titles } from '../../../Styled/Global.styled';
import { InventoryContainer, InventorySubContainer } from '../../../Styled/Inventory.styled';

const InventoryList = ({ selectedFilters }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchItems();
        fetchWarehouses();
    }, []);

    useEffect(() => {
        applyFilters(selectedFilters);
    }, [selectedFilters, items, warehouses]);

    const fetchItems = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/inventory/');
        setItems(response.data);
        setFilteredItems(response.data);
    };

    const fetchWarehouses = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/warehouse/');
        setWarehouses(response.data);
    };

    const applyFilters = (filters) => {
        let filtered = [...items];

        filters.forEach(filter => {
            if (filter === 'Products') {
                filtered = filtered.filter(item => item.item_type === 'Product');
            } else if (filter === 'Raw Material') {
                filtered = filtered.filter(item => item.item_type === 'RawMaterial');
            } else if (filter === 'Precio ASC') {
                filtered = filtered.sort((a, b) => a.item_price - b.item_price);
            } else if (filter.startsWith('Warehouse:')) {
                const warehouseName = filter.split(': ')[1];
                const warehouse = warehouses.find(wh => wh.name === warehouseName);
                if (warehouse) {
                    filtered = filtered.filter(item => item.warehouse === warehouse.warehouse_id);
                }
            }
        });

        setFilteredItems(filtered);
    };

    return (
        <div>
            <InventoryContainer>
                <InventorySubContainer>
                    {filteredItems.map(item => (
                        <InventoryItemCard key={item.inventory_id} item={item} />
                    ))}
                </InventorySubContainer>
            </InventoryContainer>
        </div>
    );
};

export default InventoryList;
