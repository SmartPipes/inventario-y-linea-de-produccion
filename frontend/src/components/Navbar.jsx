import React from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import './pages/Sidebar.css'

const Navbar = () => {
    const { handleShowSidebar, cartItems } = useCart();

    const links = [
        { page: "Sales", href: "/sales" },
        { page: "ListSales", href: "/ListSales" },
        { page: "Home", href: "/" },
        { page: "User", href: "/user", icon: faUser }
    ];
    
    return (
      <NavbarWrapper>
      <Logo />
      <NavLinkWrapper>
          {links.map((link) => (
              <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
                  {link.icon ? <FontAwesomeIcon icon={link.icon} width="20px" color="#FAFBF3" style={{ marginLeft: '8px' }} /> : link.page}
                  {link.page !== "User" && <FontAwesomeIcon icon={faCaretDown} width="12px" color="#FAFBF3" style={{ marginLeft: '4px' }} />}
              </StyledNavLink>
          ))}
          <StyledNavLink as="button" onClick={handleShowSidebar} className="cart-button">
              <FontAwesomeIcon icon={faShoppingCart} /> Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </StyledNavLink>
      </NavLinkWrapper>
  </NavbarWrapper>
    );
};

export default Navbar;
