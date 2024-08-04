import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, HamburgerMenu, NavMenu, DropdownContainer, DropdownMenu, DropdownItem 
} from '../../../Styled/InventoryNavBar.styled';

const NavBarMenu = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDropdownClick = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    return (
        <NavContainer>
            <NavLogo>{title}</NavLogo>
            <HamburgerMenu onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} size="lg" />
            </HamburgerMenu>
            <NavMenu isOpen={isMenuOpen}>
                <NavItem><Link to="/inventory/informacion-general">General information</Link></NavItem>
                <DropdownContainer>
                    <NavItem onClick={() => handleDropdownClick('operations')}>Operations</NavItem>
                    <DropdownMenu isOpen={openDropdown === 'operations'}>
                        <DropdownItem isLabel>Reabastecimiento</DropdownItem>
                        <DropdownItem><Link to="/inventory/request-restock">Restock</Link></DropdownItem>
                        <DropdownItem isLabel>Traslados</DropdownItem>
                        <DropdownItem><Link to="/inventory/receipts">Receipts</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/deliveries">Deliveries</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
                <DropdownContainer>
                    <NavItem onClick={() => handleDropdownClick('reports')}>Reports</NavItem>
                    <DropdownMenu isOpen={openDropdown === 'reports'}>
                        <DropdownItem><Link to="/inventory/stock">Stock</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/operation-log">Movement History</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
                <NavItem><Link to="/inventory">Products</Link></NavItem>
                <DropdownContainer>
                    <NavItem onClick={() => handleDropdownClick('settings')}>Settings</NavItem>
                    <DropdownMenu isOpen={openDropdown === 'settings'}>
                        <DropdownItem isLabel>Warehouse Management</DropdownItem>
                        <DropdownItem><Link to="/inventory/warehouses">Warehouses</Link></DropdownItem>
                        <DropdownItem isLabel>Supplier Management</DropdownItem>
                        <DropdownItem><Link to="/inventory/suppliers">Suppliers</Link></DropdownItem>
                        <DropdownItem isLabel>Products</DropdownItem>
                        <DropdownItem><Link to="/inventory/categories">Categories</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/products">Products</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/raw-materials">Raw Materials</Link></DropdownItem>
                        <DropdownItem><Link to="/inventory/request-restock-warehouse">Restock Requests Warehouse</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
