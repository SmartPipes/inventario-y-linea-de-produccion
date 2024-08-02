import React, { useState, useEffect } from 'react';
import { Select, Input, Button, DatePicker, Form, message, Row, Col } from 'antd';
import { TruckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { apiClient } from '../../../ApiClient';
import { useLocation } from 'react-router-dom';
import { API_URL_RAW_MATERIALS, API_URL_SUPPLIERS, API_URL_RESTOCKREQUEST, API_URL_WAREHOUSES, API_URL_INVENTORYSUM, API_URL_INV } from '../Config';

const { Option } = Select;

const RestockRequestPage = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [totalStock, setTotalStock] = useState(null);
    const [currentStock, setCurrentStock] = useState(null);
    const [supplierDetails, setSupplierDetails] = useState({ name: '', email: '' });
    const [form] = Form.useForm();
    const location = useLocation();

    useEffect(() => {
        fetchRawMaterials();
        fetchWarehouses();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const rawMaterialId = query.get('raw_material_id');
        if (rawMaterialId) {
            handleRawMaterialChange(parseInt(rawMaterialId, 10));
        }
    }, [location.search, rawMaterials]);

    const fetchRawMaterials = async () => {
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await apiClient.get(API_URL_WAREHOUSES);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const handleRawMaterialChange = async (value) => {
        const rawMaterial = rawMaterials.find(item => item.raw_material_id === value);
        setSelectedRawMaterial(rawMaterial);
        form.setFieldsValue({
            raw_material: value,
            supplier: rawMaterial.supplier_name,
            email: rawMaterial.supplier_email,
        });

        try {
            const response = await apiClient.get(API_URL_INVENTORYSUM);
            const stockData = response.data.find(item => item.item_id === value && item.item_type === 'RawMaterial');
            if (stockData) {
                setTotalStock(stockData.total_stock);
            }
        } catch (error) {
            console.error('Error fetching total stock:', error);
        }

        try {
            const supplierResponse = await apiClient.get(`${API_URL_SUPPLIERS}${rawMaterial.supplier}/`);
            setSupplierDetails({
                name: supplierResponse.data.name,
                email: supplierResponse.data.email,
            });
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        }
    };

    const handleWarehouseChange = async (value) => {
        setSelectedWarehouse(value);
        try {
            const response = await apiClient.get(API_URL_INV);
            const warehouseStockData = response.data.find(item => item.item_id === selectedRawMaterial.raw_material_id && item.item_type === 'RawMaterial' && item.warehouse === value);
            if (warehouseStockData) {
                setCurrentStock(warehouseStockData.stock);
            } else {
                setCurrentStock(0); // Si no hay stock, se establece a 0
            }
        } catch (error) {
            console.error('Error fetching current stock:', error);
        }
    };

    const disabledDate = (current) => {
        return current && current < moment().add(7, 'days');
    };

    const handleFinish = async (values) => {
        try {
            const { quantity, request_date } = values;
            const requestData = {
                quantity,
                requested_at: request_date.format('YYYY-MM-DD HH:mm:ss'),
                status: 'Pending',
                raw_material: selectedRawMaterial.raw_material_id,
                requested_by: 1,  // Change to the logged-in user ID
                warehouse: selectedWarehouse  // Change to the appropriate warehouse ID
            };
            const response = await apiClient.post(API_URL_RESTOCKREQUEST, requestData);
            if (response.status === 201) {
                const inventoryData = response.data;
                form.setFieldsValue({ inventory_id: inventoryData.inventory_id });
                message.success('Restock request created successfully');
            } else {
                message.error('Failed to create restock request');
            }
        } catch (error) {
            console.error('Error creating restock request:', error);
            message.error('Error creating restock request');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Restock Request</h2>
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="raw_material" label="Product" rules={[{ required: true, message: 'Please select a product' }]}>
                            <Select
                                showSearch
                                placeholder="Select..."
                                optionFilterProp="children"
                                onChange={handleRawMaterialChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {rawMaterials.map(item => (
                                    <Option key={item.raw_material_id} value={item.raw_material_id}>
                                        <img src={item.image_icon} alt={item.name} style={{ width: '30px', marginRight: '10px' }} />
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Total Stock">
                            <Input value={totalStock} readOnly />
                        </Form.Item>
                        <Form.Item name="warehouse" label="Warehouse" rules={[{ required: true, message: 'Please select a warehouse' }]}>
                            <Select
                                showSearch
                                placeholder="Select a warehouse"
                                onChange={handleWarehouseChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {warehouses.map(warehouse => (
                                    <Option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                        {warehouse.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Current Stock">
                            <Input value={currentStock} readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Supplier">
                            <Input value={supplierDetails.name} readOnly />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={supplierDetails.email} readOnly />
                        </Form.Item>
                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                            <Input type="number" min="1" />
                        </Form.Item>
                        <Form.Item name="request_date" label="Request Date" rules={[{ required: true, message: 'Please select a date' }]}>
                            <DatePicker disabledDate={disabledDate} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<TruckOutlined />}>Order</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RestockRequestPage;
