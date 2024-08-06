import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message, Upload, Tag, Row, Col, Tooltip } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined, CloseOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { API_URL_PRODUCTS, API_URL_RAWMLIST, API_URL_RAW_MATERIALS, API_URL_BULK_RAWMLIST } from '../Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';
import styled from 'styled-components';

const { Option } = Select;
const { confirm } = Modal;

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
`;

const ImagePreviewModal = styled(Modal)`
  .ant-modal-content {
    z-index: 1050;
  }
`;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [rawMaterialList, setRawMaterialList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMaterialModalVisible, setIsMaterialModalVisible] = useState(false);
    const [isDeclareMaterialVisible, setIsDeclareMaterialVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [materialForm] = Form.useForm();
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);
    const [newMaterials, setNewMaterials] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProducts();
        fetchRawMaterials();
        fetchRawMaterialList();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, products]);

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

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_PRODUCTS);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const fetchRawMaterials = async () => {
        try {
            const response = await apiClient.get(API_URL_RAW_MATERIALS);
            setRawMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const fetchRawMaterialList = async () => {
        try {
            const response = await apiClient.get(API_URL_RAWMLIST);
            setRawMaterialList(response.data);
        } catch (error) {
            console.error('Error fetching raw material list:', error);
        }
    };

    const showModal = (product = null) => {
        setCurrentProduct(product);
        setEditMode(!!product);
        setRemoveImage(false);
        if (product) {
            form.setFieldsValue(product);
            setFileList(product.image_icon ? [{ url: product.image_icon, name: product.image_icon, thumbUrl: product.image_icon }] : []);
        } else {
            form.resetFields();
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const showMaterialModal = (product) => {
        setCurrentProduct(product);
        setIsMaterialModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('status', values.status);

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
                await apiClient.put(`${API_URL_PRODUCTS}${currentProduct.product_id}/`, formData, config);
                message.success('Product updated successfully');
            } else {
                await apiClient.post(API_URL_PRODUCTS, formData, config);
                message.success('Product added successfully');
            }
            fetchProducts();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving the product:', error);
            message.error('Error saving the product');
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_PRODUCTS}${currentProductId}/`);
            fetchProducts();
            message.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting the product:', error);
            message.error('Error deleting the product');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = products.filter(product =>
            (product.name && product.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredProducts(filtered);
    };

    const handleFileChange = ({ fileList }) => {
        if (fileList.length > 0) {
            setFileList([fileList[fileList.length - 1]]);
        } else {
            setFileList([]);
            setRemoveImage(true);
        }
    };

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewVisible(true);
    };

    const handleAddMaterial = () => {
        materialForm.validateFields().then(values => {
            setNewMaterials([...newMaterials, { ...values, product: currentProduct.product_id }]);
            materialForm.resetFields();
        });
    };

    const handleSaveMaterials = async () => {
        try {
            const dataToSend = newMaterials.map(material => ({
                raw_material: material.raw_material,
                quantity: material.quantity,
                product: currentProduct.product_id
            }));

            await apiClient.post(API_URL_BULK_RAWMLIST, dataToSend);
            message.success('Materials added successfully');
            setIsDeclareMaterialVisible(false);
            fetchRawMaterialList();
            setNewMaterials([]);
        } catch (error) {
            console.error('Error saving the materials:', error);
            message.error('Error saving the materials');
        }
    };

    const handleClearMaterials = () => {
        confirm({
            title: 'Are you sure you want to delete all materials?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await apiClient.delete(API_URL_BULK_RAWMLIST, {
                        params: { product_id: currentProduct.product_id }
                    });
                    message.success('All materials have been deleted');
                    fetchRawMaterialList();
                } catch (error) {
                    console.error('Error deleting the materials:', error);
                    message.error('Error deleting the materials');
                }
            }
        });
    };

    const handleRemoveMaterial = (raw_material_id) => {
        setNewMaterials(newMaterials.filter(material => material.raw_material !== raw_material_id));
    };

    const handleCancelDeclareMaterials = () => {
        setNewMaterials([]);
        setIsDeclareMaterialVisible(false);
    };

    const getAvailableRawMaterials = () => {
        const selectedMaterialIds = new Set(newMaterials.map(material => material.raw_material));
        return rawMaterials.filter(material => !selectedMaterialIds.has(material.raw_material_id));
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'}>{status}</Tag>
            )
        },
        {
            title: 'Image',
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button
                            onClick={() => showModal(record)}
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: buttonColor }}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            onClick={() => showDeleteModal(record.product_id)}
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                        />
                    </Tooltip>
                    <Tooltip title="List Materials">
                        <Button
                            onClick={() => showMaterialModal(record)}
                            type="link"
                            icon={<UnorderedListOutlined />}
                            style={{ color: buttonColor }}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const showDeleteModal = (productId) => {
        setCurrentProductId(productId);
        setIsDeleteModalVisible(true);
    };

    const getProductMaterials = (productId) => {
        return rawMaterialList
            .filter(item => item.product === productId)
            .map(item => ({
                ...item,
                raw_material: rawMaterials.find(material => material.raw_material_id === item.raw_material)
            }));
    };

    return (
        <div>
            <NavBarMenu title="Products" />
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search product..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '300px' }}
                />
                <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Product
                </Button>
            </div>
            <ResponsiveTable
                columns={columns}
                dataSource={filteredProducts}
                rowKey="product_id"
                loading={loading}
                pagination={{
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
                scroll={{ x: '100%' }}
            />
            <ResponsiveModal
                title={editMode ? 'Edit Product' : 'Add Product'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
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
            <ImagePreviewModal
                title="Image Preview"
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
            </ImagePreviewModal>
            <ResponsiveModal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={`Delete${countdown > 0 ? ` (${countdown})` : ''}`}
                okButtonProps={{ disabled: !deleteEnabled, style: { backgroundColor: deleteEnabled ? 'red' : 'white', color: deleteEnabled ? 'white' : 'black' } }}
            >
                <p>Are you sure you want to delete this product? Please wait {countdown} seconds to confirm deletion.</p>
            </ResponsiveModal>
            <ResponsiveModal
                title="Material List"
                visible={isMaterialModalVisible}
                onCancel={() => setIsMaterialModalVisible(false)}
                footer={null}
            >
                {currentProduct && (
                    <div>
                        <Row gutter={16}>
                            <Col span={6}>
                                <img
                                    src={currentProduct.image_icon || 'https://via.placeholder.com/150'}
                                    alt={currentProduct.name}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                    onClick={() => handlePreview({ url: currentProduct.image_icon || 'https://via.placeholder.com/150' })}
                                />
                            </Col>
                            <Col span={18}>
                                <h3>{currentProduct.name}</h3>
                                <p>{currentProduct.description}</p>
                                <Tag color={currentProduct.status === 'Active' ? 'green' : 'volcano'}>{currentProduct.status}</Tag>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                            <h4>Required Materials:</h4>
                            {getProductMaterials(currentProduct.product_id).length > 0 && (
                                <Button
                                    type="danger"
                                    onClick={handleClearMaterials}
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                >
                                    Clear All Materials
                                </Button>
                            )}
                        </div>
                        {getProductMaterials(currentProduct.product_id).length > 0 ? (
                            <ResponsiveTable
                                dataSource={getProductMaterials(currentProduct.product_id)}
                                columns={[
                                    {
                                        title: 'Image',
                                        dataIndex: ['raw_material', 'image_icon'],
                                        key: 'raw_material_image',
                                        render: (image) => (
                                            <img
                                                src={image || 'https://via.placeholder.com/20'}
                                                alt="Material"
                                                style={{ width: 20, cursor: 'pointer' }}
                                                onClick={() => handlePreview({ url: image || 'https://via.placeholder.com/150' })}
                                            />
                                        )
                                    },
                                    {
                                        title: 'Material',
                                        dataIndex: ['raw_material', 'name'],
                                        key: 'raw_material',
                                        width: '60%',
                                    },
                                    {
                                        title: 'Quantity',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                        width: '30%',
                                    },
                                ]}
                                pagination={false}
                                size="small"
                                rowKey="id"
                            />
                        ) : (
                            <div>
                                <p>No materials declared for this product.</p>
                                <Button
                                    type="primary"
                                    onClick={() => setIsDeclareMaterialVisible(true)}
                                    style={{ backgroundColor: buttonColor, borderColor: buttonColor }}
                                >
                                    Declare Materials
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </ResponsiveModal>
            <ResponsiveModal
                title="Declare Materials"
                visible={isDeclareMaterialVisible}
                onCancel={handleCancelDeclareMaterials}
                onOk={handleSaveMaterials}
                okText="Save Materials"
                okButtonProps={{ style: { backgroundColor: buttonColor, borderColor: buttonColor } }}
            >
                <div>
                    <h3>{currentProduct?.name}</h3>
                    <img
                        src={currentProduct?.image_icon || 'https://via.placeholder.com/150'}
                        alt={currentProduct?.name}
                        style={{ width: 50, cursor: 'pointer' }}
                        onClick={() => handlePreview({ url: currentProduct?.image_icon || 'https://via.placeholder.com/150' })}
                    />
                </div>
                <Form form={materialForm} layout="vertical">
                    <Form.Item
                        name="raw_material"
                        label="Material"
                        rules={[{ required: true, message: 'Please select a material' }]}
                    >
                        <Select placeholder="Select material">
                            {getAvailableRawMaterials().map(material => (
                                <Option key={material.raw_material_id} value={material.raw_material_id}>
                                    <img
                                        src={material.image_icon}
                                        alt={material.name}
                                        style={{ width: 20, marginRight: 8 }}
                                    />
                                    {material.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter the quantity' }]}
                    >
                        <Input type="number" min={1} style={{ width: 100 }} />
                    </Form.Item>
                    <Button
                        type="dashed"
                        onClick={handleAddMaterial}
                        style={{ width: '100%', marginBottom: 16, backgroundColor: buttonColor, borderColor: buttonColor }}
                    >
                        Add
                    </Button>
                </Form>
                <ResponsiveTable
                    dataSource={newMaterials}
                    columns={[
                        {
                            title: 'Material',
                            dataIndex: 'raw_material',
                            key: 'raw_material',
                            render: (value) => {
                                const material = rawMaterials.find(m => m.raw_material_id === value);
                                return (
                                    <>
                                        <img
                                            src={material?.image_icon}
                                            alt={material?.name}
                                            style={{ width: 20, marginRight: 8 }}
                                            onClick={() => handlePreview({ url: material?.image_icon || 'https://via.placeholder.com/150' })}
                                        />
                                        {material?.name}
                                    </>
                                );
                            },
                            width: '60%',
                        },
                        {
                            title: 'Quantity',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            width: '30%',
                        },
                        {
                            title: 'Action',
                            key: 'action',
                            render: (_, record) => (
                                <Tooltip title="Remove">
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={() => handleRemoveMaterial(record.raw_material)}
                                        type="link"
                                        danger
                                    />
                                </Tooltip>
                            ),
                            width: '10%',
                        },
                    ]}
                    pagination={false}
                    size="small"
                    rowKey="raw_material"
                />
            </ResponsiveModal>
        </div>
    );
};

export default ProductPage;
