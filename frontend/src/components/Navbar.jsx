import React from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHouse, faStore, faClipboardList, faUserPen, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { Dropdown, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout as performLogout } from '../ApiClient';
import './pages/Sidebar.css';

const Navbar = ({ userRole, userName, setToken, setUserRole, setUserName }) => {
  const { handleShowSidebar, cartItems } = useCart();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      performLogout();
      setToken(null);
      setUserRole(null);
      setUserName(null);
      navigate('/');
    } else if (key === 'profile') {
      navigate('/profile');  // Navega a la pantalla de perfil
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="user" disabled>
        <div>
          <strong>Nombre:</strong> {userName}
        </div>
        <div>
          <strong>Rol:</strong> {userRole}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile">
        <FontAwesomeIcon icon={faUserPen} style={{ marginRight: '8px' }} />
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '8px' }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  if (!handleShowSidebar || !cartItems) {
    console.error('useCart no devolvió handleShowSidebar o cartItems');
    return null;
  }

  const links = [
    { page: "Home", href: "/home", icon: faHouse },
    { page: "Sales", href: "/sales", icon: faStore },
    //{ page: "ListSales", href: "/ListSales", icon: faClipboardList },
  ];

  return (
    <NavbarWrapper>
      <Logo />
      <NavLinkWrapper>
        {links.map((link) => (
          <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
            <FontAwesomeIcon icon={link.icon} width="20px" color="#FAFBF3" style={{ marginRight: '8px' }} />
            {link.page}
          </StyledNavLink>
        ))}
        <StyledNavLink as="button" onClick={handleShowSidebar} className="cart-button">
          <FontAwesomeIcon icon={faShoppingCart} /> Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </StyledNavLink>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            type="link"
            style={{
              padding: 0,
              color: '#FAFBF3',
              marginLeft: '2rem',
            }}
          >
            <FontAwesomeIcon icon={faUser} width="20px" color="#FAFBF3" />
          </Button>
        </Dropdown>
      </NavLinkWrapper>
    </NavbarWrapper>
  );
};

export default Navbar;
