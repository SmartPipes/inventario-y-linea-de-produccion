import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const buttonColor = '#97b25e';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentSupplierId, setCurrentSupplierId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, suppliers]);

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

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_SUPPLIERS);
            setSuppliers(response.data);
            setFilteredSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
        setLoading(false);
    };

    const showModal = (supplier = null) => {
        setCurrentSupplier(supplier);
        setEditMode(!!supplier);
        if (supplier) {
            form.setFieldsValue(supplier);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                name: values.name,
                RFC: values.RFC,
                email: values.email,
                phone: values.phone,
                address: values.address,
                rating: values.rating
            };

            if (editMode) {
                await apiClient.put(`${API_URL_SUPPLIERS}${currentSupplier.supplier_id}/`, data);
                message.success('Supplier updated successfully');
            } else {
                await apiClient.post(API_URL_SUPPLIERS, data);
                message.success('Supplier added successfully');
            }
            fetchSuppliers();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving supplier:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
            message.error('Error saving supplier');
        }
    };

    const showDeleteModal = (supplierId) => {
        setCurrentSupplierId(supplierId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_SUPPLIERS}${currentSupplierId}/`);
            fetchSuppliers();
            message.success('Supplier deleted successfully');
        } catch (error) {
            console.error('Error deleting supplier:', error);
            message.error('Error deleting supplier');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = suppliers.filter(supplier =>
            (supplier.name && supplier.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (supplier.RFC && supplier.RFC.toLowerCase().includes(searchText.toLowerCase())) ||
            (supplier.email && supplier.email.toLowerCase().includes(searchText.toLowerCase())) ||
            (supplier.phone && supplier.phone.toLowerCase().includes(searchText.toLowerCase())) ||
            (supplier.address && supplier.address.toLowerCase().includes(searchText.toLowerCase())) ||
            (supplier.rating && supplier.rating.toString().includes(searchText))
        );
        setFilteredSuppliers(filtered);
    };

    const getRatingColor = (rating) => {
        switch (rating) {
            case 'A':
                return 'green';
            case 'B':
                return 'blue';
            case 'C':
                return 'yellow';
            case 'D':
                return 'orange';
            case 'E':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'supplier_id', key: 'supplier_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'RFC', dataIndex: 'RFC', key: 'RFC' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <Tag color={getRatingColor(rating)}>
                    {rating}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button
                            onClick={() => showModal(record)}
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: buttonColor }}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            onClick={() => showDeleteModal(record.supplier_id)}
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Suppliers" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Search Supplier..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Supplier
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredSuppliers}
                rowKey="supplier_id"
                loading={loading}
                scroll={{ x: 'max-content' }} // Enable horizontal scrolling for small screens
            />
            <Modal
                title={editMode ? 'Edit Supplier' : 'Add Supplier'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="RFC" label="RFC" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                        <Select>
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                            <Option value="E">E</Option>
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
                <p>Are you sure you want to delete this supplier? Please wait {countdown} seconds to confirm deletion.</p>
            </Modal>
        </div>
    );
};

export default SupplierPage;
