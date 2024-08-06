import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Menu, Button, notification } from 'antd';
import { logout as performLogout, apiClient } from '../ApiClient';
import { API_URL_DIVISIONS, API_URL_DIVISION_USERS } from './pages/Config';

export const Navbar = ({ userRole, userName, setToken, setUserRole, setUserName, isInventoryMenuOpen, closeInventoryMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [userDivision, setUserDivision] = useState(null);
  const [divisionName, setDivisionName] = useState('General');
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch divisions
    apiClient.get(API_URL_DIVISIONS)
      .then(response => {
        setDivisions(response.data);
      })
      .catch(error => {
        console.error('Error fetching divisions:', error);
      });

    // Fetch user division
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
    if (userId) {
      apiClient.get(`${API_URL_DIVISION_USERS}?user=${userId}`)
        .then(response => {
          const userDivisionData = response.data.find(item => item.user === parseInt(userId));
          if (userDivisionData) {
            setUserDivision(userDivisionData.division);
          }
        })
        .catch(error => {
          console.error('Error fetching user division:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Update division name and links based on the user division
    if (userDivision && divisions.length > 0) {
      const division = divisions.find(d => d.division_id === userDivision);
      if (division) {
        setDivisionName(division.name);
        switch (division.division_id) {
          case 1:
            setLinks([{ page: "Inventory", href: "/inventory" }]);
            break;
          case 2:
            setLinks([{ page: "Sales", href: "/sales" }]);
            break;
          case 3:
            setLinks([{ page: "Production", href: "/production" }]);
            break;
          case 4:
            setLinks([{ page: "Delivery", href: "/delivery" }]);
            break;
          default:
            setLinks([
              { page: "Sales", href: "/sales" },
              { page: "Production", href: "/production" },
              { page: "Inventory", href: "/inventory" },
              { page: "Delivery", href: "/delivery" }
            ]);
            break;
        }
      }
    } else {
      // Default to showing all links if no specific division is found
      setLinks([
        { page: "Sales", href: "/sales" },
        { page: "Production", href: "/production" },
        { page: "Inventory", href: "/inventory" },
        { page: "Delivery", href: "/delivery" }
      ]);
    }
  }, [userDivision, divisions]);

  useEffect(() => {
    // Redirect if user tries to access a page not allowed by their division
    if (userDivision && divisions.length > 0) {
      const division = divisions.find(d => d.division_id === userDivision);
      if (division) {
        const notAllowedPaths = {
          1: ["/sales", "/production", "/delivery"], // Inventory
          2: ["/inventory", "/production", "/delivery"], // Sales
          3: ["/inventory", "/sales", "/delivery"], // Production
          4: ["/inventory", "/sales", "/production"] // Delivery
        };
        if (notAllowedPaths[division.division_id].includes(location.pathname)) {
          navigate('/home');
        }
      }
    }
  }, [location.pathname, userDivision, divisions, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen && isInventoryMenuOpen) {
      closeInventoryMenu();
    }
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
    } else if (key === 'manage_users') {
      navigate('/user');
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
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
      {userRole === 'Admin' && userDivision === null && (
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
      <Link to="/home">
        <Logo />
      </Link>
      <HamburgerMenu onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </HamburgerMenu>
      <NavMenu isOpen={isMenuOpen}>
        <NavLinkWrapper>
          {links.map((link) => (
            <StyledNavLink activeclassname="active" key={link.page} to={link.href} onClick={handleLinkClick}>
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
