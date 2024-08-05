import React from 'react';
import { Offcanvas, Button, Image, InputGroup, FormControl, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../../context/CartContext';
import '../pages/Sidebar.css';

const Sidebar = () => {
    const { cartItems, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity, showSidebar, handleCloseSidebar } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end" className="sidebar-cart">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="text-center w-100">
                    <h3>Shopping Cart</h3>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <p className="text-center">Your cart is empty</p>
                ) : (
                    cartItems.map(item => (
                        <Card key={item.product_id} className="cart-item-card mb-3">
                            <div className="cart-item">
                                <Image src={item.image_icon} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h5 className="cart-item-title">{item.description}</h5>
                                    <InputGroup className="quantity-input mb-2">
                                        <Button variant="outline-secondary" onClick={() => handleDecrementQuantity(item.product_id)}>-</Button>
                                        <FormControl readOnly value={item.quantity} className="text-center mx-2 quantity-display" />
                                        <Button variant="outline-secondary" onClick={() => handleIncrementQuantity(item.product_id)}>+</Button>
                                    </InputGroup>
                                    <div className="cart-item-actions d-flex justify-content-between align-items-center">
                                        <p className="item-total mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                                        <Button variant="danger" className="remove-item" onClick={() => handleRemoveFromCart(item.product_id)}>Remove</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
                <div className="cart-summary mt-4">
                    <h4>Subtotal: ${subtotal}</h4>
                    <br />
                    <Button variant="success" className="w-100" style={{background: '#364936'}} onClick={() => navigate('/sales/salesdetails')}>Checkout</Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
