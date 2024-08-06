import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, Select, message, Tag, Tooltip } from 'antd';
import { PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import NavBarMenu from './NavBarMenu';
import { apiClient } from '../../../ApiClient';
import {
    API_URL_RESTOCK_WH,
    API_URL_WAREHOUSES,
    API_URL_USERS,
    API_URL_FACTORIES,
    API_URL_ORDERS,
} from '../Config';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../../../../media//inventory/product_icons/SmartPipesLogo.png';

const { Option } = Select;

const buttonColor = '#97b25e';

const RestockRequestWarehousePage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [users, setUsers] = useState([]);
    const [factories, setFactories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
    const [currentPrintRecord, setCurrentPrintRecord] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState('All');
    const [selectedFactory, setSelectedFactory] = useState('All');
    const [currentDeleteId, setCurrentDeleteId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        apiClient.get(API_URL_RESTOCK_WH)
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });

        apiClient.get(API_URL_WAREHOUSES)
            .then(response => {
                setWarehouses(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching warehouses!", error);
            });

        apiClient.get(API_URL_USERS)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching users!", error);
            });

        apiClient.get(API_URL_FACTORIES)
            .then(response => {
                setFactories(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching factories!", error);
            });

        apiClient.get(API_URL_ORDERS)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching production orders!", error);
            });
    }, []);

    const handleAdd = (values) => {
        apiClient.post(API_URL_RESTOCK_WH, values)
            .then(response => {
                const newData = [...data, response.data];
                setData(newData);
                setFilteredData(newData);
                setIsAddModalVisible(false);
            })
            .catch(error => {
                console.error("There was an error adding the data!", error);
            });
    };

    const handleDelete = () => {
        if (!currentDeleteId) {
            message.error('No ID specified for deletion.');
            return;
        }

        const deleteUrl = `${API_URL_RESTOCK_WH}${currentDeleteId}`;
        console.log(deleteUrl);
        apiClient.delete(deleteUrl)
            .then(() => {
                setData(data.filter(item => item.id !== currentDeleteId));
                setIsDeleteModalVisible(false);
                setCurrentDeleteId(null);
                message.success('Restock request deleted successfully!');
            })
            .catch(error => {
                console.error("There was an error deleting the data!", error);
                message.error('Failed to delete restock request.');
            });
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
        filterData(text, selectedUser, selectedFactory);
    };

    const handleUserChange = (user) => {
        setSelectedUser(user);
        filterData(searchText, user, selectedFactory);
    };

    const handleFactoryChange = (factory) => {
        setSelectedFactory(factory);
        filterData(searchText, selectedUser, factory);
    };

    const filterData = (text, user, factory) => {
        let filtered = data;
        if (text) {
            filtered = filtered.filter(item =>
                item.production_order_id.toString().includes(text)
            );
        }
        if (user !== 'All') {
            filtered = filtered.filter(item =>
                item.requested_by === user
            );
        }
        if (factory !== 'All') {
            filtered = filtered.filter(item =>
                item.to_factory === factory
            );
        }
        setFilteredData(filtered);
    };

    const showPrintModal = (record) => {
        setCurrentPrintRecord(record);
        setIsPrintModalVisible(true);
    };

    const showDeleteModal = (id) => {
        setCurrentDeleteId(id);
        setIsDeleteModalVisible(true);
    };

    const generatePDF = () => {
        const printContent = document.getElementById('print-content');
        html2canvas(printContent).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 20, 190, 0);
            pdf.save('restock-request.pdf');
        });
    };

    const renderStatusTag = (status) => {
        let color;
        switch (status) {
            case 'Approved':
                color = 'green';
                break;
            case 'Pending':
                color = 'red';
                break;
            case 'In Progress':
                color = 'yellow';
                break;
            default:
                color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'From Warehouse',
            dataIndex: 'from_warehouse',
            key: 'from_warehouse',
            align: 'center',
            render: (text) => (
                <span>{warehouses.find(wh => wh.warehouse_id === text)?.name || text}</span>
            ),
        },
        {
            title: 'Requested By',
            dataIndex: 'requested_by',
            key: 'requested_by',
            align: 'center',
            render: (text) => (
                <span>{users.find(user => user.id === text)?.first_name + " " + users.find(user => user.id === text)?.last_name || text}</span>
            ),
        },
        {
            title: 'To Factory',
            dataIndex: 'to_factory',
            key: 'to_factory',
            align: 'center',
            render: (text) => (
                <span>{factories.find(factory => factory.factory_id === text)?.name || text}</span>
            ),
        },
        {
            title: 'Production Order',
            dataIndex: 'production_order_id',
            key: 'production_order_id',
            align: 'center',
            render: (text) => (
                <span>{orders.find(order => order.production_order_id === text)?.production_order_id || text}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => renderStatusTag(status),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Print">
                        <Button onClick={() => showPrintModal(record)} type="link" icon={<PrinterOutlined />} style={{ color: buttonColor }} />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button onClick={() => showDeleteModal(record.id)} type="link" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            )
        },
    ];

    return (
        <div>
            <NavBarMenu title="Restock Requests Warehouse" />
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Input
                    placeholder="Search by Order ID"
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 200 }}
                />
                <Select
                    placeholder="Filter by User"
                    value={selectedUser}
                    onChange={handleUserChange}
                    style={{ width: 200 }}
                >
                    <Option value="All">All</Option>
                    {users.map(user => (
                        <Option key={user.id} value={user.id}>{user.first_name} {user.last_name}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="Filter by Factory"
                    value={selectedFactory}
                    onChange={handleFactoryChange}
                    style={{ width: 200 }}
                >
                    <Option value="All">All</Option>
                    {factories.map(factory => (
                        <Option key={factory.factory_id} value={factory.factory_id}>{factory.name}</Option>
                    ))}
                </Select>
                <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                    Add Request
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }
                }}
            />
            <Modal
                title="Restock Request"
                visible={isAddModalVisible}
                onOk={() => setIsAddModalVisible(false)}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    name="restockRequestForm"
                    initialValues={{ status: "Pending" }}
                    onFinish={handleAdd}
                >
                    <Form.Item
                        name="from_warehouse"
                        label="From Warehouse"
                        rules={[{ required: true, message: 'Please select the from warehouse' }]}
                    >
                        <Select placeholder="Select a warehouse">
                            {warehouses.map(wh => (
                                <Option key={wh.warehouse_id} value={wh.warehouse_id}>{wh.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="requested_by"
                        label="Requested By"
                        rules={[{ required: true, message: 'Please select the user' }]}
                    >
                        <Select placeholder="Select a user">
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>{user.first_name} {user.last_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="to_factory"
                        label="To Factory"
                        rules={[{ required: true, message: 'Please select the factory' }]}
                    >
                        <Select placeholder="Select a factory">
                            {factories.map(factory => (
                                <Option key={factory.factory_id} value={factory.factory_id}>{factory.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="production_order_id"
                        label="Production Order"
                        rules={[{ required: true, message: 'Please select the production order' }]}
                    >
                        <Select placeholder="Select a production order">
                            {orders.map(order => (
                                <Option key={order.production_order_id} value={order.production_order_id}>{order.creation_date}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select the status' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value="Pending">Pending</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Completed">Completed</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Delete Restock Request"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this restock request?</p>
            </Modal>
            <Modal
                title="Print Request"
                visible={isPrintModalVisible}
                onOk={() => setIsPrintModalVisible(false)}
                onCancel={() => setIsPrintModalVisible(false)}
                footer={
                    <Button onClick={generatePDF} type="primary" style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                        Download PDF
                    </Button>
                }
            >
                {currentPrintRecord && (
                    <div id="print-content" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
                        <img src={logo} alt="Company Logo" style={{ width: '150px', display: 'block', margin: '0 auto 20px auto' }} />
                        <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '24px', color: '#333' }}>Restock Request Details</h2>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Production Order:</strong> {orders.find(order => order.production_order_id === currentPrintRecord.production_order_id)?.production_order_id}</p>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>From Warehouse:</strong> {warehouses.find(wh => wh.warehouse_id === currentPrintRecord.from_warehouse)?.name}</p>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Requested By:</strong> {users.find(user => user.id === currentPrintRecord.requested_by)?.first_name} {users.find(user => user.id === currentPrintRecord.requested_by)?.last_name}</p>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>To Factory:</strong> {factories.find(factory => factory.factory_id === currentPrintRecord.to_factory)?.name}</p>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Production Order Date:</strong> {orders.find(order => order.production_order_id === currentPrintRecord.production_order_id)?.creation_date}</p>
                        <p style={{ fontSize: '16px', marginBottom: '20px' }}><strong>Status:</strong> {currentPrintRecord.status}</p>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Barcode value={currentPrintRecord.id.toString()} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RestockRequestWarehousePage;
