import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message } from 'antd';
import { API_URL_CATEGORIES } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

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
            console.log('Form Values:', values); // Log the form values for debugging
            if (editMode) {
                const response = await apiClient.put(`${API_URL_CATEGORIES}${currentCategory.category_id}/`, values);
                console.log('Edit Response:', response); // Log the response for debugging
                message.success('Categoría actualizada exitosamente');
            } else {
                const response = await apiClient.post(API_URL_CATEGORIES, values);
                console.log('Create Response:', response); // Log the response for debugging
                message.success('Categoría agregada exitosamente');
            }
            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            if (error.response) {
                console.error('Server Response:', error.response.data); // Log the server response
                message.error(`Error al guardar la categoría: ${error.response.data.detail || 'Error desconocido'}`);
            } else {
                message.error('Error al guardar la categoría');
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
            message.success('Categoría eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            message.error('Error al eliminar la categoría');
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
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.category_id)} type="link" danger>Eliminar</Button>
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
            <Modal
                title="Confirmar Eliminación"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white',  color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>¿Estás seguro de que quieres borrar esta categoría? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default CategoryPage;
