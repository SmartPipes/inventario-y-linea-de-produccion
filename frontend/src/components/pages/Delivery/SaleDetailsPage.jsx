import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Select, Space, Button, message } from 'antd';
import axios from 'axios';
import { 
  API_URL_DELIVERY_SALE_DETAILS, 
  API_URL_DELIVERY_SALES, 
  API_URL_PRODUCTS 
} from '../../pages/Config'; // Ajusta la ruta de importación según sea necesario
import NavBarMenu from './NavBarMenu'; // Asegúrate de que la ruta de importación es correcta

const { Option } = Select;

const SaleDetailsPage = () => {
    const [saleDetails, setSaleDetails] = useState([]);
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentSaleDetail, setCurrentSaleDetail] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredSaleDetails, setFilteredSaleDetails] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentSaleDetailId, setCurrentSaleDetailId] = useState(null);

    useEffect(() => {
        fetchSaleDetails();
        fetchSales();
        fetchProducts();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, saleDetails]);

    const fetchSaleDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_DELIVERY_SALE_DETAILS);
            setSaleDetails(response.data);
            setFilteredSaleDetails(response.data);
        } catch (error) {
            console.error('Error fetching sale details:', error);
        }
        setLoading(false);
    };

    const fetchSales = async () => {
        try {
            const response = await axios.get(API_URL_DELIVERY_SALES);
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const showModal = (saleDetail = null) => {
        setCurrentSaleDetail(saleDetail);
        setEditMode(!!saleDetail);
        if (saleDetail) {
            form.setFieldsValue({
                ...saleDetail,
                sale: saleDetail.sale,
                product: saleDetail.product
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                sale: Number(values.sale),
                product: Number(values.product)
            };

            if (editMode) {
                await axios.put(`${API_URL_DELIVERY_SALE_DETAILS}${currentSaleDetail.sale_detail_id}/`, formattedValues);
                message.success('Detalle de venta actualizado exitosamente');
            } else {
                await axios.post(API_URL_DELIVERY_SALE_DETAILS, formattedValues);
                message.success('Detalle de venta agregado exitosamente');
            }
            fetchSaleDetails();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el detalle de venta:', error);
            message.error('Error al guardar el detalle de venta');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL_DELIVERY_SALE_DETAILS}${currentSaleDetailId}/`);
            fetchSaleDetails();
            message.success('Detalle de venta eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el detalle de venta:', error);
            message.error('Error al eliminar el detalle de venta');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = saleDetails.filter(detail =>
            (detail.sale && sales.find(sale => sale.sale_id === detail.sale)?.total.toLowerCase().includes(searchText.toLowerCase())) ||
            (detail.product && products.find(product => product.product_id === detail.product)?.name.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredSaleDetails(filtered);
    };

    const columns = [
        { title: 'Sale Detail ID', dataIndex: 'sale_detail_id', key: 'sale_detail_id' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Sale',
            dataIndex: 'sale',
            key: 'sale',
            render: (saleId) => sales.find(s => s.sale_id === saleId)?.total || 'N/A'
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (productId) => products.find(p => p.product_id === productId)?.name || 'N/A'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Edit</Button>
                    <Button onClick={() => showDeleteModal(record.sale_detail_id)} type="link" danger>Delete</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (saleDetailId) => {
        setCurrentSaleDetailId(saleDetailId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <NavBarMenu /> {/* Aquí se incluye el NavBarMenu */}
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Search sale details..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Add Sale Detail</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredSaleDetails}
                rowKey="sale_detail_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Edit Sale Detail' : 'Add Sale Detail'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editMode ? 'Update' : 'Add'}
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="saleDetailForm"
                >
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter the quantity' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="sale" label="Sale" rules={[{ required: true, message: 'Please select a sale' }]}>
                        <Select placeholder="Select a sale">
                            {sales.map(sale => (
                                <Option key={sale.sale_id} value={sale.sale_id}>{sale.total}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="product" label="Product" rules={[{ required: true, message: 'Please select a product' }]}>
                        <Select placeholder="Select a product">
                            {products.map(product => (
                                <Option key={product.product_id} value={product.product_id}>{product.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Delete Sale Detail"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this sale detail?</p>
            </Modal>
        </div>
    );
};

export default SaleDetailsPage;
