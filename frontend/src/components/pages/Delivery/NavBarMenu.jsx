import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, HamburgerMenu, NavMenu

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
                <FontAwesomeIcon icon={faBars} size="lg"/>
            </HamburgerMenu>
            <NavMenu isOpen={isMenuOpen} >
                <NavItem><Link to="/delivery/orders">Orders</Link></NavItem>
                <NavItem><Link to="/delivery/ThirdPartyService">Delivery Services</Link></NavItem>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
