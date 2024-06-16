import React, { useEffect, useState } from 'react';
import InventoryItemCard from './InventoryItemCard';
import InventoryNavBar from './InventoryNavBar'; // Import InventoryNavBar aquí
import { InventoryContainer, InventorySubContainer } from '../../../Styled/Inventory.styled';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV, API_URL_WAREHOUSES } from '../Config';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        fetchItems();
        fetchWarehouses();
    }, []);

    useEffect(() => {
        applyFilters(selectedFilters);
    }, [selectedFilters, items, warehouses]);

    const fetchItems = async () => {
        try {
            const response = await apiClient.get(API_URL_INV);
            setItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
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
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Logic for displaying current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <div>
            <InventoryNavBar
                applyFilters={applyFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
            <InventoryContainer>
                <InventorySubContainer>
                    {currentItems.map(item => (
                        <InventoryItemCard key={item.inventory_id} item={item} />
                    ))}
                </InventorySubContainer>
            </InventoryContainer>
        </div>
    );
};

export default InventoryList;
