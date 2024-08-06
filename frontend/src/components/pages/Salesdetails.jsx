import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Image, InputGroup, FormControl, Row, Col, Modal, Form, Table } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiClient } from '../../ApiClient';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../items/Sidebar';
import {
    API_URL_PRODUCTS,
    API_URL_DELIVERY_CARTS,
    API_URL_DELIVERY_CART_DETAILS,
    API_URL_DELIVERY_SALES,
    API_URL_DELIVERY_SALE_DETAILS,
    API_URL_DELIVERY_PAYMENTS,
    API_URL_PAYMENT_METHODS,
    API_URL_DELIVERY_ORDERS,
    API_URL_SALE_DELIVERY_DATA
} from './Config';

const Salesdetails = () => {
    const { cartItems, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity, handleAddToCart,handleEmptyCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Debito');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [address, setAddress] = useState('');
    const [cvv, setCvv] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
    const id = localStorage.getItem('id');
    const [product, setProducts] = useState([]);
    const [savePaymentMethod, setSavePaymentMethod] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get(API_URL_PRODUCTS);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const getExistingDeliveryOrder = async (saleId) => {
        try {
            const response = await apiClient.get(`${API_URL_DELIVERY_ORDERS}?sale=${saleId}`);
            return response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error('Error retrieving delivery order:', error);
            return null;
        }
    };

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(null);

    const processSale = async (fullPayload) => {
        try {
            const response = await apiClient.post(API_URL_SALE_DELIVERY_DATA, fullPayload);
            console.log("Venta y datos de entrega registrados con éxito:", response.data);
            setShowModal(false);
            alert('purchase made successfully')
            handleEmptyCart();
            navigate('/sales');
        } catch (error) {
            console.error('Error sending sale and delivery data:', error);
        } finally {
            setIsProcessing(false);
            setPaymentInProgress(null);
        }
    };

    const handleProceedToPayment = async () => {
        if (isProcessing || paymentInProgress) return;
        setIsProcessing(true);
        setPaymentInProgress('card');

        try {
            const isValidPayment = cardNumber.length === 16 && cvv.length === 3 && expiryDate.length === 5;
            if (!isValidPayment) {
                alert('Por favor, ingresa datos de tarjeta válidos.');
                setIsProcessing(false);
                setPaymentInProgress(null);
                return;
            }

            const fullPayload = {
                sale: { total: subtotal, client_id: id },
                sale_details: cartItems.map(item => ({
                    product: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                })),
                delivery_order: {
                    delivery_date: new Date().toISOString(),
                    status: "pending",
                    delivery_address: address,
                    notes: "Delivery Details Check",
                    third_party_service: 1,
                    client: id
                }
            };

            await processSale(fullPayload);
            
        } catch (error) {
            console.error('Error processing card payment:', error);
            setIsProcessing(false);
            setPaymentInProgress(null);
        }
    };

    const handlePayPalApprove = async (orderID) => {
        if (isProcessing || paymentInProgress) return;
        setIsProcessing(true);
        setPaymentInProgress('paypal');

        const fullPayload = {
            sale: { total: subtotal, client_id: id },
            sale_details: cartItems.map(item => ({
                product: item.product_id,
                quantity: item.quantity,
                price: item.price
            })),
            delivery_order: {
                delivery_date: new Date().toISOString(),
                status: "pending",
                delivery_address: 'Utt cuervos',
                notes: "Delivery Details Check",
                third_party_service: 1,
                client: id
            }
        };

        await processSale(fullPayload);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={8}>
                    <h1 className="mb-4">Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <p>No items in the cart</p>
                    ) : (
                        cartItems.map(item => (
                            <Card key={item.product_id} className="mb-3 p-3 shadow-sm border-0">
                                <Row className="align-items-center">
                                    <Col xs={2} className="text-center">
                                        <Image src={item.image_icon} thumbnail />
                                    </Col>
                                    <Col xs={6}>
                                        <h5>{item.name}</h5>
                                        <p className="text-muted">{item.description}</p>
                                        <p>Color: {item.color}</p>
                                        <InputGroup className="mb-3" style={{ width: '150px' }}>
                                            <Button variant="outline-dark" onClick={() => handleDecrementQuantity(item.product_id)}>-</Button>
                                            <FormControl readOnly value={item.quantity} className="text-center" />
                                            <Button variant="outline-dark" onClick={() => handleIncrementQuantity(item.product_id)}>+</Button>
                                        </InputGroup>
                                        <Button
                                            variant="danger"
                                            className="d-flex align-items-center"
                                            onClick={() => handleRemoveFromCart(item.product_id)}
                                            style={{ textDecoration: 'none', fontSize: '1rem' }}
                                        >
                                            <FaTrashAlt className="mr-2" /> Eliminate
                                        </Button>
                                    </Col>
                                    <Col xs={3} className="text-right">
                                        <h4>${(parseFloat(item.price) * item.quantity).toFixed(2)}</h4>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Col>
                <Col md={4}>
                    <Card className="p-3 mb-3 shadow-sm border-0">
                        <h4>Subtotal ({cartItems.length} products): ${subtotal}</h4>
                        <Button
                            style={{ backgroundColor: "#5cb85c", borderColor: "#5cb85c" }}
                            className="w-100"
                            onClick={() => setShowModal(true)}
                        >
                            Proceed to payment
                        </Button>
                    </Card>
                    <Card className="p-4 shadow-lg border-0 rounded">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-4">Match with your cart</Card.Title>
                            {product.slice(0, 4).map(item => (
                                <div key={item.product_id} className="d-flex align-items-center mb-3 p-2 border rounded">
                                    <Image src={item.image_icon} thumbnail style={{ width: '60px', height: '60px' }} />
                                    <div className="ml-3 flex-grow-1">
                                        <p className="mb-1 font-weight-bold" style={{ fontSize: '1rem' }}>{item.name}</p>
                                        <Button
                                            variant="primary"
                                            style={{ justifyItems: 'center', background: 'rgb(92, 184, 92)', borderColor: 'rgb(92, 184, 92)' }}
                                            size="sm"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            add to cart
                                        </Button>
                                    </div>
                                    <div className="ml-auto font-weight-bold text-primary">
                                        <p1 style={{ color: 'rgb(92, 184, 92)' }}>${parseFloat(item.price).toFixed(2)}</p1>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="font-weight-bold">Confirm payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="font-weight-bold mb-3">Summary of purchase</h5>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.product_id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <hr />
                    <Form>
                        <Form.Group controlId="formPaymentMethod">
                            <Form.Label className="font-weight-bold">Payment method</Form.Label>
                            <Form.Control
                                as="select"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mb-3"
                            >
                                <option value="Debito">Debit</option>
                                <option value="Credito">Credit</option>
                                <option value="PayPal">PayPal</option>
                            </Form.Control>
                        </Form.Group>
                        {paymentMethod === 'Debito' || paymentMethod === 'Credito' ? (
                            <>
                                <Form.Group controlId="formCardNumber">
                                    <Form.Label className="font-weight-bold">Card number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter card number (16 digits)"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 16) setCardNumber(value);
                                        }}
                                        maxLength={16}
                                        className="mb-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCardHolder">
                                    <Form.Label className="font-weight-bold">Name of owner</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type the Name of owner"
                                        value={cardHolder}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                            setCardHolder(value);
                                        }}
                                        maxLength={50}
                                        className="mb-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formAddress">
                                    <Form.Label className="font-weight-bold">Package shipping address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the address where the package will be sent"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        maxLength={100}
                                        className="mb-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formExpiryDate">
                                    <Form.Label className="font-weight-bold">Card Expiration Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="MM/AA"
                                        value={expiryDate}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9/]/g, '');
                                            if (/^\d{0,2}(\/\d{0,2})?$/.test(value)) setExpiryDate(value);
                                        }}
                                        maxLength={5}
                                        className="mb-3"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCvv">
                                    <Form.Label className="font-weight-bold">CVV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type CVV (3 digits)"
                                        value={cvv}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 3) setCvv(value);
                                        }}
                                        maxLength={3}
                                        className="mb-3"
                                    />
                                </Form.Group>

                            </>
                        ) : paymentMethod === 'PayPal' ? (
                            <PayPalScriptProvider options={{ "client-id": "AW2rBdOeXNJP62RYmTwawRjhAKssHrieIRwnr8fmpRkOz03yNxPAYxQ8r8aYnXVx8auQ9n70BRVmZYiY" }}>
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: subtotal,
                                                },
                                            }],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            handlePayPalApprove(data.orderID);
                                            console.log(data)
                                            alert("Pago con PayPal completado por " + details.payer.name.given_name);
                                        });
                                    }}
                                    onError={(err) => {
                                        console.log(data)
                                        console.error("Error con PayPal: ", err);
                                    }}
                                />
                            </PayPalScriptProvider>
                        ) : null}
                    </Form>
                    <hr />
                    <h5 className="font-weight-bold">Subtotal: ${subtotal}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    {paymentMethod !== 'PayPal' && (
                        <Button
                            variant="primary"
                            onClick={handleProceedToPayment}
                        >
                            Confirm and Proceed to Payment
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <Sidebar />
        </Container>
        
    );
    
};

export default Salesdetails;
