import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Select, Space, Button, message, DatePicker, Descriptions, InputNumber } from 'antd';
import moment from 'moment'; 
import { API_URL_DELIVERY_ORDERS, API_URL_THIRD_PARTY_SERVICES, API_URL_DELIVERY_SALES, API_URL_USERS, API_URL_DELIVERY_DETAILS, API_URL_PRODUCTS, API_URL_INV } from '../../pages/Config';
import NavBarMenu from './NavBarMenu';
import { apiClient } from './../../../ApiClient';
import { MainContent } from '../../../Styled/Production.styled';

const { Option } = Select;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [thirdPartyServices, setThirdPartyServices] = useState({});
  const [sales, setSales] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentOrderID, setCurrentOrderID] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [DeliveryDetails, setDeliveryDetails] = useState([]);
  const [modalDetails, setModalDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [DeliveryVisible, setDeliveryVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [inv, setInv] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchThirdPartyServices();
    fetchSales();
    fetchUsers();
    fetchOrderDetails();
    fetchProducts();
    fetchInventories();
  }, []);

  useEffect(() => {
    handleSearchChange(searchText);
  }, [searchText, orders]);

  const fetchInventories = async () => {
    try {
      const response = await apiClient.get(API_URL_INV);
      setInv(response.data);
    } catch (error) {
      console.error('Error at fetching INV', error);
    }
  };

  const showModalDeliver = (orderID, service) => {
    setCurrentOrderID(orderID);
    const serviceDetails = thirdPartyServices[service];
    if (serviceDetails) {
      const serviceName = serviceDetails.service_name;
      console.log(serviceName);
      setCurrentService(serviceName);
      form.setFieldsValue({ orderID });
      form.setFieldsValue({ serviceName });
      setDeliveryVisible(true);
    } else {
      console.error('Service not found for the given service ID:', service);
    }
  };

  const handleCancelDeliver = () => {
    setDeliveryVisible(false);
    setCurrentOrderID(null);
    setCurrentService(null);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(API_URL_DELIVERY_ORDERS);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const getHighestStockInventoryId = (itemId) => {
    const filteredItems = inv.filter(
      (item) => item.item_id === itemId && item.item_type === 'Product'
    );
    if (filteredItems.length === 0) {
      return null;
    }
    const highestStockItem = filteredItems.reduce((prev, current) =>
      prev.stock > current.stock ? prev : current
    );
    return highestStockItem.inventory_id;
  };

  const handleOkDeliver = async () => {
    try {
      await form.validateFields();
      const detailsForOrder = DeliveryDetails.filter(detail => detail.delivery_order === currentOrderID);
      
      const updatedInventory = [...inv];

      for (const detail of detailsForOrder) {
        const inventoryId = getHighestStockInventoryId(detail.product);
        if (inventoryId !== null) {
          const inventoryItem = updatedInventory.find(item => item.inventory_id === inventoryId);
          if (inventoryItem) {
            inventoryItem.stock -= detail.quantity;
            await apiClient.put(`${API_URL_INV}${inventoryId}/`, { ...inventoryItem });
          }
        }
      }
      const statusChange = {
        ...orders.find(detail => detail.delivery_order_id === currentOrderID),
        status:"delivered"
      }
      console.log(statusChange);    
      await apiClient.put(`${API_URL_DELIVERY_ORDERS}${currentOrderID}/`,statusChange);

      setInv(updatedInventory);
      fetchInventories();
      fetchOrders();
      setDeliveryVisible(false);
      message.success('Delivery processed and inventory updated successfully');
    } catch (error) {
      console.log('Form validation failed or error updating inventory:', error);
      message.error('Error processing delivery');
    }
  };

  const fetchThirdPartyServices = async () => {
    try {
      const response = await apiClient.get(API_URL_THIRD_PARTY_SERVICES);
      const servicesMap = {};
      response.data.forEach(service => {
        servicesMap[service.service_id] = service;
      });
      setThirdPartyServices(servicesMap);
    } catch (error) {
      console.error('Error fetching third party services:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(API_URL_PRODUCTS);
      setProducts(response.data);
    } catch (error) {
      console.error('Error at fetching products:', error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await apiClient.get(API_URL_DELIVERY_SALES);
      const salesMap = {};
      response.data.forEach(sale => {
        salesMap[sale.sale_id] = sale;
      });
      setSales(salesMap);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get(API_URL_USERS);
      const usersMap = {};
      response.data.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await apiClient.get(API_URL_DELIVERY_DETAILS);
      setDeliveryDetails(response.data);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
    }
  };

  const getProductDetails = (productId) => {
    const product = products.find(product => product.product_id === productId);
    return product || { name: 'Producto desconocido', price: 'No disponible' };
  };

  const showModalDetails = (deliveryID) => {
    const detailsForOrder = DeliveryDetails.filter(detail => detail.delivery_order === deliveryID);
    console.log(DeliveryDetails);
    setModalDetails(detailsForOrder);
    setCurrentOrderID(deliveryID);
    setIsDetailModalVisible(true);
  };

  const showModal = (order = null) => {
    setCurrentOrder(order);
    setEditMode(!!order);
    if (order) {
      form.setFieldsValue({
        ...order,
        delivery_date: order.delivery_date ? moment(order.delivery_date) : null 
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
        delivery_date: values.delivery_date ? values.delivery_date.toISOString() : null 
      };
      console.log('Datos que se enviarán al backend:', formattedValues);
      if (editMode) {
        await apiClient.put(`${API_URL_DELIVERY_ORDERS}${currentOrder.delivery_order_id}/`, formattedValues);
        message.success('Orden actualizada exitosamente');
      } else {
        await apiClient.post(API_URL_DELIVERY_ORDERS, formattedValues);
        message.success('Orden agregada exitosamente');
      }
      fetchOrders();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error al guardar la orden:', error);
      message.error('Error at Saving Order');
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`${API_URL_DELIVERY_ORDERS}${currentOrderId}/`);
      fetchOrders();
      message.success('Deleted Order Successfully');
    } catch (error) {
      console.error('Error at Eliminating Order:', error);
      message.error('Error at Eliminating Order');
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const handleSearchChange = (searchText) => {
    setSearchText(searchText.toLowerCase());
    const filtered = orders.filter(order => {
        const saleId = sales[order.sale]?.sale_id.toString() || '';
        const clientName = users[order.client]?.first_name.toLowerCase() || '';
        return (
            order.delivery_order_id.toString().includes(searchText) ||
            saleId.includes(searchText) ||
            order.status.toLowerCase().includes(searchText) ||
            clientName.includes(searchText)
        );
    });
    setFilteredOrders(filtered);
};


  const columns = [
    { title: 'ID', dataIndex: 'delivery_order_id', key: 'delivery_order_id' },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date'
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Address', dataIndex: 'delivery_address', key: 'delivery_address' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Delivery Service',
      dataIndex: 'third_party_service',
      key: 'third_party_service',
      render: (text, record) => (
        thirdPartyServices[record.third_party_service]?.service_name || 'N/A'
      )
    },
    {
      title: 'Sale',
      dataIndex: 'sale',
      key: 'sale',
      render: (text, record) => {
        const saleId = sales[record.sale]?.sale_id;
        return saleId ? `S-${saleId.toString().padStart(4, '0')}` : 'N/A';
      }
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (text, record) => (
        users[record.client]?.first_name || 'N/A'
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            onClick={() => showModalDetails(record.delivery_order_id)}
          >
            Details
          </Button>
          {record.status != 'delivered' &&
       (   <Button onClick={() => showModalDeliver(record.delivery_order_id, record.third_party_service)} type="default">Deliver</Button>)}
         {record.status !== 'delivered' &&( <Button onClick={() => showModal(record)} type="default">Edit</Button>)}
          <Button onClick={() => showDeleteModal(record.delivery_order_id)} type="default" danger>Delete</Button>
        </Space>
      )
    }
  ];

  const showDeleteModal = (orderId) => {
    setCurrentOrderId(orderId);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsDetailModalVisible(false);
  };

  return (
    <div>
      <MainContent>
        <NavBarMenu title={'Delivery'} />
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search Order..."
            value={searchText}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ width: 300, marginRight: '16px' }}
          />
          {/* You cant add an order by hand <Button type="primary" onClick={() => showModal()}>Agregar Orden</Button> */}
        </div>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="delivery_order_id"
          loading={loading}
        />
        <Modal
          title={editMode ? 'Editar Orden' : 'Agregar Orden'}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={editMode ? 'Update' : 'Add'}
          cancelText="Cancel"
        >
          <Form
            form={form}
            layout="vertical"
            name="orderForm"
          >
            <Form.Item name="delivery_date" label="Fecha de Entrega" rules={[{ required: true, message: 'Please select a date' }]}>
              <DatePicker showTime format="YYYY-MM-DDTHH:mm:ssZ" disabled />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select placeholder="Selecciona un estado" disabled>
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
                <Option value="canceled">Cancelled</Option>
              </Select>
            </Form.Item>
            <Form.Item name="delivery_address" label="Delivery address">
              <Input disabled/>
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="third_party_service" label="Delivery Service">
              <Select placeholder="Selecciona un servicio">
                {Object.values(thirdPartyServices).map(service => (
                  <Option key={service.service_id} value={service.service_id}>{service.service_name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="sale" label="Sale">
              <Select placeholder="Selecciona una venta" disabled>
                {Object.values(sales).map(sale => (
                  <Option key={sale.sale_id} value={sale.sale_id}>{sale.sale_id}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="client" label="Client">
              <Select placeholder="Selecciona un cliente" disabled>
                {Object.values(users).map(user => (
                  <Option key={user.id} value={user.id}>{user.first_name} {user.last_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Delete Order"
          visible={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Do you want to delete this order?</p>
        </Modal>
        <Modal
          title={`Order Details ID: ${currentOrderID}`}
          open={isDetailModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Close
            </Button>
          ]}
          styles={{
            body: { maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' },
            modal: { borderRadius: '8px' }
          }}
        >
          {modalDetails.map(detail => (
            <div key={detail.delivery_order_detail_id} style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Product ID">{detail.product}</Descriptions.Item>
                <Descriptions.Item label="Name">{getProductDetails(detail.product).name}</Descriptions.Item>
                <Descriptions.Item label="Quantity">{detail.quantity}</Descriptions.Item>
              </Descriptions>
            </div>
          ))}
        </Modal>
        <Modal
          title='Register Information Befor Sending'
          visible={DeliveryVisible}
          onOk={handleOkDeliver}
          onCancel={handleCancelDeliver}
          okText="Send"
          cancelText="Cancel"
        >
          <Form
            form={form}
            layout="vertical"
            name="packageForm"
            initialValues={{
              orderID: currentOrderID,
              service: currentService,
              size: '',
              height: '',
              width: '',
              length: '',
              weight: ''
            }}
          >
            <Form.Item
              name="orderID"
              label="Order ID"
              disabled={true}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="service"
              label="Delivery Service"
              rules={[{ required: true, message: 'Please input the size!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please input the size!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="height"
              label="Height"
              rules={[{ required: true, message: 'Please input the height!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="width"
              label="Width"
              rules={[{ required: true, message: 'Please input the width!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="length"
              label="Length"
              rules={[{ required: true, message: 'Please input the length!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="weight"
              label="Weight"
              rules={[{ required: true, message: 'Please input the weight!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </MainContent>
    </div>
  );
};

export default OrdersPage;
