import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useHeaderButton } from '../contexts/HeaderButtonContext';
import './Header.css';
import {MenuBar, MenuItem, MenuItemsContainer, AppContainer} from '../Styled/StyledComponents'

const Header = ({ searchPlaceholder, onSearchChange }) => {
    const { buttonProps } = useHeaderButton();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        // <header className="header">
        //     <div className="header-top">
        //         <div className="header-left">
        //             <img src="https://smartpipes.cloud/media/SmartPipesLogo.png" alt="Logo" className="logo" />
        //             <button className="menu-button" onClick={toggleMenu}>
        //                 &#9776;
        //             </button>
        //             <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        //                 <Link to="/inventory">Inventario</Link>
        //                 <Link to="/general-info">Información general</Link>
        //                 <Link to="/operations">Operaciones</Link>
        //                 <Link to="/products">Productos</Link>
        //                 <Link to="/reports">Reportes</Link>
        //                 <Link to="/settings">Configuración</Link>
        //             </nav>
        //         </div>
        //         <div className="header-right">
        //             <div className="notifications">
        //                 <button className="btn notifications-btn">Activación pendiente</button>
        //             </div>
        //             <div className="user-profile">
        //                 <button className="btn user-btn">AC</button>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="header-bottom">
        //         <div className="header-actions">
        //             {buttonProps.text && (
        //                 <button className="custom-button" onClick={buttonProps.onClick}>
        //                     {buttonProps.text}
        //                 </button>
        //             )}
        //             <input
        //                 type="text"
        //                 className="search-bar"
        //                 placeholder={searchPlaceholder}
        //                 onChange={onSearchChange}
        //             />
        //         </div>
        //         <div className="pagination">
        //             <span>1-1 / 1</span>
        //             <button>&lt;</button>
        //             <button>&gt;</button>
        //         </div>
        //     </div>
        // </header>
        <AppContainer bgColor='#FAFBF3'>
        <MenuBar>
            <MenuItemsContainer>
                <MenuItem href='inventory'>Inventario</MenuItem>
            </MenuItemsContainer>
        </MenuBar>
        </AppContainer>
    );
};

Header.propTypes = {
    searchPlaceholder: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default Header;
