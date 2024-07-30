import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Select, Space, Button, message, DatePicker } from 'antd';
import moment from 'moment'; // Importa moment para manipular fechas
import { API_URL_DELIVERY_ORDERS, API_URL_THIRD_PARTY_SERVICES, API_URL_DELIVERY_SALES, API_URL_USERS } from '../../pages/Config';
import axios from 'axios';
import NavBarMenu from './NavBarMenu';

const { Option } = Select;

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [thirdPartyServices, setThirdPartyServices] = useState({});
    const [sales, setSales] = useState({});
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentOrder, setCurrentOrder] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchThirdPartyServices();
        fetchSales();
        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_DELIVERY_ORDERS);
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
        setLoading(false);
    };

    const fetchThirdPartyServices = async () => {
        try {
            const response = await axios.get(API_URL_THIRD_PARTY_SERVICES);
            const servicesMap = {};
            response.data.forEach(service => {
                servicesMap[service.service_id] = service;
            });
            setThirdPartyServices(servicesMap);
        } catch (error) {
            console.error('Error fetching third party services:', error);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await axios.get(API_URL_DELIVERY_SALES);
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
            const response = await axios.get(API_URL_USERS);
            const usersMap = {};
            response.data.forEach(user => {
                usersMap[user.id] = user;
            });
            setUsers(usersMap);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const showModal = (order = null) => {
        setCurrentOrder(order);
        setEditMode(!!order);
        if (order) {
            form.setFieldsValue({
                ...order,
                delivery_date: order.delivery_date ? moment(order.delivery_date) : null // Convierte la fecha en un objeto moment
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
                delivery_date: values.delivery_date ? values.delivery_date.toISOString() : null // Convierte la fecha a formato ISO 8601
            };
            
            // Añade un console.log para verificar los datos que se envían
            console.log('Datos que se enviarán al backend:', formattedValues);
            
            if (editMode) {
                await axios.put(`${API_URL_DELIVERY_ORDERS}${currentOrder.delivery_order_id}/`, formattedValues);
                message.success('Orden actualizada exitosamente');
            } else {
                await axios.post(API_URL_DELIVERY_ORDERS, formattedValues);
                message.success('Orden agregada exitosamente');
            }
            fetchOrders();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar la orden:', error);
            message.error('Error al guardar la orden');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL_DELIVERY_ORDERS}${currentOrderId}/`);
            fetchOrders();
            message.success('Orden eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la orden:', error);
            message.error('Error al eliminar la orden');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = orders.filter(order =>
            (order.delivery_address && order.delivery_address.toLowerCase().includes(searchText.toLowerCase())) ||
            (order.notes && order.notes.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredOrders(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'delivery_order_id', key: 'delivery_order_id' },
        {
            title: 'Fecha de Entrega',
            dataIndex: 'delivery_date',
            key: 'delivery_date',
            render: text => text ? moment(text).format('YYYY-MM-DDTHH:mm:ssZ') : 'N/A'
        },
        { title: 'Estado', dataIndex: 'status', key: 'status' },
        { title: 'Dirección de Entrega', dataIndex: 'delivery_address', key: 'delivery_address' },
        { title: 'Notas', dataIndex: 'notes', key: 'notes' },
        {
            title: 'Servicio de Terceros',
            dataIndex: 'third_party_service',
            key: 'third_party_service',
            render: (text, record) => (
                thirdPartyServices[record.third_party_service]?.tracking_url || 'N/A'
            )
        },
        {
            title: 'Venta',
            dataIndex: 'sale',
            key: 'sale',
            render: (text, record) => (
                sales[record.sale]?.total || 'N/A'
            )
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
            key: 'client',
            render: (text, record) => (
                users[record.client]?.first_name || 'N/A'
            )
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.delivery_order_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (orderId) => {
        setCurrentOrderId(orderId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <NavBarMenu />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar orden..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Orden</Button>
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
                okText={editMode ? 'Actualizar' : 'Agregar'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="orderForm"
                >
                    <Form.Item name="delivery_date" label="Fecha de Entrega" rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}>
                        <DatePicker showTime format="YYYY-MM-DDTHH:mm:ssZ" />
                    </Form.Item>
                    <Form.Item name="status" label="Estado">
                        <Select placeholder="Selecciona un estado">
                            <Option value="pending">Pendiente</Option>
                            <Option value="completed">Completado</Option>
                            <Option value="canceled">Cancelado</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="delivery_address" label="Dirección de Entrega">
                        <Input />
                    </Form.Item>
                    <Form.Item name="notes" label="Notas">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="third_party_service" label="Servicio de Terceros">
                        <Select placeholder="Selecciona un servicio">
                            {Object.values(thirdPartyServices).map(service => (
                                <Option key={service.service_id} value={service.service_id}>{service.service_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="sale" label="Venta">
                        <Select placeholder="Selecciona una venta">
                            {Object.values(sales).map(sale => (
                                <Option key={sale.sale_id} value={sale.sale_id}>{sale.total}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="client" label="Cliente">
                        <Select placeholder="Selecciona un cliente">
                            {Object.values(users).map(user => (
                                <Option key={user.id} value={user.id}>{user.first_name} {user.last_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Eliminar Orden"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas eliminar esta orden?</p>
            </Modal>
        </div>
    );
};

export default OrdersPage;
