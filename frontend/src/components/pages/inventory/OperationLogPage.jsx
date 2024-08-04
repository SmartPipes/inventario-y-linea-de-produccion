import React, { useState, useEffect } from 'react';
import { Table, Modal, Space, Button, message, Tag } from 'antd';
import { 
    API_URL_OPERATION_LOG, 
    API_URL_USERS, 
    API_URL_INV, 
    API_URL_WAREHOUSES, 
    API_URL_PRODUCTS, 
    API_URL_RAW_MATERIALS 
} from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';
import styled from 'styled-components';

const ResponsiveTable = styled(Table)`
    .ant-table-container {
        overflow-x: auto;
    }
`;

const ResponsiveModal = styled(Modal)`
    @media (max-width: 768px) {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0;
    }
`;

const OperationLogPage = () => {
    const [operationLogs, setOperationLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentLogId, setCurrentLogId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchOperationLogs();
        fetchUsers();
        fetchInventoryItems();
        fetchWarehouses();
        fetchProducts();
        fetchRawMaterials();
    }, []);

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

    const fetchOperationLogs = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_OPERATION_LOG);
            setOperationLogs(response.data);
        } catch (error) {
            console.error('Error fetching operation logs:', error);
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

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
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

    const getUserById = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Usuario Desconocido';
    };

    const getItemName = (inventoryItemId) => {
        const inventoryItem = inventoryItems.find(item => item.inventory_id === inventoryItemId);
        return inventoryItem ? inventoryItem.item_name : 'Artículo Desconocido';
    };

    const getWarehouseById = (warehouseId) => {
        const warehouse = warehouses.find(warehouse => warehouse.warehouse_id === warehouseId);
        return warehouse ? warehouse.name : 'Almacén Desconocido';
    };

    const showDeleteModal = (logId) => {
        setCurrentLogId(logId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_OPERATION_LOG}${currentLogId}/`);
            fetchOperationLogs();
            message.success('Log eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el log:', error);
            message.error('Error al eliminar el log');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'operation_log_id', key: 'operation_log_id' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Date/Hour', dataIndex: 'datetime', key: 'datetime' },
        {
            title: 'Operation Type',
            dataIndex: 'type_operation',
            key: 'type_operation',
            render: (text) => (
                <Tag color={text === 'Add' ? 'green' : 'volcano'}>{text}</Tag>
            ),
        },
        {
            title: 'Article',
            dataIndex: 'inventory_item',
            key: 'inventory_item',
            render: (text, record) => getItemName(record.inventory_item),
        },
        {
            title: 'User',
            dataIndex: 'op_log_user',
            key: 'op_log_user',
            render: (text) => getUserById(text),
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
            render: (text) => getWarehouseById(text),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showDeleteModal(record.operation_log_id)} type="link" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Operations Log" />
            <ResponsiveTable
                columns={columns}
                dataSource={operationLogs}
                rowKey="operation_log_id"
                loading={loading}
                scroll={{ x: '100%' }}
            />
            <ResponsiveModal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white',  color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this record? Please wait{countdown} seconds to confirm the deletion.</p>
            </ResponsiveModal>
        </div>
    );
};

export default OperationLogPage;
