
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../ApiClient';
import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesCustomer.css';
import Sidebar from '../items/Sidebar';

const SalesCustomer = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const id = localStorage.getItem('id');

    useEffect(() => {
        apiClient.get('/delivery/delivery-orders/')
            .then(response => {
                const filteredOrders = response.data.filter(order => Number(order.client) === Number(id));
                setOrders(filteredOrders);
                const orderIds = filteredOrders.map(order => order.delivery_order_id);
                return orderIds;
            })
            .then(orderIds => {
                return apiClient.get('/delivery/delivery-order-details/')
                    .then(response => {
                        const filteredDetails = response.data.filter(detail => orderIds.includes(detail.delivery_order));
                        setOrderDetails(filteredDetails);
                        return filteredDetails;
                    });
            })
            .then(details => {
                const productRequests = details.map(detail => 
                    apiClient.get(`/inventory/products/${detail.product}`)
                );
                return Promise.all(productRequests)
                    .then(productsResponse => {
                        const allProducts = productsResponse.map(pr => pr.data);
                        setProducts(allProducts);
                    });
            })
            .catch(error => console.error('Error:', error.message));
    }, [id]);

    if (orders.length === 0 || products.length === 0) {
        return <div>You havent bought anything yet, go to buy something!!</div>;
    }

    return (
        <div className="order-page">
            <h1>My orders</h1>
            {orders.map(order => (
                <Card className="mb-3" key={order.delivery_order_id}>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <div>
                                <Card.Title style={{fontSize:'20px'}}>Order Created on {new Date(order.delivery_date).toLocaleDateString()}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted" style={{fontSize:'18px'}}>ORDER #{order.delivery_order_id}</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted" style={{fontSize:'18px'}}>Status {order.status}</Card.Subtitle>
                            </div>
                            {/* <div>
                                <Button variant="outline-secondary" size="sm" className="me-2">
                                    View order details
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                    Invoice
                                </Button>
                            </div> */}
                        </div>
                        <ListGroup variant="flush" className="mt-3">
                            {orderDetails
                                .filter(detail => detail.delivery_order === order.delivery_order_id)
                                .map(detail => {
                                    const product = products.find(p => p.product_id === detail.product);
                                    return (
                                        <ListGroup.Item key={detail.delivery_order_detail_id} className="d-flex align-items-start">
                                            <img src={product.image_icon} alt={product.name} width={200} className="me-3" />
                                            <div className="flex-grow-1">
                                            <Card.Title style={{fontSize:'20px'}}>{product.name}</Card.Title>
                                                <p className="mb-1" style={{fontSize:'18px'}}>{product.description}</p>
                                                <p style={{fontSize:'18px'}}><strong>Price: </strong>${product.price}</p>
                                                <p style={{fontSize:'18px'}}><strong>Quantity: </strong>{detail.quantity}</p>
                                            </div>
                                            {/* <div className="d-flex flex-column">
                                                <Button variant="warning" size="sm" className="mb-2">
                                                    Buy again
                                                </Button>
                                                <Button variant="link" size="sm">
                                                    View your article
                                                </Button>
                                            </div> */}
                                        </ListGroup.Item>
                                    );
                                })}
                        </ListGroup>
                    </Card.Body>
                </Card>
                
            ))}
            <Sidebar />
        </div>
    );
};

export default SalesCustomer;
