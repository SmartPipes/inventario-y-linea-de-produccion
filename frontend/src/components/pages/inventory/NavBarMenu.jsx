import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, HamburgerMenu, NavMenu, DropdownContainer, DropdownMenu, DropdownItem 
} from '../../../Styled/InventoryNavBar.styled';

const NavBarMenu = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleConfig = () => {
        setIsConfigOpen(!isConfigOpen);
    };

    return (
        <NavContainer>
            <NavLogo>{title}</NavLogo>
            <HamburgerMenu onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} size="lg" />
            </HamburgerMenu>
            <NavMenu isOpen={isMenuOpen}>
                <NavItem><Link to="/inventory/informacion-general">Información general</Link></NavItem>
                <NavItem><Link to="/inventory/operaciones">Operaciones</Link></NavItem>
                <NavItem><Link to="/inventory">Productos</Link></NavItem>
                <NavItem><Link to="/inventory/reportes">Reportes</Link></NavItem>
                <DropdownContainer>
                    <NavItem onClick={toggleConfig}>Configuración</NavItem>
                    <DropdownMenu isOpen={isConfigOpen}>
                        <DropdownItem isLabel>Gestión del almacén</DropdownItem>
                        <DropdownItem><Link to="/inventory/warehouses">Almacenes</Link></DropdownItem>
                        <DropdownItem isLabel>Gestión de proveedores</DropdownItem>
                        <DropdownItem><Link to="/inventory/suppliers">Proveedores</Link></DropdownItem>
                        <DropdownItem isLabel>Productos</DropdownItem>
                        <DropdownItem><Link to="/inventory/categories">Categorías de productos</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
