import React from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faUserPlus } from '@fortawesome/free-solid-svg-icons'; // Añadido faUserPlus para el icono de Registro
import Logout from './pages/Login/Logout';
export const Navbar = () => {

  const links = [
    { page: "Home", href: "/" },
    { page: "Production", href: "/production" },
    { page: "Inventory", href: "/inventory" },
    { page: "User", href: "/user", icon: faUser },
    { page: "Register", href: "/register", icon: faUserPlus } 
  ];

  return (
    <NavbarWrapper>
      <Logo />
      <NavLinkWrapper>
        {links.map((link) => (
          <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
            {link.icon ? <FontAwesomeIcon icon={link.icon} width="20px" color="#FAFBF3" style={{ marginLeft: '8px' }} /> : link.page}
            {link.page !== "User" && link.page !== "Register" && <FontAwesomeIcon icon={faCaretDown} width="12px" color="#FAFBF3" style={{ marginLeft: '4px' }} />}
          </StyledNavLink>
        ))}
        <Logout />
      </NavLinkWrapper>
    </NavbarWrapper>
  );
};
