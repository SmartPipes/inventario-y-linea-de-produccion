import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { 
    NavSearchContainer, NavSearch, SearchIcon, FilterTag, FilterDropdown, SubFilterDropdown, FilterOption, NavPagination 
} from '../../../Styled/InventoryNavBar.styled';

const NavBarFilters = ({ applyFilters, currentPage, totalPages, setCurrentPage }) => {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isSubFilterDropdownOpen, setIsSubFilterDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [availableFilters] = useState(['Products', 'Raw Material', 'Precio ASC', 'Warehouse']);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/warehouse/');
        setWarehouses(response.data);
    };

    const toggleFilterDropdown = (event) => {
        event.stopPropagation();
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        setIsSubFilterDropdownOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const addFilter = (filter) => {
        if (filter === 'Warehouse') {
            setIsSubFilterDropdownOpen(!isSubFilterDropdownOpen);
        } else {
            if (!selectedFilters.includes(filter)) {
                const newFilters = [...selectedFilters, filter];
                setSelectedFilters(newFilters);
                applyFilters(newFilters);
            }
            setIsFilterDropdownOpen(false);
        }
    };

    const addSubFilter = (subFilter) => {
        const filterName = `Warehouse: ${subFilter}`;
        if (!selectedFilters.includes(filterName)) {
            const newFilters = [...selectedFilters, filterName];
            setSelectedFilters(newFilters);
            applyFilters(newFilters);
        }
        setIsSubFilterDropdownOpen(false);
        setIsFilterDropdownOpen(false);
    };

    const removeFilter = (filter, event) => {
        event.stopPropagation();
        const newFilters = selectedFilters.filter(f => f !== filter);
        setSelectedFilters(newFilters);
        applyFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <NavSearchContainer>
            <SearchIcon onClick={toggleSearch}>
                <FontAwesomeIcon icon={faSearch} size="lg" />
            </SearchIcon>
            <NavSearch isSearchOpen={isSearchOpen}>
                <FontAwesomeIcon icon={faSearch} />
                {selectedFilters.map(filter => (
                    <FilterTag key={filter}>
                        <FontAwesomeIcon icon={faCaretDown} /> {filter} <span onClick={(event) => removeFilter(filter, event)}>x</span>
                    </FilterTag>
                ))}
                <input type="text" placeholder="Buscar..." />
                <button onClick={toggleFilterDropdown}><FontAwesomeIcon icon={faCaretDown} /></button>
                {isFilterDropdownOpen && (
                    <FilterDropdown>
                        {availableFilters.map(filter => (
                            <FilterOption key={filter} onClick={() => addFilter(filter)}>
                                {filter}
                            </FilterOption>
                        ))}
                        {isSubFilterDropdownOpen && (
                            <SubFilterDropdown>
                                {warehouses.map(warehouse => (
                                    <FilterOption key={warehouse.warehouse_id} onClick={() => addSubFilter(warehouse.name)}>
                                        {warehouse.name}
                                    </FilterOption>
                                ))}
                            </SubFilterDropdown>
                        )}
                    </FilterDropdown>
                )}
            </NavSearch>
            <NavPagination>
                <button onClick={() => handlePageChange(currentPage - 1)}>◀</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)}>▶</button>
            </NavPagination>
        </NavSearchContainer>
    );
};

export default NavBarFilters;
