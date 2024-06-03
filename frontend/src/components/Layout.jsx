import React from 'react';
import Header from './Header';

const Layout = ({ children, searchPlaceholder, onSearchChange, buttonText, onButtonClick }) => {
    return (
        <div>
            <Header
                searchPlaceholder={searchPlaceholder}
                onSearchChange={onSearchChange}
                buttonText={buttonText}
                onButtonClick={onButtonClick}
            />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
