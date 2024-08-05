import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Image, InputGroup, FormControl, Row, Col, Modal, Form, Table } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiClient } from '../../ApiClient';
import { useNavigate } from 'react-router-dom';

import {
    API_URL_PRODUCTS,
    API_URL_DELIVERY_CARTS,
    API_URL_DELIVERY_CART_DETAILS,
    API_URL_DELIVERY_SALES,
    API_URL_DELIVERY_SALE_DETAILS,
    API_URL_DELIVERY_PAYMENTS,
    API_URL_PAYMENT_METHODS,
} from './Config';

const Salesdetails = () => {
    const { cartItems, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity, handleAddToCart } = useCart();
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

    const handleProceedToPayment = async () => {
        try {
            if (paymentMethod === 'Debito' || paymentMethod === 'Credito') {
                const isValidPayment = cardNumber.length === 12 && cvv.length === 3 && expiryDate.length === 4;
                if (!isValidPayment) {
                    alert('Por favor, ingresa datos de tarjeta válidos.');
                    return;
                }
                setTransactionId('FAKE_TRANSACTION_ID');

                // Proceso común de crear carrito, agregar detalles y registrar la venta
                const cartPayload = { client_id: id };
                const cartResponse = await apiClient.post(API_URL_DELIVERY_CARTS, cartPayload);
                const cartData = cartResponse.data;

                for (const item of cartItems) {
                    const cartDetailPayload = {
                        cart: cartData.cart_id,
                        product: item.product_id,
                        quantity: item.quantity.toString(),
                    };
                    await apiClient.post(API_URL_DELIVERY_CART_DETAILS, cartDetailPayload);
                }

                const salePayload = { total: subtotal, client_id: id };
                const saleResponse = await apiClient.post(API_URL_DELIVERY_SALES, salePayload);
                const saleData = saleResponse.data;

                for (const item of cartItems) {
                    const saleDetailPayload = {
                        sale: saleData.sale_id,
                        product: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                    };
                    await apiClient.post(API_URL_DELIVERY_SALE_DETAILS, saleDetailPayload);
                }

                // Registro del pago con tarjeta
                const paymentPayload = {
                    payment_method: paymentMethod,
                    amount: subtotal,
                    transaction_id: transactionId || null,
                    sale_id: saleData.sale_id,
                };
                await apiClient.post(API_URL_DELIVERY_PAYMENTS, paymentPayload);
                console.log("Pago registrado con éxito");

                if (savePaymentMethod) {
                    const paymentMethodPayload = {
                        payment_type: paymentMethod,
                        provider: paymentMethod === 'PayPal' ? 'PayPal' : 'Bank',
                        account_number: paymentMethod === 'PayPal' ? 'N/A' : cardNumber,
                        expire_date: paymentMethod === 'PayPal' ? null : expiryDate,
                        name_on_account: paymentMethod === 'PayPal' ? 'PayPal Account' : cardHolder,
                        client_id: id,
                        is_default: false,
                        address: address
                    };

                    await apiClient.post(API_URL_PAYMENT_METHODS, paymentMethodPayload);
                    console.log("Forma de pago guardada:", paymentMethodPayload);
                }

                // Cerrar el modal
                setShowModal(false);
                navigate('/sales')
            } else {
                alert('Método de pago no válido.');
                return;
            }
            
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const handlePayPalApprove = async (orderID) => {
        try {
            // Crear carrito
            const cartPayload = { client_id: id };
            const cartResponse = await apiClient.post(API_URL_DELIVERY_CARTS, cartPayload);
            const cartData = cartResponse.data;

            // Agregar detalles del carrito
            for (const item of cartItems) {
                const cartDetailPayload = {
                    cart: cartData.cart_id,
                    product: item.product_id,
                    quantity: item.quantity.toString(),
                };
                await apiClient.post(API_URL_DELIVERY_CART_DETAILS, cartDetailPayload);
            }

            // Registrar la venta
            const salePayload = { total: subtotal, client_id: id };
            const saleResponse = await apiClient.post(API_URL_DELIVERY_SALES, salePayload);
            const saleData = saleResponse.data;

            // Agregar detalles de la venta
            for (const item of cartItems) {
                const saleDetailPayload = {
                    sale: saleData.sale_id,
                    product: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                };
                await apiClient.post(API_URL_DELIVERY_SALE_DETAILS, saleDetailPayload);
            }

            // Registro del pago con PayPal
            const paymentPayload = {
                payment_method: 'PayPal',
                amount: subtotal,
                transaction_id: orderID,
                sale_id: saleData.sale_id,
            };
            await apiClient.post(API_URL_DELIVERY_PAYMENTS, paymentPayload);
            console.log("Pago con PayPal registrado con éxito");

            // Cerrar el modal
            setShowModal(false);
            navigate('/sales')
        } catch (error) {
            console.error('Error processing PayPal payment:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={8}>
                    <h1 className="mb-4">Carrito de Compras</h1>
                    {cartItems.length === 0 ? (
                        <p>No hay artículos en el carrito</p>
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
                                            <FaTrashAlt className="mr-2" /> Eliminar
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
                        <h4>Subtotal ({cartItems.length} productos): ${subtotal}</h4>
                        <Button
                            style={{ backgroundColor: "#5cb85c", borderColor: "#5cb85c" }}
                            className="w-100"
                            onClick={() => setShowModal(true)}
                        >
                            Proceder al pago
                        </Button>
                    </Card>
                    <Card className="p-4 shadow-lg border-0 rounded">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-4">Empareja con tu carrito</Card.Title>
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
                                            Agregar al carrito
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
                    <Modal.Title className="font-weight-bold">Confirmar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="font-weight-bold mb-3">Resumen de la Compra</h5>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
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
                            <Form.Label className="font-weight-bold">Método de Pago</Form.Label>
                            <Form.Control
                                as="select"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mb-3"
                            >
                                <option value="Debito">Débito</option>
                                <option value="Credito">Crédito</option>
                                <option value="PayPal">PayPal</option>
                            </Form.Control>
                        </Form.Group>
                        {paymentMethod === 'Debito' || paymentMethod === 'Credito' ? (
                            <>
                                <Form.Group controlId="formCardNumber">
                                    <Form.Label className="font-weight-bold">Número de Tarjeta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el número de tarjeta (16 dígitos)"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCardHolder">
                                    <Form.Label className="font-weight-bold">Nombre del Titular</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre del titular"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formaddress">
                                    <Form.Label className="font-weight-bold">Direccion de envio del paqute</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la direccion donde el paquete sera enviado"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formExpiryDate">
                                    <Form.Label className="font-weight-bold">Fecha de Expiración</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="MM/AA"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCvv">
                                    <Form.Label className="font-weight-bold">CVV</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el CVV (3 dígitos)"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
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
                                            alert("Pago con PayPal completado por " + details.payer.name.given_name);
                                        });
                                    }}
                                    onError={(err) => {
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
                        Cancelar
                    </Button>
                    {paymentMethod !== 'PayPal' && (
                        <Button
                            variant="primary"
                            onClick={handleProceedToPayment}
                        >
                            Confirmar y Proceder al Pago
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Salesdetails;
