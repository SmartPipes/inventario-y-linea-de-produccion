import React from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink} from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';


export const Navbar = () => {


  
  const links = [
    { page: "Home", href: "/" },
    { page: "Production", href: "/production" },
    { page: "Inventory", href: "/inventory" },
    { page: "User", href: "/user", icon: faUser }
    
  ];

  return (
    <NavbarWrapper>
      <Logo />
      <NavLinkWrapper>
        {links.map((link) => (
          <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
          {link.icon ? <FontAwesomeIcon icon={link.icon} width="20px" color="#FAFBF3" style={{ marginLeft: '8px' }} /> : link.page}
          {link.page != "User" && <FontAwesomeIcon icon={faCaretDown} width="12px" color="#FAFBF3" style={{ marginLeft: '4px' }} />}
        </StyledNavLink>
        ))}
      </NavLinkWrapper>
    </NavbarWrapper>
  );
};
