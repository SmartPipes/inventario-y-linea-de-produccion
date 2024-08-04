import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_URL_CATEGORIES } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';
import styled from 'styled-components';

const buttonColor = '#97b25e';

const ResponsiveTable = styled(Table)`
  .ant-table {
    @media (max-width: 768px) {
      .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const ResponsiveModal = styled(Modal)`
  @media (max-width: 768px) {
    top: 20px;
  }
`;

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, categories]);

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

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_CATEGORIES);
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setLoading(false);
    };

    const showModal = (category = null) => {
        setCurrentCategory(category);
        setEditMode(!!category);
        if (category) {
            form.setFieldsValue(category);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editMode) {
                await apiClient.put(`${API_URL_CATEGORIES}${currentCategory.category_id}/`, values);
                message.success('Category updated successfully');
            } else {
                await apiClient.post(API_URL_CATEGORIES, values);
                message.success('Category added successfully');
            }
            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving category:', error);
            if (error.response) {
                message.error(`Error saving category: ${error.response.data.detail || 'Unknown error'}`);
            } else {
                message.error('Error saving category');
            }
        }
    };

    const showDeleteModal = (categoryId) => {
        setCurrentCategoryId(categoryId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_CATEGORIES}${currentCategoryId}/`);
            fetchCategories();
            message.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Error deleting category');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = categories.filter(category =>
            (category.name && category.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (category.description && category.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredCategories(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'category_id', key: 'category_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
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
                            onClick={() => showDeleteModal(record.category_id)}
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
            <NavBarMenu title="Categories" />
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search category..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '300px' }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Category
                </Button>
            </div>
            <ResponsiveTable
                columns={columns}
                dataSource={filteredCategories}
                rowKey="category_id"
                loading={loading}
                scroll={{ x: '100%' }}
            />
            <ResponsiveModal
                title={editMode ? 'Edit Category' : 'Add Category'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </ResponsiveModal>
            <ResponsiveModal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Delete${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this category? Please wait {countdown} seconds to confirm deletion.</p>
            </ResponsiveModal>
        </div>
    );
};

export default CategoryPage;
