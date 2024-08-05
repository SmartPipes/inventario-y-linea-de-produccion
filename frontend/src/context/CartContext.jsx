
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.product_id === product.product_id);
        if (existingItem) {
            setCartItems(cartItems.map(item => 
                item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.product_id !== productId));
    };

    const handleIncrementQuantity = (productId) => {
        setCartItems(cartItems.map(item => 
            item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecrementQuantity = (productId) => {
        setCartItems(cartItems.map(item => 
            item.product_id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const handleShowSidebar = () => setShowSidebar(true);
    const handleCloseSidebar = () => setShowSidebar(false);

    return (
        <CartContext.Provider value={{ cartItems, handleAddToCart, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity, showSidebar, handleShowSidebar, handleCloseSidebar }}>
            {children}
        </CartContext.Provider>
    );
};
