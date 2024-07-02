import React, { useEffect, useState } from 'react';
import SupplierList from './SupplierList';
import SupplierNavBar from './SupplierNavBar';
import { MainContent } from '../../../Styled/Production.styled';
import { apiClient } from '../../../ApiClient';
import { API_URL_SUPPLIERS } from '../Config';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        applyFilters(selectedFilters);
    }, [selectedFilters, suppliers]);

    const fetchSuppliers = async () => {
        try {
            const response = await apiClient.get(API_URL_SUPPLIERS);
            setSuppliers(response.data);
            setFilteredSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const applyFilters = (filters) => {
        let filtered = [...suppliers];

        filters.forEach(filter => {
            // Añadir más filtros si es necesario
        });

        setFilteredSuppliers(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearchChange = (searchText) => {
        const filtered = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.RFC.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.phone.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.address.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.rating.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredSuppliers(filtered);
    };

    // Logic for displaying current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

    return (
        <MainContent>
            <SupplierNavBar
                applyFilters={applyFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                onSearchChange={handleSearchChange}
            />
            <SupplierList suppliers={currentItems} />
        </MainContent>
    );
};

export default SupplierPage;
