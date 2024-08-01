import React, { createContext, useState, useContext } from 'react';

const HeaderButtonContext = createContext();

export const useHeaderButton = () => useContext(HeaderButtonContext);

export const HeaderButtonProvider = ({ children }) => {
    const [buttonProps, setButtonProps] = useState({
        text: '',
        onClick: () => {},
    });

    return (
        <HeaderButtonContext.Provider value={{ buttonProps, setButtonProps }}>
            {children}
        </HeaderButtonContext.Provider>
    );
};
