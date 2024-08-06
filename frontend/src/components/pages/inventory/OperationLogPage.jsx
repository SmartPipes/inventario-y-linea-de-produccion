import React, { useState, useEffect } from 'react';
import { Table, Modal, Space, Button, message, Tag, Row, Col, Select, Tooltip } from 'antd';
import { PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const { Option } = Select;

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
    const [filteredLogs, setFilteredLogs] = useState([]);
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

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedOperationType, setSelectedOperationType] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    useEffect(() => {
        applyFilters();
    }, [selectedUser, selectedWarehouse, selectedOperationType, operationLogs]);

    const fetchOperationLogs = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_OPERATION_LOG);
            setOperationLogs(response.data);
            setFilteredLogs(response.data);
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

    const applyFilters = () => {
        let filtered = [...operationLogs];
        if (selectedUser) {
            filtered = filtered.filter(log => log.op_log_user === selectedUser);
        }
        if (selectedWarehouse) {
            filtered = filtered.filter(log => log.warehouse === selectedWarehouse);
        }
        if (selectedOperationType) {
            filtered = filtered.filter(log => log.type_operation === selectedOperationType);
        }
        setFilteredLogs(filtered);
    };

    const getFilterDescription = () => {
        const filters = [];
        if (selectedUser) {
            filters.push(`Filter User: ${getUserById(selectedUser)}`);
        }
        if (selectedWarehouse) {
            filters.push(`Filter Warehouse: ${getWarehouseById(selectedWarehouse)}`);
        }
        if (selectedOperationType) {
            filters.push(`Filter Operation Type: ${selectedOperationType}`);
        }
        return filters.join(', ');
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        doc.text('Operation Logs', 14, 16);
        const filterDescription = getFilterDescription();
        if (filterDescription) {
            doc.text(filterDescription, 14, 24);
        }
        doc.autoTable({
            head: [['No.', 'Quantity', 'Date/Hour', 'Operation Type', 'Article', 'User', 'Warehouse']],
            body: filteredLogs.map((log, index) => [
                index + 1,
                log.quantity,
                log.datetime,
                log.type_operation,
                getItemName(log.inventory_item),
                getUserById(log.op_log_user),
                getWarehouseById(log.warehouse)
            ]),
            startY: filterDescription ? 28 : 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [22, 160, 133] }
        });

        doc.save('operation_logs.pdf');
    };

    const downloadExcel = () => {
        const data = filteredLogs.map((log, index) => ({
            No: index + 1,
            Quantity: log.quantity,
            'Date/Hour': log.datetime,
            'Operation Type': log.type_operation,
            Article: getItemName(log.inventory_item),
            User: getUserById(log.op_log_user),
            Warehouse: getWarehouseById(log.warehouse)
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Operation Logs');

        const filterDescription = getFilterDescription();
        if (filterDescription) {
            XLSX.utils.sheet_add_aoa(worksheet, [[filterDescription]], { origin: -1 });
        }

        XLSX.writeFile(workbook, 'operation_logs.xlsx');
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
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
                    <Tooltip title="Delete">
                        <Button onClick={() => showDeleteModal(record.operation_log_id)} type="link" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Operations Log" />
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Select User"
                        onChange={setSelectedUser}
                        style={{ width: '100%' }}
                        value={selectedUser}
                        allowClear
                    >
                        {users.map(user => (
                            <Option key={user.id} value={user.id}>
                                {`${user.first_name} ${user.last_name}`}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Select Warehouse"
                        onChange={setSelectedWarehouse}
                        style={{ width: '100%' }}
                        value={selectedWarehouse}
                        allowClear
                    >
                        {warehouses.map(warehouse => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                {warehouse.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Operation Type"
                        onChange={setSelectedOperationType}
                        style={{ width: '100%' }}
                        value={selectedOperationType}
                        allowClear
                    >
                        <Option value="Add">Add</Option>
                        <Option value="Remove">Remove</Option>
                    </Select>
                </Col>
            </Row>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={downloadPDF}>Download PDF</Button>
                <Button type="primary" onClick={downloadExcel}>Download Excel</Button>
            </Space>
            <ResponsiveTable
                columns={columns}
                dataSource={filteredLogs}
                rowKey="operation_log_id"
                loading={loading}
                scroll={{ x: '100%' }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }
                }}
            />
            <ResponsiveModal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this record? Please wait {countdown} seconds to confirm the deletion.</p>
            </ResponsiveModal>
        </div>
    );
};

export default OperationLogPage;
