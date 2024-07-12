import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, Space, message, Select } from 'antd';
import { 
    API_URL_RESTOCKREQUEST, 
    API_URL_USERS, 
    API_URL_INV, 
    API_URL_PRODUCTS, 
    API_URL_RAW_MATERIALS,
    API_URL_WAREHOUSES
} from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

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
    const [warehouses, setWarehouses] = useState([]);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchRestockRequests();
        fetchUsers();
        fetchInventoryItems();
        fetchProducts();
        fetchRawMaterials();
        fetchWarehouses();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, restockRequests]);

    useEffect(() => {
        if (isDeleteModalVisible) {
            setCountdown(3);
            setDeleteEnabled(false);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setDeleteEnabled(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [isDeleteModalVisible]);

    const fetchRestockRequests = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_RESTOCKREQUEST);
            setRestockRequests(response.data);
            setFilteredRequests(response.data);
        } catch (error) {
            console.error('Error fetching restock requests:', error);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get(API_URL_USERS);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await apiClient.get(API_URL_INV);
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
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

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const getUserById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    };

    const getRawMaterialNameById = (rawMaterialId) => {
        const rawMaterial = rawMaterials.find(material => material.raw_material_id === rawMaterialId);
        return rawMaterial ? rawMaterial.name : 'Unknown Raw Material';
    };

    const getWarehouseById = (warehouseId) => {
        const warehouse = warehouses.find(wh => wh.warehouse_id === warehouseId);
        return warehouse ? warehouse.name : 'Unknown Warehouse';
    };

    const showModal = (request = null) => {
        setCurrentRequest(request);
        setEditMode(!!request);
        if (request) {
            form.setFieldsValue({
                raw_material: request.raw_material,
                quantity: request.quantity,
                status: request.status,
                requested_by: request.requested_by,
                warehouse: request.warehouse
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                raw_material: values.raw_material,
                quantity: parseInt(values.quantity),
                status: values.status,
                requested_by: values.requested_by,
                warehouse: values.warehouse
            };
            console.log('Data to be sent:', data);  // Debugging line to print data to be sent
            if (editMode) {
                await apiClient.put(`${API_URL_RESTOCKREQUEST}${currentRequest.restock_request_id}/`, data);
                message.success('Solicitud actualizada exitosamente');
            } else {
                await apiClient.post(API_URL_RESTOCKREQUEST, data);
                message.success('Solicitud agregada exitosamente');
            }
            fetchRestockRequests();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar la solicitud:', error);
            message.error('Error al guardar la solicitud');
        }
    };

    const showDeleteModal = (requestId) => {
        setCurrentRequestId(requestId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_RESTOCKREQUEST}${currentRequestId}/`);
            fetchRestockRequests();
            message.success('Solicitud eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
            message.error('Error al eliminar la solicitud');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = restockRequests.filter(request => {
            const rawMaterialName = getRawMaterialNameById(request.raw_material);
            const userName = getUserById(request.requested_by);
            const warehouseName = getWarehouseById(request.warehouse);
            return (
                (rawMaterialName && rawMaterialName.toLowerCase().includes(searchText.toLowerCase())) ||
                (request.status && request.status.toLowerCase().includes(searchText.toLowerCase())) ||
                (userName && userName.toLowerCase().includes(searchText.toLowerCase())) ||
                (warehouseName && warehouseName.toLowerCase().includes(searchText.toLowerCase()))
            );
        });
        setFilteredRequests(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'restock_request_id', key: 'restock_request_id' },
        {
            title: 'Nombre del artículo',
            dataIndex: 'raw_material',
            key: 'raw_material',
            render: (text) => getRawMaterialNameById(text),
        },
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Estado', dataIndex: 'status', key: 'status' },
        {
            title: 'Solicitado por',
            dataIndex: 'requested_by',
            key: 'requested_by',
            render: (text) => getUserById(text),
        },
        { title: 'Fecha de Solicitud', dataIndex: 'requested_at', key: 'requested_at' },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
            render: (text) => getWarehouseById(text),
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.restock_request_id)} type="link" danger>Eliminar</Button>
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
                    <Form.Item name="raw_material" label="Artículo" rules={[{ required: true }]}>
                        <Select>
                            {rawMaterials.map(item => (
                                <Option key={item.raw_material_id} value={item.raw_material_id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Cantidad" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Pending">Pending</Option>
                            <Option value="Approved">Approved</Option>
                            <Option value="Rejected">Rejected</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="requested_by" label="Solicitado por" rules={[{ required: true }]}>
                        <Select>
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {`${user.first_name} ${user.last_name}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="warehouse" label="Almacén" rules={[{ required: true }]}>
                        <Select>
                            {warehouses.map(warehouse => (
                                <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                    {warehouse.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirmar Eliminación"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white',  color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>¿Estás seguro de que quieres borrar esta solicitud de reabastecimiento? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default RestockRequestPage;
