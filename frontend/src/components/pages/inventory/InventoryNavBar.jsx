import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Menu } from 'antd';
import {
    NavContainer, NavLogo, HamburgerMenu, NavMenu, NavItem
} from '../../../Styled/InventoryNavBar.styled';
import { StyledNavLink } from '../../../Styled/Navbar.styled';

const InventoryNavBar = ({ closeMainMenu }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            closeMainMenu();
        }
    };

    const links = [
        { page: "Home", href: "/" },
        { page: "Inventory", href: "/inventory" },
        { page: "Products", href: "/products" },
        { page: "Settings", href: "/settings" },
    ];

    useEffect(() => {
        if (isMenuOpen) {
            closeMainMenu();
        }
    }, [isMenuOpen, closeMainMenu]);

    const menu = (
        <Menu>
            {links.map(link => (
                <Menu.Item key={link.page}>
                    <StyledNavLink activeclassname="active" to={link.href}>
                        {link.page}
                    </StyledNavLink>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <NavContainer>
            <NavLogo>Inventory</NavLogo>
            <HamburgerMenu onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} size="lg" />
            </HamburgerMenu>
            <NavMenu isOpen={isMenuOpen}>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                    <NavItem>
                        <span>Menu</span>
                    </NavItem>
                </Dropdown>
            </NavMenu>
        </NavContainer>
    );
};

export default InventoryNavBar;
