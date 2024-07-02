import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import CategoryNavBar from './CategoryNavBar';
import { MainContent } from '../../../Styled/Production.styled';
import { apiClient } from '../../../ApiClient';
import { API_URL_CATEGORIES } from '../Config';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters(selectedFilters);
    }, [selectedFilters, categories]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(API_URL_CATEGORIES);
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const applyFilters = (filters) => {
        let filtered = [...categories];

        filters.forEach(filter => {
            // Añadir más filtros si es necesario
        });

        setFilteredCategories(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearchChange = (searchText) => {
        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase()) ||
            category.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    // Logic for displaying current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <MainContent>
            <CategoryNavBar
                applyFilters={applyFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                onSearchChange={handleSearchChange}
            />
            <CategoryList categories={currentItems} />
        </MainContent>
    );
};

export default CategoryPage;
