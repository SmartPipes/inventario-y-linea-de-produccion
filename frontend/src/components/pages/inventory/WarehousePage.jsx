import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Form, Input, Space, Button } from 'antd';
import { API_URL_WAREHOUSES } from '../Config';
import NavBarMenu from './NavBarMenu';

const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, warehouses]);

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
            setFilteredWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
        setLoading(false);
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
            const values = form.getFieldsValue();
            if (editMode) {
                await axios.put(`${API_URL_WAREHOUSES}${currentWarehouse.warehouse_id}/`, values);
            } else {
                await axios.post(API_URL_WAREHOUSES, values);
            }
            fetchWarehouses();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving warehouse:', error);
        }
    };

    const handleDelete = async (warehouseId) => {
        try {
            await axios.delete(`${API_URL_WAREHOUSES}${warehouseId}/`);
            fetchWarehouses();
        } catch (error) {
            console.error('Error deleting warehouse:', error);
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

    const columns = [
        { title: 'ID', dataIndex: 'warehouse_id', key: 'warehouse_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Dirección', dataIndex: 'address', key: 'address' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => handleDelete(record.warehouse_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Almacenes" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar almacén..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Almacén</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredWarehouses}
                rowKey="warehouse_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Almacén' : 'Agregar Almacén'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Dirección" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WarehousePage;
