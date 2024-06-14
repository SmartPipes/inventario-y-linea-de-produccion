import React, {useState} from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const links = [
    { page: "Home", href: "/" },
    { page: "Production", href: "/production" },
    { page: "Inventory", href: "/inventory" },
    { page: "User", href: "/user", icon: faUser }
    
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarWrapper>
      <Logo />
      <HamburgerMenu onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </HamburgerMenu>
      <NavMenu isOpen={isMenuOpen}>
      <NavLinkWrapper>
        {links.map((link) => (
          <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
          {link.icon ? <FontAwesomeIcon icon={link.icon} width="20px" color="#FAFBF3" style={{ marginLeft: '8px' }} /> : link.page}

        </StyledNavLink>
        ))}
      </NavLinkWrapper>
      </NavMenu>
    </NavbarWrapper>
  );
};
