// Sidebar.jsx
import React from 'react';
import { Offcanvas, Button, Image, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import { useCart } from '../../context/CartContext';
import '../pages/Sidebar.css'

const Sidebar = () => {
    const { cartItems, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity, showSidebar, handleCloseSidebar } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{ width: '100%', textAlign: 'center' }}>
                    <Card>
                        <Card.Body>Cart</Card.Body>
                    </Card>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <p>No items in cart</p>
                ) : (
                    cartItems.map(item => (
                        <Card key={item.product_id} style={{ width: '100%', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                            <div className="cart-item mb-3">
                                <div className="d-flex">
                                    <Image src={item.image_icon} className="cart-item-img" />
                                    <div className="cart-item-details ml-3">
                                        <h5 >{item.description}</h5>
                                        <InputGroup className="quantity-input">
                                            <Button variant="outline-secondary" onClick={() => handleDecrementQuantity(item.product_id)}>-</Button>
                                            <FormControl readOnly value={item.quantity} className="text-center" />
                                            <Button variant="outline-secondary" onClick={() => handleIncrementQuantity(item.product_id)}>+</Button>
                                            <Button variant="danger" className="remove-item ml-auto" onClick={() => handleRemoveFromCart(item.product_id)}>x</Button>
                                        </InputGroup>
                                        <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </Card>
                    ))
                )}
                <div className="cart-summary">
                    <h4>Subtotal: ${subtotal}</h4>
                    <Button variant="primary" className="w-100 mb-2" onClick={() => navigate('/sales/salesdetails')}>View Cart</Button>
                    <Button variant="success" className="w-100">Checkout</Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
