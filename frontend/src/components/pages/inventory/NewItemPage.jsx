import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../../ApiClient';
import { API_URL_INV, API_URL_WAREHOUSES, API_URL_PRODUCTS, API_URL_RAW_MATERIALS } from '../Config';

const { Option } = Select;

const NewItemPage = ({ isModalVisible, setIsModalVisible, fetchInventoryItems }) => {
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [warehouses, setWarehouses] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            form.resetFields();
            setEditMode(false);
        }
    }, [isModalVisible]);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchItems = async (type) => {
        try {
            const url = type === 'Product' ? API_URL_PRODUCTS : API_URL_RAW_MATERIALS;
            const response = await apiClient.get(url);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleTypeChange = (type) => {
        form.setFieldsValue({ item_id: null });
        fetchItems(type);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('warehouse', values.warehouse);
            formData.append('item_type', values.type);
            formData.append('item_id', values.item_id);
            formData.append('stock', values.stock);

            // Check if the item already exists in the same warehouse
            const existingItem = items.find(item =>
                item.warehouse === values.warehouse &&
                (item.product_id === values.item_id || item.raw_material_id === values.item_id)
            );

            if (existingItem) {
                message.error('No se puede agregar el mismo ítem más de una vez en el mismo almacén.');
                return;
            }

            if (values.image_icon && values.image_icon.length > 0) {
                formData.append('image_icon', values.image_icon[0].originFileObj);
            }

            await apiClient.post(API_URL_INV, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            message.success('Ítem agregado exitosamente');
            fetchInventoryItems();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving item:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
                message.error(Array.isArray(error.response.data.non_field_errors) ? error.response.data.non_field_errors[0] : 'Error al guardar el ítem');
            } else {
                message.error('Error al guardar el ítem');
            }
        }
    };

    return (
        <Modal
            title={editMode ? 'Edit Ítem' : 'Add Ítem'}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="warehouse" label="Warehouse" rules={[{ required: true }]}>
                    <Select>
                        {warehouses.map(warehouse => (
                            <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id.toString()}>{warehouse.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select onChange={handleTypeChange}>
                        <Option value="Product">Product</Option>
                        <Option value="Raw-Material">Raw-Material</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="item_id" label="Item" rules={[{ required: true }]}>
                    <Select>
                        {items.map(item => (
                            <Option key={item.product_id || item.raw_material_id} value={item.product_id?.toString() || item.raw_material_id?.toString()}>{item.name}</Option>
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
