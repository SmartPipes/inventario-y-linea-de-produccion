import React, { useEffect, useState } from 'react';
import WarehouseList from './WarehouseList';
import WarehouseNavBar from './WarehouseNavBar';
import { MainContent } from '../../../Styled/Production.styled';
import { apiClient } from '../../../ApiClient';
import { API_URL_WAREHOUSES } from '../Config';

const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        applyFilters(selectedFilters);
    }, [selectedFilters, warehouses]);

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
            setFilteredWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const applyFilters = (filters) => {
        let filtered = [...warehouses];

        filters.forEach(filter => {
            // Añadir más filtros si es necesario
        });

        setFilteredWarehouses(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearchChange = (searchText) => {
        const filtered = warehouses.filter(warehouse =>
            warehouse.name.toLowerCase().includes(searchText.toLowerCase()) ||
            warehouse.address.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredWarehouses(filtered);
    };

    // Logic for displaying current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWarehouses.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);

    return (
        <MainContent>
            <WarehouseNavBar
                applyFilters={applyFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                onSearchChange={handleSearchChange}
            />
            <WarehouseList warehouses={currentItems} />
        </MainContent>
    );
};

export default WarehousePage;
