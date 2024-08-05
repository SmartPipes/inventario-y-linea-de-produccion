import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesPage.css';
import { apiClient } from '../../ApiClient';
import Sidebar from '../items/Sidebar';
import { useCart } from '../../context/CartContext';

import {
    API_URL_PRODUCTS,
    API_URL_INVENTORYSUM
} from './Config';

const SalesPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Todas las categorías');
    const [sortOption, setSortOption] = useState('Relevancia');
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
            } catch (error) {
                console.error('Error fetching products or inventory:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setCategory(category);
    };

    const handleSortOptionChange = (option) => {
        setSortOption(option);
    };

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'Todas las categorías' || product.category === category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOption === 'Precio: menor a mayor') return a.price - b.price;
            if (sortOption === 'Precio: mayor a menor') return b.price - a.price;
            if (sortOption === 'Alfabético: A-Z') return a.name.localeCompare(b.name);
            if (sortOption === 'Alfabético: Z-A') return b.name.localeCompare(a.name);
            return 0;
        });

    return (
        <div>
            <Container className="container-custom">
                <h1>Store</h1>
                <Form>
                    <InputGroup className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            title={category}
                            id="category-dropdown"
                            onSelect={handleCategoryChange}
                        >
                            <Dropdown.Item eventKey="Todas las categorías">Todas las categorías</Dropdown.Item>
                            <Dropdown.Item eventKey="Electrónicos">Electrónicos</Dropdown.Item>
                            <Dropdown.Item eventKey="Hogar y Cocina">Hogar y Cocina</Dropdown.Item>
                        </DropdownButton>
                        <Form.Control
                            type="text"
                            placeholder="Buscar productos"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <InputGroup.Text>
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <DropdownButton
                            variant="outline-secondary"
                            title={sortOption}
                            id="sort-dropdown"
                            onSelect={handleSortOptionChange}
                        >
                            <Dropdown.Item eventKey="Relevancia">Relevancia</Dropdown.Item>
                            <Dropdown.Item eventKey="Precio: menor a mayor">Precio: menor a mayor</Dropdown.Item>
                            <Dropdown.Item eventKey="Precio: mayor a menor">Precio: mayor a menor</Dropdown.Item>
                            <Dropdown.Item eventKey="Alfabético: A-Z">Alfabético: A-Z</Dropdown.Item>
                            <Dropdown.Item eventKey="Alfabético: Z-A">Alfabético: Z-A</Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>
                </Form>
                <Row>
                    {filteredProducts.map(product => (
                        <Col key={product.product_id} xs={12} sm={6} md={4} lg={3}>
                            <Card className={`card-custom ${product.stock === 0 ? 'bg-light text-muted' : ''}`}>
                                <div className="card-img-container">
                                    <Card.Img src={product.image_icon} className="card-img-top" />
                                </div>
                                <Card.Body className="card-body-custom">
                                    <Card.Title className="card-title-custom" title={product.name}>{product.name}</Card.Title>
                                    <Card.Text className="card-text-custom">
                                        <strong>${product.price}</strong>
                                    </Card.Text>
                                    <Button
                                        className="button-custom"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Sin stock' : 'AÑADIR AL CARRITO'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Sidebar />
        </div>
    );
};

export default SalesPage;
