import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message, Upload, Select, Tooltip } from 'antd';
import { UploadOutlined, EyeOutlined, ShoppingCartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { API_URL_RAW_MATERIALS, API_URL_CATEGORIES, API_URL_SUPPLIERS } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Option } = Select;

const buttonColor = '#97b25e';

const ResponsiveTable = styled(Table)`
  .ant-table {
    @media (max-width: 768px) {
      .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const ResponsiveModal = styled(Modal)`
  @media (max-width: 768px) {
    top: 20px;
  }
  .ant-modal-content {
    z-index: 1050; /* Ensure the modal content is above other elements */
  }
`;

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
    const navigate = useNavigate();

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
                    const supplierResponse = rawMaterial.supplier ? await apiClient.get(`${API_URL_SUPPLIERS}${rawMaterial.supplier}/`) : { data: { name: 'Unassigned' } };
                    return { ...rawMaterial, supplier_name: supplierResponse.data.name || 'Unassigned', purchase_price: rawMaterial.purchase_price || 'Unassigned' };
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
                message.success('Raw material updated successfully');
            } else {
                await apiClient.post(API_URL_RAW_MATERIALS, formData, config);
                message.success('Raw material added successfully');
            }
            fetchRawMaterials();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving raw material:', error);
            message.error('Error saving raw material');
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_RAW_MATERIALS}${currentDeleteId}/`);
            fetchRawMaterials();
            message.success('Raw material deleted successfully');
        } catch (error) {
            console.error('Error deleting raw material:', error);
            message.error('Error deleting raw material');
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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Purchase Price', dataIndex: 'purchase_price', key: 'purchase_price' },
        { title: 'Supplier', dataIndex: 'supplier_name', key: 'supplier_name' },
        {
            title: 'Image',
            dataIndex: 'image_icon',
            key: 'image_icon',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Preview">
                        <img
                            src={record.image_icon || 'https://via.placeholder.com/50'}
                            alt={record.name}
                            style={{ width: 50, cursor: 'pointer' }}
                            onClick={() => handlePreview({ url: record.image_icon || 'https://via.placeholder.com/150' })}
                        />
                    </Tooltip>
                </Space>
            )
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text) => categories.find(category => category.category_id === text)?.name || 'Unknown'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button onClick={() => showModal(record)} type="link" icon={<EditOutlined />} style={{ color: buttonColor }} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button onClick={() => showDeleteModal(record.raw_material_id)} type="link" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                    <Tooltip title="Restock">
                        <Button
                            onClick={() => navigate(`/inventory/request-restock?raw_material_id=${record.raw_material_id}`)}
                            type="link"
                            icon={<ShoppingCartOutlined />}
                            style={{ color: buttonColor }}
                        />
                    </Tooltip>
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
            <NavBarMenu title="Raw Materials" />
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search raw material..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '300px' }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Raw Material
                </Button>
            </div>
            <ResponsiveTable
                columns={columns}
                dataSource={filteredRawMaterials}
                rowKey="raw_material_id"
                loading={loading}
                scroll={{ x: '100%' }}
            />
            <ResponsiveModal
                title={editMode ? 'Edit Raw Material' : 'Add Raw Material'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select>
                            {categories.map(category => (
                                <Option key={category.category_id} value={category.category_id.toString()}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="supplier" label="Supplier" rules={[{ required: true }]}>
                        <Select>
                            {suppliers.map(supplier => (
                                <Option key={supplier.supplier_id} value={supplier.name}>{supplier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="purchase_price" label="Purchase Price" rules={[{ required: true }]}>
                        <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item label="Image">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            accept="image/*"
                            onPreview={handlePreview}
                        >
                            <Button icon={<UploadOutlined />} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </ResponsiveModal>
            <ResponsiveModal
                title="Image Preview"
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
            </ResponsiveModal>
            <ResponsiveModal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Delete${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this raw material? Please wait {countdown} seconds to confirm deletion.</p>
            </ResponsiveModal>
        </div>
    );
};

export default RawMaterialPage;
