import React, { useState } from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';
import { logout as performLogout } from '../ApiClient';

export const Navbar = ({ userRole, userName, setToken, setUserRole, setUserName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Define los enlaces según la división almacenada en localStorage
  const division = localStorage.getItem('user_division');
  let divisionName = '';

  switch (division) {
    case '1':
      divisionName = 'Production';
      break;
    case '2':
      divisionName = 'Inventory';
      break;
    case '3':
      divisionName = 'Sales';
      break;
    case '4':
      divisionName = 'Delivery';
      break;
    default:
      divisionName = 'General';
      break;
  }

  let links = [];
  if (division === '2') {
    links = [
      { page: "Inventory", href: "/inventory" },
    ];
  } else if (division === '1') {
    links = [
      { page: "Production", href: "/production" }
    ];
  } else if (division === '3') {
    links = [
      { page: "Sales", href: "/sales" },
    ];
  } else if (division === '4') {
    links = [
      { page: "Delivery", href: "/delivery" }
    ];
  } else {
    // Muestra todos los enlaces si no hay división específica
    links = [
      { page: "Sales", href: "/sales" },
      { page: "Production", href: "/production" },
      { page: "Inventory", href: "/inventory" },
      { page: "Delivery", href: "/delivery" }
    ];
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_division');
    performLogout();
    setToken(null);
    setUserRole(null);
    setUserName(null);
    navigate('/');
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
      navigate('/login');
    }else if (key === 'manage_users') {
      navigate('/user');
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
        <div>
          <strong>División:</strong> {divisionName}
        </div>
      </Menu.Item>
      <Menu.Divider />
      {userRole === 'Admin' && (
        <Menu.Item key="manage_users">
          Manage Users
        </Menu.Item>
      )}
      <Menu.Item key="logout">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <NavbarWrapper>
      <Link to="/">
        <Logo />
      </Link>
      <HamburgerMenu onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </HamburgerMenu>
      <NavMenu isOpen={isMenuOpen}>
        <NavLinkWrapper>
          {links.map((link) => (
            <StyledNavLink activeclassname="active" key={link.page} to={link.href}>
              {link.page}
            </StyledNavLink>
          ))}
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
      </NavMenu>
    </NavbarWrapper>
  );
};
