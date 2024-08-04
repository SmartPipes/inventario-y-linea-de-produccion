import React, { useEffect, useState } from 'react';
import { Table, Typography, Input, Space, Button, Modal, Descriptions } from 'antd';
import { apiClient } from '../../../ApiClient';

const { Title } = Typography;
const { Search } = Input;

export const Sales = () => {
  const [saleDetails, setSaleDetails] = useState([]);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]); // Estado para almacenar los pagos
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState(null);
  const [modalDetails, setModalDetails] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearchChange(searchText);
  }, [searchText, sales]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        saleDetailsResponse,
        salesResponse,
        usersResponse,
        productsResponse,
        paymentsResponse // Petición para obtener los pagos
      ] = await Promise.all([
        apiClient.get('/sales/sale-details/'),
        apiClient.get('/sales/sales/'),
        apiClient.get('/users/users/'),
        apiClient.get('/inventory/products/'),
        apiClient.get('/sales/payments/') // URL para obtener los métodos de pago
      ]);

      setSaleDetails(saleDetailsResponse.data);
      setSales(salesResponse.data);
      setFilteredSales(salesResponse.data);
      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
      setPayments(paymentsResponse.data); // Almacena los métodos de pago
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const getClientInfo = (clientId) => {
    const user = users.find(user => user.id === clientId);
    return user ? `${user.first_name} ${user.last_name}` : 'Cliente desconocido';
  };

  const getSaleDate = (saleId) => {
    const sale = sales.find(sale => sale.sale_id === saleId);
    return sale ? new Date(sale.sale_date).toLocaleDateString() : 'Fecha desconocida';
  };

  const getProductDetails = (productId) => {
    const product = products.find(product => product.product_id === productId);
    return product || { name: 'Producto desconocido', price: 'No disponible' };
  };

  const getPaymentMethod = (saleId) => {
    const payment = payments.find(payment => payment.sale_id === saleId);
    return payment ? payment.payment_method : 'Pendiente';
  };

  const formatPrice = (price) => {
    if (price === null || isNaN(price)) {
      return 'No disponible';
    }
    return `$${Number(price).toFixed(2)}`;
  };

  const handleSearchChange = (searchText) => {
    setSearchText(searchText);
    const filtered = sales.filter(sale =>
      getClientInfo(sale.client_id).toLowerCase().includes(searchText.toLowerCase()) ||
      sale.sale_id.toString().includes(searchText) ||
      getSaleDate(sale.sale_id).includes(searchText)
    );
    setFilteredSales(filtered);
  };

  const showModal = (saleId) => {
    const detailsForSale = saleDetails.filter(detail => detail.sale === saleId);
    setModalDetails(detailsForSale);
    setCurrentSaleId(saleId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const calculateTotalPrice = (saleId) => {
    const details = saleDetails.filter(detail => detail.sale === saleId);
    return details.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalQuantity = (saleId) => {
    const details = saleDetails.filter(detail => detail.sale === saleId);
    return details.reduce((total, item) => total + item.quantity, 0);
  };

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'client_id',
      key: 'client_id',
      render: (clientId) => getClientInfo(clientId),
    },
    {
      title: 'ID de Venta',
      dataIndex: 'sale_id',
      key: 'sale_id',
    },
    {
      title: 'Fecha de Venta',
      dataIndex: 'sale_id',
      key: 'sale_date',
      render: getSaleDate,
    },
    {
      title: 'Método de Pago',
      dataIndex: 'sale_id',
      key: 'payment_method',
      render: getPaymentMethod,
    },
    {
      title: 'Cantidad Total',
      key: 'total_quantity',
      render: (_, record) => calculateTotalQuantity(record.sale_id),
    },
    {
      title: 'Precio Total',
      key: 'total_price',
      render: (_, record) => formatPrice(calculateTotalPrice(record.sale_id)),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="default"
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '4px 12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => showModal(record.sale_id)}
        >
          Detalles
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2} style={{ color: '#333', marginBottom: '20px' }}>Ventas</Title>
      <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
        <Search
          placeholder="Buscar por Cliente, ID de Venta o Fecha"
          onChange={e => handleSearchChange(e.target.value)}
          enterButton
          allowClear
          style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredSales}
        rowKey="sale_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
      />

      <Modal
        title={`Detalles de la Venta ID: ${currentSaleId}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Cerrar
          </Button>
        ]}
        styles={{
          body: { maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' },
          modal: { borderRadius: '8px' }
        }}
      >
        {modalDetails.map(detail => (
          <div key={detail.sale_detail_id} style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID del Producto">{detail.product}</Descriptions.Item>
              <Descriptions.Item label="Nombre">{getProductDetails(detail.product).name}</Descriptions.Item>
              <Descriptions.Item label="Cantidad">{detail.quantity}</Descriptions.Item>
              <Descriptions.Item label="Precio">{formatPrice(detail.price)}</Descriptions.Item>
            </Descriptions>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Sales;
