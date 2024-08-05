import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { 
    NavContainer, NavItem, NavLogo, NavSearchContainer,
    NavMenu, HamburgerMenu, NewButton, 
} from '../../../Styled/InventoryNavBar.styled';
import { StyledNavLink } from '../../../Styled/Navbar.styled';

export const ProductionNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        setUserRole(role);
    }, []);

    const links = [
        { page: "Production Orders", href: "/production/orders" },
    ];

    // Add these links only if the user role is Admin
    if (userRole === 'Admin') {
        links.unshift(
            { page: "Factories", href: "/production/factories" },
            { page: "Production Lines", href: "/production/production-lines" },
            { page: "Production Phases", href: "/production/production-phases" }
        );
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <NavContainer>
                <NavLogo>Production</NavLogo>
                <HamburgerMenu onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </HamburgerMenu>
                <NavMenu isOpen={isMenuOpen}>
                    {links.map((link) => (
                        <StyledNavLink activeclassname="active" key={link.page} to={link.href} isproduction="true">
                            {link.page}
                        </StyledNavLink>
                    ))}
                </NavMenu>
            </NavContainer>
        </>
    );
};

export default ProductionNavBar;
