import React, {useState} from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const links = [
    { page: "Sales", href: "/sales" },
    { page: "Production", href: "/production" },
    { page: "Inventory", href: "/inventory" },
    { page: "Delivery", href: "/delivery" },
    { page: "User", href: "/user", icon: faUser }
    
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarWrapper>
      <Link to="/">
      <Logo/>
      </Link>
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
