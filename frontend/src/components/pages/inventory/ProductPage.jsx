import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { API_URL_PRODUCTS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [fileList, setFileList] = useState([]);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, products]);

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

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_PRODUCTS);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const showModal = (product = null) => {
        setCurrentProduct(product);
        setEditMode(!!product);
        if (product) {
            form.setFieldsValue(product);
            setFileList([{ url: product.image_icon }]);
        } else {
            form.resetFields();
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('status', values.status);
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('image_icon', fileList[0].originFileObj);
            }

            if (editMode) {
                await apiClient.put(`${API_URL_PRODUCTS}${currentProduct.product_id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                message.success('Producto actualizado exitosamente');
            } else {
                await apiClient.post(API_URL_PRODUCTS, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                message.success('Producto agregado exitosamente');
            }
            fetchProducts();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            message.error('Error al guardar el producto');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await apiClient.delete(`${API_URL_PRODUCTS}${productId}/`);
            fetchProducts();
            message.success('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            message.error('Error al eliminar el producto');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = products.filter(product =>
            (product.name && product.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredProducts(filtered);
    };

    const handleFileChange = ({ fileList }) => setFileList(fileList);

    const columns = [
        { title: 'ID', dataIndex: 'product_id', key: 'product_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        { title: 'Precio', dataIndex: 'price', key: 'price' },
        { title: 'Estado', dataIndex: 'status', key: 'status' },
        {
            title: 'Imagen',
            dataIndex: 'image_icon',
            key: 'image_icon',
            render: (text, record) => <img src={record.image_icon} alt={record.name} style={{ width: 50 }} />
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.product_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (productId) => {
        setCurrentProductId(productId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <NavBarMenu title="Productos" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Producto</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="product_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Producto' : 'Agregar Producto'}
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
                    <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Imagen">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirmar Eliminación"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>¿Estás seguro de que quieres borrar este producto? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default ProductPage;
