import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesPage.css';
import { apiClient } from '../../ApiClient';
import Sidebar from '../items/Sidebar';
import { useCart } from '../../context/CartContext';

import {
    API_URL_PRODUCTS,
    API_URL_INVENTORYSUM
} from './Config';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const { handleAddToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productResponse, inventoryResponse] = await Promise.all([
                    apiClient.get(API_URL_PRODUCTS),
                    apiClient.get(API_URL_INVENTORYSUM)
                ]);

                const products = productResponse.data;
                const inventory = inventoryResponse.data.filter(item => item.item_type === 'Product');
                
                const productsWithStock = products.map(product => {
                    const inventoryItem = inventory.find(item => item.item_id === product.product_id);
                    return {
                        ...product,
                        stock: inventoryItem ? inventoryItem.total_stock : 0
                    };
                });

                setProducts(productsWithStock);
                console.log(productsWithStock); // Log para verificar los datos combinados
            } catch (error) {
                console.error('Error fetching products or inventory:', error);
            }
        };

        fetchProducts();
    }, []);

    // Función para manejar la selección del método de pago
    const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
    };

    return (
        <div>
            <Container fluid className="px-0">
                <Row noGutters className="min-vh-100">
                    <Col md={2} className="bg-dark sidebar">
                        <Sidebar />
                    </Col>
                    <Col md={8} className="products-column">
                        <Container className="py-4">
                            <h1 className="mb-4">Stores</h1>
                            <Row>
                                {products.map(product => (
                                    <Col key={product.product_id} xs={12} sm={6} md={6} lg={4} className="mb-4">
                                        <Card className={`h-100 ${product.stock === 0 ? 'bg-light text-muted' : ''}`}>
                                            <div className="card-img-container">
                                                <Card.Img variant="top" src={product.image_icon} className="card-img-top" />
                                            </div>
                                            <Card.Body>
                                                <Card.Title>{product.name}</Card.Title>
                                                <Card.Text className="text-muted">${product.price}</Card.Text>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className={product.stock === 0 ? 'disabled' : ''}
                                                >
                                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </Col>
                    <Col md={2} className="bg-light payment-methods">
                        <Container className="py-4">
                            <h4>Select Payment Method</h4>
                            <ListGroup>
                                <ListGroupItem action onClick={() => handleSelectPaymentMethod('Credit Card')} active={selectedPaymentMethod === 'Credit Card'}>
                                    Credit Card
                                </ListGroupItem>
                                <ListGroupItem action onClick={() => handleSelectPaymentMethod('PayPal')} active={selectedPaymentMethod === 'PayPal'}>
                                    PayPal
                                </ListGroupItem>
                                <ListGroupItem action onClick={() => handleSelectPaymentMethod('Stripe')} active={selectedPaymentMethod === 'Stripe'}>
                                    Stripe
                                </ListGroupItem>
                            </ListGroup>
                            {selectedPaymentMethod && (
                                <div className="mt-4">
                                    <h5>Selected Method:</h5>
                                    <p>{selectedPaymentMethod}</p>
                                </div>
                            )}
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SalesPage;
