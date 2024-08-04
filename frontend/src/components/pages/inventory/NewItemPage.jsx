import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV, API_URL_WAREHOUSES, API_URL_PRODUCTS, API_URL_RAW_MATERIALS } from '../Config';

const { Option } = Select;

const NewItemPage = ({ isModalVisible, setIsModalVisible, fetchInventoryItems }) => {
    const [form] = Form.useForm();
    const [warehouses, setWarehouses] = useState([]);
    const [items, setItems] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);

    useEffect(() => {
        fetchWarehouses();
        fetchInventory();
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            form.resetFields();
            setFilteredWarehouses([]);
        }
    }, [isModalVisible]);

    const fetchWarehouses = async () => {
        const response = await apiClient.get(API_URL_WAREHOUSES);
        setWarehouses(response.data || []);
    };

    const fetchInventory = async () => {
        const response = await apiClient.get(API_URL_INV);
        setInventory(response.data || []);
    };

    const fetchItems = async (type) => {
        const url = type === 'Product' ? API_URL_PRODUCTS : API_URL_RAW_MATERIALS;
        const response = await apiClient.get(url);
        setItems(response.data || []);
    };

    const handleTypeChange = (type) => {
        form.setFieldsValue({ item_id: null, warehouse: null });
        fetchItems(type);
    };

    const handleItemChange = (itemId) => {
        const selectedType = form.getFieldValue('type');
        // Asegurando que todos los IDs se manejen como strings para una comparación consistente
        const existingWarehouseIds = inventory
            .filter(inv => inv.item_id.toString() === itemId.toString() && inv.item_type === selectedType)
            .map(inv => inv.warehouse.toString());
    
        const filtered = warehouses.filter(warehouse => 
            !existingWarehouseIds.includes(warehouse.warehouse_id.toString())
        );
        setFilteredWarehouses(filtered);
    };
    

    const handleOk = async () => {
        const values = await form.validateFields();
        const formData = new FormData();
        formData.append('warehouse', values.warehouse);
        formData.append('item_type', values.type);
        formData.append('item_id', values.item_id);
        formData.append('stock', values.stock);

        await apiClient.post(API_URL_INV, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        message.success('Ítem agregado exitosamente');
        fetchInventoryItems();
        setIsModalVisible(false);
    };

    return (
        <Modal
            title='Add Ítem'
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select onChange={handleTypeChange}>
                        <Option value="Product">Product</Option>
                        <Option value="RawMaterial">Raw Material</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="item_id" label="Item" rules={[{ required: true }]}>
                    <Select onChange={handleItemChange}>
                        {items.map(item => (
                            <Option key={item.product_id || item.raw_material_id} value={item.product_id?.toString() || item.raw_material_id?.toString()}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="warehouse" label="Warehouse" rules={[{ required: true }]}>
                    <Select>
                        {filteredWarehouses.map(warehouse => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id.toString()}>{warehouse.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewItemPage;
