import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faFilter, faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { 
    NavContainer, NavItem, NavLogo, NavSearchContainer, NavSearch, 
    NavPagination, NavMenu, HamburgerMenu, FilterOption, FilterTag, FilterDropdown, SubFilterDropdown, NewButton, SearchIcon, DropdownContainer, DropdownMenu, DropdownItem
} from '../../../Styled/InventoryNavBar.styled';

const InventoryNavBar = ({ applyFilters }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isSubFilterDropdownOpen, setIsSubFilterDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [availableFilters] = useState(['Products', 'Raw Material', 'Precio ASC', 'Warehouse']);
    const [warehouses, setWarehouses] = useState([]);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        const response = await axios.get('https://smartpipes.cloud/api/inventory/warehouse/');
        setWarehouses(response.data);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleFilterDropdown = (event) => {
        event.stopPropagation();
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        setIsSubFilterDropdownOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const toggleConfig = () => {
        setIsConfigOpen(!isConfigOpen);
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

    return (
        <>
            <NavContainer>
                <NavLogo>Inventario</NavLogo>
                <HamburgerMenu onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </HamburgerMenu>
                <NavMenu isOpen={isMenuOpen}>
                    <NavItem><Link to="/inventory/informacion-general">Información general</Link></NavItem>
                    <NavItem><Link to="/inventory/operaciones">Operaciones</Link></NavItem>
                    <NavItem><Link to="/inventory/productos">Productos</Link></NavItem>
                    <NavItem><Link to="/inventory/reportes">Reportes</Link></NavItem>
                    <DropdownContainer>
                        <NavItem onClick={toggleConfig}>Configuración</NavItem>
                        <DropdownMenu isOpen={isConfigOpen}>
                            <DropdownItem isLabel>Gestión del almacén</DropdownItem>
                            <DropdownItem><Link to="/inventory/almacenes">Almacenes</Link></DropdownItem>
                            <DropdownItem isLabel>Productos</DropdownItem>
                            <DropdownItem><Link to="/inventory/categorias-productos">Categorías de productos</Link></DropdownItem>
                        </DropdownMenu>
                    </DropdownContainer>
                </NavMenu>
            </NavContainer>
            <NavSearchContainer>
                <NewButton>
                    <FontAwesomeIcon icon={faPlus} /> Nuevo
                </NewButton>
                <SearchIcon onClick={toggleSearch}>
                    <FontAwesomeIcon icon={faSearch} size="lg" />
                </SearchIcon>
                <NavSearch isSearchOpen={isSearchOpen}>
                    <FontAwesomeIcon icon={faSearch} />
                    {selectedFilters.map(filter => (
                        <FilterTag key={filter}>
                            <FontAwesomeIcon icon={faFilter} /> {filter} <span onClick={(event) => removeFilter(filter, event)}>x</span>
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
                    <button>◀</button>
                    <span>1-2 / 2</span>
                    <button>▶</button>
                </NavPagination>
            </NavSearchContainer>
        </>
    );
};

export default InventoryNavBar;
