import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faFilter, faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, NavSearchContainer, NavSearch, NavFilters, 
    NavPagination, NavMenu, HamburgerMenu, FilterGroup, FilterOption, FilterTag, FilterDropdown, NewButton 
} from '../../../Styled/InventoryNavBar.styled';

const InventoryNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [availableFilters] = useState(['Productos', 'Tipo de producto', 'Se puede vender']);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleFilterDropdown = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };

    const addFilter = (filter) => {
        if (!selectedFilters.includes(filter)) {
            setSelectedFilters([...selectedFilters, filter]);
        }
        setIsFilterDropdownOpen(false);
    };

    const removeFilter = (filter) => {
        setSelectedFilters(selectedFilters.filter(f => f !== filter));
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
                    <NavItem><Link to="/inventory/configuracion">Configuración</Link></NavItem>
                </NavMenu>
            </NavContainer>
            <NavSearchContainer>
                <NewButton>
                    <FontAwesomeIcon icon={faPlus} /> Nuevo
                </NewButton>
                <NavSearch onClick={toggleFilterDropdown}>
                    <FontAwesomeIcon icon={faSearch} />
                    {selectedFilters.map(filter => (
                        <FilterTag key={filter}>
                            <FontAwesomeIcon icon={faFilter} /> {filter} <span onClick={() => removeFilter(filter)}>x</span>
                        </FilterTag>
                    ))}
                    <input type="text" placeholder="Buscar..." />
                    <button><FontAwesomeIcon icon={faCaretDown} /></button>
                </NavSearch>
                {isFilterDropdownOpen && (
                    <FilterDropdown>
                        {availableFilters.map(filter => (
                            <FilterOption key={filter} onClick={() => addFilter(filter)}>
                                {filter}
                            </FilterOption>
                        ))}
                    </FilterDropdown>
                )}
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
