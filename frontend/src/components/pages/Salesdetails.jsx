import React, { useState } from 'react';
import { Container, Card, Button, Image, InputGroup, FormControl, Row, Col, Modal, Form, Table } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Salesdetails = () => {
    const { cartItems, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Debito');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);

    const handleProceedToPayment = async () => {
        try {
            // Crear el carrito
            const cartPayload = {
                client_id: null // Ajusta esto según tu lógica
            };
            console.log('Creando carrito con:', JSON.stringify(cartPayload));

            const cartResponse = await fetch('/sales/carts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                },
                body: JSON.stringify(cartPayload)
            });
            const cartData = await cartResponse.json();
            console.log('Respuesta del carrito:', cartData);

            // Agregar detalles del carrito
            const cartDetailsPayloads = cartItems.map(item => ({
                cart: cartData.cart_id,
                product: item.product_id,
                quantity: item.quantity
            }));
            cartDetailsPayloads.forEach(payload => {
                console.log('Agregando detalle del carrito con:', JSON.stringify(payload));
            });

            await Promise.all(cartItems.map(item =>
                fetch('/sales/cart-details/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    },
                    body: JSON.stringify({
                        cart: cartData.cart_id,
                        product: item.product_id,
                        quantity: item.quantity
                    })
                })
            ));

            // Crear la venta
            const salePayload = {
                total: subtotal,
                client_id: null
            };
            console.log('Creando venta con:', JSON.stringify(salePayload));

            const saleResponse = await fetch('/sales/sales/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                },
                body: JSON.stringify(salePayload)
            });
            const saleData = await saleResponse.json();
            console.log('Respuesta de la venta:', saleData);

            // Agregar detalles de la venta
            const saleDetailsPayloads = cartItems.map(item => ({
                sale: saleData.sale_id,
                product: item.product_id,
                quantity: item.quantity,
                price: item.price
            }));
            saleDetailsPayloads.forEach(payload => {
                console.log('Agregando detalle de la venta con:', JSON.stringify(payload));
            });

            await Promise.all(cartItems.map(item =>
                fetch('/sales/sale-details/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    },
                    body: JSON.stringify({
                        sale: saleData.sale_id,
                        product: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    })
                })
            ));

            // Registrar el pago
            const paymentPayload = {
                payment_method: paymentMethod,
                amount: subtotal,
                transaction_id: null,
                sale_id: saleData.sale_id
            };
            console.log('Registrando pago con:', JSON.stringify(paymentPayload));

            await fetch('/sales/payments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                },
                body: JSON.stringify(paymentPayload)
            });

            // Mostrar alerta de éxito
            alert('Compra realizada exitosamente');

            // Cerrar el modal
            setShowModal(false);
        } catch (error) {
            console.error('Error processing payment:', error);
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
                    <Card className="p-3 shadow-sm border-0">
                        <h5>Empareja con tu carrito</h5>
                        {cartItems.slice(0, 3).map(item => (
                            <div key={item.product_id} className="d-flex align-items-center mb-3">
                                <Image src={item.image_icon} thumbnail style={{ width: '50px', height: '50px' }} />
                                <div className="ml-3">
                                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>{item.name}</p>
                                    <Button variant="link" className="p-0">Agregar al carrito</Button>
                                </div>
                                <div className="ml-auto">${parseFloat(item.price).toFixed(2)}</div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Modal de Confirmación de Pago */}
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
                                        placeholder="Ingrese el número de tarjeta" 
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
                                        placeholder="Ingrese el CVV" 
                                        value={cvv} 
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="mb-3"
                                    />
                                </Form.Group>
                            </>
                        ) : null}

                    </Form>
                    <hr />
                    <h5 className="font-weight-bold">Subtotal: ${subtotal}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleProceedToPayment}
                    >
                        Confirmar y Proceder al Pago
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Salesdetails;
