import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, HamburgerMenu, NavMenu, DropdownContainer, DropdownMenu, DropdownItem 
} from '../../../Styled/DeliveryNavBar.styled';

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
                <NavItem><Link to="/delivery/orders">Orders</Link></NavItem>
                <NavItem><Link to="/delivery/payments">Payments</Link></NavItem>
                <NavItem><Link to="/delivery/cart-details">Cart Details</Link></NavItem>
                <NavItem><Link to="/delivery/sale-details">Sale Details</Link></NavItem>
                <NavItem><Link to="/delivery/ThirdPartyService">Third Services</Link></NavItem>
                <DropdownContainer>
                    <NavItem onClick={toggleConfig}>Settings</NavItem>
                    <DropdownMenu isOpen={isConfigOpen}>
                        <DropdownItem isLabel>Orders Management</DropdownItem>
                        <DropdownItem><Link to="/delivery/orders">Orders</Link></DropdownItem>
                        <DropdownItem isLabel>Payments Management</DropdownItem>
                        <DropdownItem><Link to="/delivery/payments">Payments</Link></DropdownItem>
                        <DropdownItem isLabel>Carts</DropdownItem>
                        <DropdownItem><Link to="/delivery/cart-details">Cart Details</Link></DropdownItem>
                        <DropdownItem><Link to="/delivery/sale-details">Sale Details</Link></DropdownItem>
                        <DropdownItem isLabel>Third Services</DropdownItem>
                        <DropdownItem><Link to="/delivery/ThirdPartyService">Third Services</Link></DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
