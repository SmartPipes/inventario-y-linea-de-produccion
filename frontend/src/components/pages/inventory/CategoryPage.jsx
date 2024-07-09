import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Form, Input, Space, Button } from 'antd';
import { API_URL_CATEGORIES } from '../Config';
import NavBarMenu from './NavBarMenu';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, categories]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_CATEGORIES);
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
            const values = form.getFieldsValue();
            if (editMode) {
                await axios.put(`${API_URL_CATEGORIES}${currentCategory.category_id}/`, values);
            } else {
                await axios.post(API_URL_CATEGORIES, values);
            }
            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`${API_URL_CATEGORIES}${categoryId}/`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase()) ||
            category.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'category_id', key: 'category_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => handleDelete(record.category_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Categorías" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar categoría..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Categoría</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="category_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Categoría' : 'Agregar Categoría'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryPage;
