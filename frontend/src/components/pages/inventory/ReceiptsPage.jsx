import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../ApiClient';
import { API_URL_RESTOCKREQUEST, API_URL_RAW_MATERIALS } from '../Config';

const ReceiptsPage = () => {
    const [restockRequests, setRestockRequests] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestockRequests();
        fetchRawMaterials();
    }, []);

    const fetchRestockRequests = async () => {
        try {
            const response = await apiClient.get(API_URL_RESTOCKREQUEST);
            setRestockRequests(response.data);
        } catch (error) {
            console.error('Error fetching restock requests:', error);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'restock_request_id', key: 'restock_request_id' },
        {
            title: 'State',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                if (status === 'Pending') color = 'orange';
                else if (status === 'Approved') color = 'green';
                else if (status === 'Rejected') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Reference',
            dataIndex: 'restock_request_id',
            key: 'reference',
            render: (text, record) => `WH-IN-${String(record.restock_request_id).padStart(5, '0')}`
        },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Request Date', dataIndex: 'requested_at', key: 'requested_at' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => navigate(`/inventory/receipts/${record.restock_request_id}`)}>View Details</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Receipts</h2>
            <Table columns={columns} dataSource={restockRequests} rowKey="restock_request_id" />
        </div>
    );
};

export default ReceiptsPage;
