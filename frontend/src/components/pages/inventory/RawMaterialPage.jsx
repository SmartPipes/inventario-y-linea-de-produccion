import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { API_URL_RAW_MATERIALS, API_URL_CATEGORIES, API_URL_RAWM, API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

const supplierCache = {};

const fetchSupplierData = async (rawMaterialId) => {
    if (supplierCache[rawMaterialId]) {
        return supplierCache[rawMaterialId];
    }

    try {
        const supplierResponse = await apiClient.get(`${API_URL_RAWM}?raw_material=${rawMaterialId}`);
        if (supplierResponse.data.length > 0) {
            const supplierData = supplierResponse.data[0];
            const supplierResponseDetail = await apiClient.get(`${API_URL_SUPPLIERS}${supplierData.supplier}/`);
            const supplierName = supplierResponseDetail.data.name;
            const result = { 
                purchase_price: supplierData.purchase_price, 
                supplier: supplierData.supplier,
                supplier_name: supplierName
            };
            supplierCache[rawMaterialId] = result;
            return result;
        } else {
            const result = {
                purchase_price: 'Sin asignar',
                supplier: 'Sin asignar',
                supplier_name: 'Sin asignar'
            };
            supplierCache[rawMaterialId] = result;
            return result;
        }
    } catch (err) {
        console.error(`Error fetching supplier data for raw material ${rawMaterialId}:`, err);
        const result = {
            purchase_price: 'Sin asignar',
            supplier: 'Sin asignar',
            supplier_name: 'Sin asignar'
        };
        supplierCache[rawMaterialId] = result;
        return result;
    }
};

const RawMaterialPage = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredRawMaterials, setFilteredRawMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentRawMaterial, setCurrentRawMaterial] = useState(null);
    const [currentSupplierData, setCurrentSupplierData] = useState({});
    const [searchText, setSearchText] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentDeleteId, setCurrentDeleteId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);

    useEffect(() => {
        fetchRawMaterials();
        fetchCategories();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, rawMaterials]);

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

    const fetchRawMaterials = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            const rawMaterialsData = response.data;

            const rawMaterialsWithSupplierData = await Promise.all(
                rawMaterialsData.map(async (rawMaterial) => {
                    const supplierData = await fetchSupplierData(rawMaterial.raw_material_id);
                    return { ...rawMaterial, ...supplierData };
                })
            );

            setRawMaterials(rawMaterialsWithSupplierData);
            setFilteredRawMaterials(rawMaterialsWithSupplierData);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(API_URL_CATEGORIES);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await apiClient.get(API_URL_SUPPLIERS);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const showModal = async (rawMaterial = null) => {
        setCurrentRawMaterial(rawMaterial);
        setEditMode(!!rawMaterial);
        if (rawMaterial) {
            const categoryResponse = await apiClient.get(`${API_URL_CATEGORIES}${rawMaterial.category}/`);
            const supplierResponse = await apiClient.get(`${API_URL_RAWM}?raw_material=${rawMaterial.raw_material_id}`);
            const supplierData = supplierResponse.data[0];
            setCurrentSupplierData(supplierData);
            form.setFieldsValue({
                ...rawMaterial,
                supplier: supplierData ? supplierData.supplier : undefined,
                purchase_price: supplierData ? supplierData.purchase_price : undefined,
                image_icon: rawMaterial.image_icon ? [{ url: rawMaterial.image_icon }] : [],
                category: categoryResponse.data.category_id.toString()
            });
        } else {
            form.resetFields();
            setCurrentSupplierData({});
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('category', values.category);
            if (values.image_icon) {
                formData.append('image_icon', values.image_icon[0].originFileObj);
            }

            let rawMaterialResponse;
            if (editMode) {
                rawMaterialResponse = await apiClient.put(`${API_URL_RAW_MATERIALS}${currentRawMaterial.raw_material_id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                message.success('Materia prima actualizada exitosamente');
            } else {
                rawMaterialResponse = await apiClient.post(API_URL_RAW_MATERIALS, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                message.success('Materia prima agregada exitosamente');
            }

            const rawMaterialId = rawMaterialResponse.data.raw_material_id;
            const supplierData = {
                raw_material: rawMaterialId,
                supplier: values.supplier,
                purchase_price: values.purchase_price
            };

            if (editMode && currentSupplierData.id) {
                await apiClient.put(`${API_URL_RAWM}${currentSupplierData.id}/`, supplierData);
            } else {
                await apiClient.post(API_URL_RAWM, supplierData);
            }

            fetchRawMaterials();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving raw material:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
            message.error('Error al guardar la materia prima');
        }
    };

    const showDeleteModal = (rawMaterialId) => {
        setCurrentDeleteId(rawMaterialId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_RAW_MATERIALS}${currentDeleteId}/`);
            fetchRawMaterials();
            message.success('Materia prima eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la materia prima:', error);
            message.error('Error al eliminar la materia prima');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = rawMaterials.filter(material =>
            (material.name && material.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (material.description && material.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredRawMaterials(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'raw_material_id', key: 'raw_material_id' },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        { title: 'Precio de Compra', dataIndex: 'purchase_price', key: 'purchase_price' },
        { title: 'Proveedor', dataIndex: 'supplier_name', key: 'supplier_name' },
        {
            title: 'Imagen',
            dataIndex: 'image_icon',
            key: 'image_icon',
            render: (text, record) => <img src={record.image_icon} alt={record.name} style={{ width: 50 }} />
        },
        {
            title: 'Categoría',
            dataIndex: 'category',
            key: 'category',
            render: (text) => categories.find(category => category.category_id === text)?.name || 'Desconocido'
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.raw_material_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="Materias Primas" />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar materia prima..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Materia Prima</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredRawMaterials}
                rowKey="raw_material_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Materia Prima' : 'Agregar Materia Prima'}
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
                    <Form.Item name="category" label="Categoría" rules={[{ required: true }]}>
                        <Select>
                            {categories.map(category => (
                                <Option key={category.category_id} value={category.category_id.toString()}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="supplier" label="Proveedor" rules={[{ required: true }]}>
                        <Select>
                            {suppliers.map(supplier => (
                                <Option key={supplier.supplier_id} value={supplier.supplier_id.toString()}>{supplier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="purchase_price" label="Precio de Compra" rules={[{ required: true }]}>
                        <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item name="image_icon" label="Imagen" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload name="image_icon" listType="picture" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Subir</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirmar eliminación"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Eliminar${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>¿Estás seguro de que quieres borrar esta materia prima? Por favor espera {countdown} segundos para confirmar la eliminación.</p>
            </Modal>
        </div>
    );
};

export default RawMaterialPage;
