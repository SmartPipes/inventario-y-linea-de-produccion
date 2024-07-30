import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Select, Space, Button, message, DatePicker } from 'antd';
import moment from 'moment'; // Importa moment para manipular fechas
import { API_URL_DELIVERY_PAYMENTS, API_URL_DELIVERY_SALES } from '../../pages/Config'; // Ajusta la ruta de importación según sea necesario
import axios from 'axios';
import NavBarMenu from './NavBarMenu';

const { Option } = Select;

const PaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [sales, setSales] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentPayment, setCurrentPayment] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentPaymentId, setCurrentPaymentId] = useState(null);

    useEffect(() => {
        fetchPayments();
        fetchSales();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, payments]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL_DELIVERY_PAYMENTS);
            setPayments(response.data);
            setFilteredPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
        setLoading(false);
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

    const showModal = (payment = null) => {
        setCurrentPayment(payment);
        setEditMode(!!payment);
        if (payment) {
            form.setFieldsValue({
                ...payment,
                payment_date: payment.payment_date ? moment(payment.payment_date) : null // Convierte la fecha en un objeto moment
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
                payment_date: values.payment_date ? values.payment_date.toISOString() : null // Convierte la fecha a formato ISO 8601
            };

            // Añade un console.log para verificar los datos que se envían
            console.log('Datos que se enviarán al backend:', formattedValues);

            if (editMode) {
                await axios.put(`${API_URL_DELIVERY_PAYMENTS}${currentPayment.payment_id}/`, formattedValues);
                message.success('Pago actualizado exitosamente');
            } else {
                await axios.post(API_URL_DELIVERY_PAYMENTS, formattedValues);
                message.success('Pago agregado exitosamente');
            }
            fetchPayments();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al guardar el pago:', error);
            message.error('Error al guardar el pago');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL_DELIVERY_PAYMENTS}${currentPaymentId}/`);
            fetchPayments();
            message.success('Pago eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el pago:', error);
            message.error('Error al eliminar el pago');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = payments.filter(payment =>
            (payment.payment_method && payment.payment_method.toLowerCase().includes(searchText.toLowerCase())) ||
            (payment.transaction_id && payment.transaction_id.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredPayments(filtered);
    };

    const columns = [
        { title: 'ID', dataIndex: 'payment_id', key: 'payment_id' },
        { title: 'Método de Pago', dataIndex: 'payment_method', key: 'payment_method' },
        {
            title: 'Fecha de Pago',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: text => text ? moment(text).format('YYYY-MM-DDTHH:mm:ssZ') : 'N/A'
        },
        { title: 'Monto', dataIndex: 'amount', key: 'amount', render: text => text ?? 'N/A' },
        { title: 'ID de Transacción', dataIndex: 'transaction_id', key: 'transaction_id', render: text => text ?? 'N/A' },
        {
            title: 'Venta Asociada',
            dataIndex: 'sale_id',
            key: 'sale_id',
            render: (text) => (
                sales[text]?.total || 'N/A'
            )
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => showDeleteModal(record.payment_id)} type="link" danger>Eliminar</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (paymentId) => {
        setCurrentPaymentId(paymentId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <NavBarMenu />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Buscar pago..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={() => showModal()}>Agregar Pago</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredPayments}
                rowKey="payment_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Editar Pago' : 'Agregar Pago'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editMode ? 'Actualizar' : 'Agregar'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="paymentForm"
                >
                    <Form.Item name="payment_date" label="Fecha de Pago" rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}>
                        <DatePicker showTime format="YYYY-MM-DDTHH:mm:ssZ" />
                    </Form.Item>
                    <Form.Item name="payment_method" label="Método de Pago" rules={[{ required: true, message: 'Por favor, ingresa el método de pago' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="amount" label="Monto">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="transaction_id" label="ID de Transacción">
                        <Input />
                    </Form.Item>
                    <Form.Item name="sale_id" label="Venta Asociada">
                        <Select placeholder="Selecciona una venta">
                            {Object.values(sales).map(sale => (
                                <Option key={sale.sale_id} value={sale.sale_id}>{sale.total}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Eliminar Pago"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas eliminar este pago?</p>
            </Modal>
        </div>
    );
};

export default PaymentsPage;
