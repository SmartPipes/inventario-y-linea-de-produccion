import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesPage.css';
import { apiClient } from '../../ApiClient';
import Sidebar from '../items/Sidebar';
import { useCart } from '../../context/CartContext';

const SalesPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Todas las categorías');
    const [sortOption, setSortOption] = useState('Relevancia');
    const { handleAddToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/inventory/products/');
                setProducts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
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
            return 0; // Default to relevance, no sorting
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
                            {/* Añade más categorías según sea necesario */}
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
                            <Card className="card-custom">
                                <div className="card-img-container">
                                    <Card.Img src={product.image_icon} className="card-img-top" />
                                </div>
                                <Card.Body className="card-body-custom">
                                    <Card.Title className="card-title-custom" title={product.name}>{product.name}</Card.Title>
                                    <Card.Text className="card-text-custom">
                                        <strong>${product.price}</strong>
                                    </Card.Text>
                                    <Button className="button-custom" onClick={() => handleAddToCart(product)}>AÑADIR AL CARRITO</Button>
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
