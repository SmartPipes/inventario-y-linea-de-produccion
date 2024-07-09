import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Form, Input, Button, Space } from 'antd';
import { 
    API_URL_RESTOCKREQUEST, 
    API_URL_USERS, 
    API_URL_INV, 
    API_URL_PRODUCTS, 
    API_URL_RAW_MATERIALS 
} from '../Config';
import NavBarMenu from './NavBarMenu';

const RestockRequestPage = () => {
    const [restockRequests, setRestockRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentRequest, setCurrentRequest] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [users, setUsers] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    useEffect(() => {
        fetchRestockRequests();
        fetchUsers();
        fetchInventoryItems();
        fetchProducts();
        fetchRawMaterials();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, restockRequests]);

    const fetchRestockRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_RESTOCKREQUEST);
            setRestockRequests(response.data);
            setFilteredRequests(response.data);
        } catch (error) {
            console.error('Error fetching restock requests:', error);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL_USERS);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get(API_URL_INV);
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get(API_URL_RAW_MATERIALS);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const getUserById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    };

    const getItemName = (inventoryItemId) => {
        const inventoryItem = inventoryItems.find(item => item.inventory_id === inventoryItemId);
        if (inventoryItem) {
            if (inventoryItem.item_type === 'Product') {
                const item = products.find(product => product.product_id === inventoryItem.item_id);
                return item ? item.name : 'Unknown Item';
            } else if (inventoryItem.item_type === 'RawMaterial') {
                const item = rawMaterials.find(rawMaterial => rawMaterial.raw_material_id === inventoryItem.item_id);
                return item ? item.name : 'Unknown Item';
            }
        }
        return 'Unknown Item';
    };

    const showModal = (request = null) => {
        setCurrentRequest(request);
        setEditMode(!!request);
        if (request) {
            form.setFieldsValue(request);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            if (editMode) {
                await axios.put(`${API_URL_RESTOCKREQUEST}${currentRequest.restock_request_id}/`, values);
            } else {
                await axios.post(API_URL_RESTOCKREQUEST, values);
            }
            fetchRestockRequests();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving restock request:', error);
        }
    };

    const handleDelete = async (requestId) => {
        try {
            await axios.delete(`${API_URL_RESTOCKREQUEST}${requestId}/`);
            fetchRestockRequests();
        } catch (error) {
            console.error('Error deleting restock request:', error);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = restockRequests.filter(request => {
            const itemName = getItemName(request.inventory_item);
            const userName = getUserById(request.requested_by);
            return (
                (itemName && itemName.toLowerCase().includes(searchText.toLowerCase())) ||
                (request.status && request.status.toLowerCase().includes(searchText.toLowerCase())) ||
                (userName && userName.toLowerCase().includes(searchText.toLowerCase()))
            );
        });
        setFilteredRequests(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'restock_request_id', key: 'restock_request_id' },
        {
            title: 'Nombre del artículo',
            dataIndex: 'inventory_item',
            key: 'inventory_item',
            render: (text) => getItemName(text),
        },
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Estado', dataIndex: 'status', key: 'status' },
        {
            title: 'Solicitado por',
            dataIndex: 'requested_by',
            key: 'requested_by',
            render: (text) => getUserById(text),
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => handleDelete(record.restock_request_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Solicitudes de Reabastecimiento" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar solicitud..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Solicitud</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="restock_request_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Solicitud' : 'Agregar Solicitud'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="item_name" label="Nombre del artículo" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="quantity" label="Cantidad" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="requested_by" label="Solicitado por" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RestockRequestPage;
