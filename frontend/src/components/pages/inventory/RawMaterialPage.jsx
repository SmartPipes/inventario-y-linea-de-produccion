import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message, Upload, Select } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { API_URL_RAW_MATERIALS, API_URL_CATEGORIES, API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

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
    const [searchText, setSearchText] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentDeleteId, setCurrentDeleteId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);

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
                    const supplierResponse = rawMaterial.supplier ? await apiClient.get(`${API_URL_SUPPLIERS}${rawMaterial.supplier}/`) : { data: { name: 'Sin asignar' } };
                    return { ...rawMaterial, supplier_name: supplierResponse.data.name || 'Sin asignar', purchase_price: rawMaterial.purchase_price || 'Sin asignar' };
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

    const handleFileChange = ({ fileList }) => {
        if (fileList.length > 0) {
            setFileList([fileList[fileList.length - 1]]);
            setRemoveImage(false);
        } else {
            setFileList([]);
            setRemoveImage(true);
        }
    };

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    const showModal = (rawMaterial = null) => {
        setCurrentRawMaterial(rawMaterial);
        setEditMode(!!rawMaterial);
        setRemoveImage(false);
        if (rawMaterial) {
            form.setFieldsValue({
                ...rawMaterial,
                supplier: rawMaterial.supplier_name,
                category: rawMaterial.category.toString(),
            });
            setFileList(rawMaterial.image_icon ? [{ url: rawMaterial.image_icon, name: rawMaterial.image_icon, thumbUrl: rawMaterial.image_icon }] : []);
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
            formData.append('category', values.category);
            formData.append('supplier', suppliers.find(supplier => supplier.name === values.supplier).supplier_id);
            formData.append('purchase_price', values.purchase_price);

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('image_icon', fileList[0].originFileObj);
            } else if (removeImage) {
                formData.append('image_icon', '');
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editMode) {
                await apiClient.put(`${API_URL_RAW_MATERIALS}${currentRawMaterial.raw_material_id}/`, formData, config);
                message.success('Materia prima actualizada exitosamente');
            } else {
                await apiClient.post(API_URL_RAW_MATERIALS, formData, config);
                message.success('Materia prima agregada exitosamente');
            }
            fetchRawMaterials();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar la materia prima:', error);
            message.error('Error al guardar la materia prima');
        }
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
            render: (text, record) => (
                <Space size="middle">
                    <img
                        src={record.image_icon || 'https://via.placeholder.com/50'}
                        alt={record.name}
                        style={{ width: 50, cursor: 'pointer' }}
                        onClick={() => handlePreview({ url: record.image_icon || 'https://via.placeholder.com/150' })}
                    />
                </Space>
            )
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

    const showDeleteModal = (rawMaterialId) => {
        setCurrentDeleteId(rawMaterialId);
        setIsDeleteModalVisible(true);
    };

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
                                <Option key={supplier.supplier_id} value={supplier.name}>{supplier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="purchase_price" label="Precio de Compra" rules={[{ required: true }]}>
                        <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item label="Imagen">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            accept="image/*"
                            onPreview={handlePreview}
                        >
                            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Vista previa de la imagen"
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Vista previa" style={{ width: '100%' }} src={previewImage} />
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
