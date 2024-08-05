import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Row, Col, Tooltip, ConfigProvider, Select, Modal, Descriptions, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { apiClient } from '../../../ApiClient';
import NavBarMenu from './NavBarMenu';
import { API_URL_RESTOCKREQUEST, API_URL_RAW_MATERIALS, API_URL_WAREHOUSES, API_URL_USERS, API_URL_SUPPLIERS, API_URL_UPDATE_INVENTORY } from '../Config';

const { Option } = Select;

const ReceiptsPage = () => {
    const [restockRequests, setRestockRequests] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRestockRequest, setSelectedRestockRequest] = useState(null);
    const [rawMaterial, setRawMaterial] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [requestedBy, setRequestedBy] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const fetchRestockRequestDetails = async (id) => {
        setLoadingDetails(true);
        try {
            const response = await apiClient.get(`${API_URL_RESTOCKREQUEST}${id}/`);
            const restockData = response.data;
            setSelectedRestockRequest(restockData);

            // Fetch related raw material
            const rawMaterialResponse = await apiClient.get(`${API_URL_RAW_MATERIALS}${restockData.raw_material}/`);
            setRawMaterial(rawMaterialResponse.data);

            // Fetch related warehouse
            const warehouseResponse = await apiClient.get(`${API_URL_WAREHOUSES}${restockData.warehouse}/`);
            setWarehouse(warehouseResponse.data);

            // Fetch requested by user
            const userResponse = await apiClient.get(`${API_URL_USERS}${restockData.requested_by}/`);
            setRequestedBy(userResponse.data);

            // Fetch supplier details if supplier ID exists in restockData
            if (rawMaterialResponse.data.supplier) {
                const supplierResponse = await apiClient.get(`${API_URL_SUPPLIERS}${rawMaterialResponse.data.supplier}/`);
                setSupplier(supplierResponse.data);
            } else {
                setSupplier({ name: 'Unknown', email: 'N/A' });
            }
        } catch (error) {
            console.error('Error fetching restock request details:', error);
        }
        setLoadingDetails(false);
    };

    const handleValidate = async () => {
        if (!selectedRestockRequest || !rawMaterial || !warehouse) {
            message.error('Cannot validate request. Missing data.');
            return;
        }
    
        const userId = localStorage.getItem('user_id'); // Obtener el user_id desde el localStorage
    
        const stockData = {
            inventory_id: selectedRestockRequest.inventory_id,
            item_id: rawMaterial.raw_material_id,
            item_type: 'RawMaterial',
            warehouse_id: warehouse.warehouse_id,
            stock: selectedRestockRequest.quantity,
            user_id: userId // Agregar el user_id al stockData
        };
    
        try {
            const response = await apiClient.post(API_URL_UPDATE_INVENTORY, stockData);
    
            if (response.status === 200 || response.status === 201) {
                await apiClient.patch(`${API_URL_RESTOCKREQUEST}${selectedRestockRequest.restock_request_id}/`, { status: 'Approved' });
                message.success('Restock request validated successfully and inventory updated');
                setIsModalVisible(false);
                fetchRestockRequests();
            } else {
                console.error('Unexpected response status:', response.status, response.data);
                message.error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error validating restock request:', error.response?.data || error.message);
            message.error('Error validating restock request');
        }
    };    

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const filteredData = statusFilter
        ? restockRequests.filter((request) => request.status === statusFilter)
        : restockRequests;

    const columns = [
        { title: 'ID', dataIndex: 'restock_request_id', key: 'restock_request_id' },
        {
            title: 'State',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Approved', value: 'Approved' },
                { text: 'Pending', value: 'Pending' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status) => {
                let color;
                let icon;
                if (status === 'Pending') {
                    color = 'orange';
                    icon = null;
                } else if (status === 'Approved') {
                    color = 'green';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'Rejected') {
                    color = 'red';
                    icon = <CheckCircleOutlined />;
                }
                return (
                    <span>
                        <Tag color={color} icon={icon} className="mobile-state">
                            <span className="desktop-only">{status}</span>
                        </Tag>
                    </span>
                );
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
                    <Tooltip title="View Details">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setIsModalVisible(true);
                                fetchRestockRequestDetails(record.restock_request_id);
                            }}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <ConfigProvider>
            <NavBarMenu title="Receipts" />
            <Row justify="center" style={{ padding: '10px' }}>
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Space style={{ marginBottom: 16 }}>
                        <Select
                            placeholder="Filter by status"
                            onChange={handleStatusFilterChange}
                            allowClear
                            style={{ width: 200 }}
                        >
                            <Option value="Approved">Approved</Option>
                            <Option value="Pending">Pending</Option>
                        </Select>
                    </Space>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="restock_request_id"
                        scroll={{ x: true }}
                    />
                </Col>
            </Row>
            <Modal
                title="Receipt Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                    <Button key="validate" type="primary" onClick={handleValidate} disabled={selectedRestockRequest?.status === 'Approved'}>
                        Validate
                    </Button>,
                ]}
            >
                {loadingDetails ? (
                    <p>Loading...</p>
                ) : (
                    selectedRestockRequest && rawMaterial && warehouse && requestedBy && supplier && (
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Request Date">{selectedRestockRequest.requested_at}</Descriptions.Item>
                            <Descriptions.Item label="Product">
                                <img src={rawMaterial.image_icon} alt={rawMaterial.name} style={{ width: '30px', marginRight: '10px' }} />
                                {rawMaterial.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quantity">{selectedRestockRequest.quantity}</Descriptions.Item>
                            <Descriptions.Item label="Requested By">{requestedBy.first_name} {requestedBy.last_name}</Descriptions.Item>
                            <Descriptions.Item label="Supplier">{supplier.name}</Descriptions.Item>
                            <Descriptions.Item label="Warehouse">{warehouse.name}</Descriptions.Item>
                        </Descriptions>
                    )
                )}
            </Modal>
        </ConfigProvider>
    );
};

export default ReceiptsPage;
