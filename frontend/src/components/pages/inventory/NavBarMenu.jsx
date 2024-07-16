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
                <NavItem><Link to="/inventory/informacion-general">General information</Link></NavItem>
                <NavItem><Link to="/inventory/operation-log">Operations</Link></NavItem>
                <NavItem><Link to="/inventory">Products</Link></NavItem>
                <NavItem><Link to="/inventory/reportes">Reports</Link></NavItem>
                <DropdownContainer>
                    <NavItem onClick={toggleConfig}>Settings</NavItem>
                    <DropdownMenu isOpen={isConfigOpen}>
                        <DropdownItem isLabel>Warehouse Management</DropdownItem>
                        <DropdownItem><Link to="/inventory/warehouses">Warehouses</Link></DropdownItem>
                        <DropdownItem isLabel>Supplier Management</DropdownItem>
                        <DropdownItem><Link to="/inventory/suppliers">Suppliers</Link></DropdownItem>
                        <DropdownItem isLabel>Products</DropdownItem>
                        <DropdownItem><Link to="/inventory/categories">Product Categories</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/products">Products</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/raw-materials">Raw Materials</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/request-restock">Replenishment Requests</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
