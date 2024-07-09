import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Form, Input, Space, Button } from 'antd';
import { API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, suppliers]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_SUPPLIERS);
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
            const values = form.getFieldsValue();
            if (editMode) {
                await axios.put(`${API_URL_SUPPLIERS}${currentSupplier.supplier_id}/`, values);
            } else {
                await axios.post(API_URL_SUPPLIERS, values);
            }
            fetchSuppliers();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving supplier:', error);
        }
    };

    const handleDelete = async (supplierId) => {
        try {
            await axios.delete(`${API_URL_SUPPLIERS}${supplierId}/`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.RFC.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.phone.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.address.toLowerCase().includes(searchText.toLowerCase()) ||
            supplier.rating.toString().includes(searchText)
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
                    <Button onClick={() => handleDelete(record.supplier_id)} type="link" danger>Eliminar</Button>
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
                        <Input type="number" min={1} max={5} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierPage;
