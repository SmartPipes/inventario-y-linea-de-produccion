import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message } from 'antd';
import { API_URL_WAREHOUSES, API_URL_CITIES } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchWarehouses();
        fetchCities();
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
                message.success('Almacén actualizado exitosamente');
            } else {
                await apiClient.post(API_URL_WAREHOUSES, values);
                message.success('Almacén agregado exitosamente');
            }
            fetchWarehouses();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el almacén:', error);
            message.error('Error al guardar el almacén');
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
            message.success('Almacén eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el almacén:', error);
            message.error('Error al eliminar el almacén');
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

    const columns = [
        { title: 'ID', dataIndex: 'warehouse_id', key: 'warehouse_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Dirección', dataIndex: 'address', key: 'address' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        { title: 'Estado', dataIndex: 'status', key: 'status' },
        { title: 'Ciudad', dataIndex: 'city', key: 'city', render: (text) => cities.find(city => city.city_id === text)?.city_name || 'Desconocido' },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.warehouse_id)} type="link" danger>Eliminar</Button>
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
                    <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="city" label="Ciudad" rules={[{ required: true }]}>
                        <Select>
                            {cities.map(city => (
                                <Option key={city.city_id} value={city.city_id}>{city.city_name}</Option>
                            ))}
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
                <p>¿Estás seguro de que quieres borrar este almacén? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default WarehousePage;
