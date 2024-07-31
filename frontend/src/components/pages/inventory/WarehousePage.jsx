import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message } from 'antd';
import { API_URL_WAREHOUSES, API_URL_CITIES, API_URL_USERS, API_URL_USER_WARE_ASSIGN } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchWarehouses();
        fetchCities();
        fetchUsers();
        fetchAssignments();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, warehouses]);

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

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
            setFilteredWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
        setLoading(false);
    };

    const fetchCities = async () => {
        try {
            const response = await apiClient.get(API_URL_CITIES);
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get(API_URL_USERS);
            setUsers(response.data.filter(user => user.role === 'Admin'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await apiClient.get(API_URL_USER_WARE_ASSIGN);
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const showModal = (warehouse = null) => {
        setCurrentWarehouse(warehouse);
        setEditMode(!!warehouse);
        if (warehouse) {
            form.setFieldsValue(warehouse);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editMode) {
                await apiClient.put(`${API_URL_WAREHOUSES}${currentWarehouse.warehouse_id}/`, values);
                message.success('Warehouse updated successfully');
            } else {
                await apiClient.post(API_URL_WAREHOUSES, values);
                message.success('Warehouse added successfully');
            }
            fetchWarehouses();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving warehouse:', error);
            message.error('Error saving warehouse');
        }
    };

    const showDeleteModal = (warehouseId) => {
        setCurrentWarehouseId(warehouseId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_WAREHOUSES}${currentWarehouseId}/`);
            fetchWarehouses();
            message.success('Warehouse deleted successfully');
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            message.error('Error deleting warehouse');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = warehouses.filter(warehouse =>
            (warehouse.name && warehouse.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (warehouse.address && warehouse.address.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredWarehouses(filtered);
    };

    const showAssignModal = (warehouseId) => {
        setCurrentWarehouseId(warehouseId);
        setIsAssignModalVisible(true);
    };

    const handleAssignManager = async () => {
        try {
            await apiClient.post(API_URL_USER_WARE_ASSIGN, {
                warehouse: currentWarehouseId,
                manager_user: selectedUser,
                assigned_date: new Date().toISOString().split('T')[0],
            });
            message.success('Manager assigned successfully');
            fetchAssignments();
            setIsAssignModalVisible(false);
        } catch (error) {
            console.error('Error assigning manager:', error);
            message.error('Error assigning manager');
        }
    };

    const handleRemoveManager = async (assignmentId) => {
        try {
            const removedDate = new Date().toISOString().split('T')[0];
            await apiClient.patch(`${API_URL_USER_WARE_ASSIGN}${assignmentId}/`, {
                removed_date: removedDate
            });
            message.success('Manager removed successfully');
            fetchAssignments();
        } catch (error) {
            console.error('Error removing manager:', error);
            message.error('Error removing manager');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'warehouse_id', key: 'warehouse_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'State', dataIndex: 'status', key: 'status' },
        { title: 'City', dataIndex: 'city', key: 'city', render: (text) => cities.find(city => city.city_id === text)?.city_name || 'Unknown' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Edit</Button>
                    <Button onClick={() => showDeleteModal(record.warehouse_id)} type="link" danger>Delete</Button>
                    <Button onClick={() => showAssignModal(record.warehouse_id)} type="link">Assign Manager</Button>
                    {assignments.filter(assign => assign.warehouse === record.warehouse_id && !assign.removed_date).map(assign => (
                        <Button key={assign.user_warehouse_assignment_id} onClick={() => handleRemoveManager(assign.user_warehouse_assignment_id)} type="link" danger>
                            Remove Manager
                        </Button>
                    ))}
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Warehouses" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Search Warehouse..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Add Warehouse</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredWarehouses}
                rowKey="warehouse_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Edit Warehouse' : 'Add Warehouse'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="State" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                        <Select>
                            {cities.map(city => (
                                <Option key={city.city_id} value={city.city_id}>{city.city_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Assign Manager"
                visible={isAssignModalVisible}
                onOk={handleAssignManager}
                onCancel={() => setIsAssignModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Select Manager" required>
                        <Select
                            showSearch
                            placeholder="Select a manager"
                            optionFilterProp="children"
                            onChange={value => setSelectedUser(value)}
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>{`${user.first_name} ${user.last_name}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Delete${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this warehouse? Please wait {countdown} seconds to confirm deletion.</p>
            </Modal>
        </div>
    );
};

export default WarehousePage;
