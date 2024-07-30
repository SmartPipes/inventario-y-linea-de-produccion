import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, message, Space } from 'antd'; // Importa Space aquí
import axios from 'axios';
import { API_URL_DELIVERY_CART_DETAILS } from '../../pages/Config';
import NavBarMenu from './NavBarMenu';

const CartDetailsPage = () => {
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentDetail, setCurrentDetail] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCartDetails, setFilteredCartDetails] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentDetailId, setCurrentDetailId] = useState(null);

    useEffect(() => {
        fetchCartDetails();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, cartDetails]);

    const fetchCartDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_DELIVERY_CART_DETAILS);
            setCartDetails(response.data);
            setFilteredCartDetails(response.data);
        } catch (error) {
            console.error('Error fetching cart details:', error);
        }
        setLoading(false);
    };

    const showModal = (detail = null) => {
        setCurrentDetail(detail);
        setEditMode(!!detail);
        if (detail) {
            form.setFieldsValue({
                ...detail
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editMode) {
                await axios.put(`${API_URL_DELIVERY_CART_DETAILS}${currentDetail.id}/`, values);
                message.success('Detalle del carrito actualizado exitosamente');
            } else {
                await axios.post(API_URL_DELIVERY_CART_DETAILS, values);
                message.success('Detalle del carrito agregado exitosamente');
            }
            fetchCartDetails();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el detalle del carrito:', error);
            message.error('Error al guardar el detalle del carrito');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL_DELIVERY_CART_DETAILS}${currentDetailId}/`);
            fetchCartDetails();
            message.success('Detalle del carrito eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el detalle del carrito:', error);
            message.error('Error al eliminar el detalle del carrito');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = cartDetails.filter(detail =>
            (detail.cart && detail.cart.toString().toLowerCase().includes(searchText.toLowerCase())) ||
            (detail.product && detail.product.toString().toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredCartDetails(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Carrito', dataIndex: 'cart', key: 'cart' },
        { title: 'Producto', dataIndex: 'product', key: 'product' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (detailId) => {
        setCurrentDetailId(detailId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <NavBarMenu />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar detalle..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Detalle</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredCartDetails}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Detalle del Carrito' : 'Agregar Detalle del Carrito'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editMode ? 'Actualizar' : 'Agregar'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="cartDetailForm"
                >
                    <Form.Item name="quantity" label="Cantidad" rules={[{ required: true, message: 'Por favor, ingresa una cantidad' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="cart" label="Carrito" rules={[{ required: true, message: 'Por favor, ingresa un carrito' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="product" label="Producto" rules={[{ required: true, message: 'Por favor, ingresa un producto' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Eliminar Detalle del Carrito"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas eliminar este detalle del carrito?</p>
            </Modal>
        </div>
    );
};

export default CartDetailsPage;
