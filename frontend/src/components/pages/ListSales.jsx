import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesPage.css';
import { apiClient } from '../../ApiClient';

const ListSales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await apiClient.get('/sales/sales/');
                setSales(response.data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        fetchSales();
    }, []);

    return (
        <Container>
            <h1>Sales List</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Sale ID</th>
                        <th>Sale Date</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.sale_id}>
                            <td>{sale.sale_id}</td>
                            <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                            <td>${sale.total}</td>
                            <td>
                                <Button variant="primary" className="me-2">
                                    Details
                                </Button>
                                <Button variant="danger">
                                    Action
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ListSales;
