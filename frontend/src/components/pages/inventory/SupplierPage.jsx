import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message } from 'antd';
import { API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

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
            if (editMode) {
                await apiClient.put(`${API_URL_SUPPLIERS}${currentSupplier.supplier_id}/`, values);
                message.success('Proveedor actualizado exitosamente');
            } else {
                await apiClient.post(API_URL_SUPPLIERS, values);
                message.success('Proveedor agregado exitosamente');
            }
            fetchSuppliers();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
            message.error('Error al guardar el proveedor');
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
            message.success('Proveedor eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            message.error('Error al eliminar el proveedor');
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

    const columns = [
        { title: 'ID', dataIndex: 'supplier_id', key: 'supplier_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'RFC', dataIndex: 'RFC', key: 'RFC' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        { title: 'Dirección', dataIndex: 'address', key: 'address' },
        { title: 'Calificación', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.supplier_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Proveedores" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar proveedor..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Proveedor</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredSuppliers}
                rowKey="supplier_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Proveedor' : 'Agregar Proveedor'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="RFC" label="RFC" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Dirección" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="rating" label="Calificación" rules={[{ required: true }]}>
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
                title="Confirmar Eliminación"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white',  color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>¿Estás seguro de que quieres borrar este proveedor? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default SupplierPage;
