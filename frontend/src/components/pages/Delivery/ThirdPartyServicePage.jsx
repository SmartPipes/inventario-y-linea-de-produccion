import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Space, Button, message } from 'antd';
import { apiClient } from '../../../ApiClient';
import { API_URL_THIRD_PARTY_SERVICES } from '../../pages/Config'; // Adjust the import path as needed
import NavBarMenu from './NavBarMenu'; // Ensure the import path is correct
import { MainContent } from '../../../Styled/Production.styled';

const ThirdPartyServicePage = () => {
    const [thirdPartyServices, setThirdPartyServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentService, setCurrentService] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);
    const buttonColor = '#97b25e';

    useEffect(() => {
        fetchThirdPartyServices();
    }, []);

    useEffect(() => {
        handleSearchChange(searchText);
    }, [searchText, thirdPartyServices]);

    const fetchThirdPartyServices = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_THIRD_PARTY_SERVICES);
            setThirdPartyServices(response.data);
            setFilteredServices(response.data);
        } catch (error) {
            console.error('Error fetching third-party services:', error);
        }
        setLoading(false);
    };

    const showModal = (service = null) => {
        setCurrentService(service);
        setEditMode(!!service);
        if (service) {
            form.setFieldsValue({
                ...service
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editMode) {
                await apiClient.put(`${API_URL_THIRD_PARTY_SERVICES}${currentService.service_id}/`, values);
                message.success('Third-party service updated successfully');
            } else {
                await apiClient.post(API_URL_THIRD_PARTY_SERVICES, values);
                message.success('Third-party service added successfully');
            }
            fetchThirdPartyServices();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving third-party service:', error);
            message.error('Error saving third-party service');
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`${API_URL_THIRD_PARTY_SERVICES}${currentServiceId}/`);
            fetchThirdPartyServices();
            message.success('Third-party service deleted successfully');
        } catch (error) {
            console.error('Error deleting third-party service:', error);
            message.error('Error deleting third-party service');
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleSearchChange = (searchText) => {
        setSearchText(searchText);
        const filtered = thirdPartyServices.filter(service =>
            service.service_name.toLowerCase().includes(searchText.toLowerCase()) ||
            service.contact_number.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredServices(filtered);
    };

    const columns = [
        { title: 'Service ID', dataIndex: 'service_id', key: 'service_id' },
        { title: 'Service Name', dataIndex: 'service_name', key: 'service_name' },
        { title: 'Contact Number', dataIndex: 'contact_number', key: 'contact_number' },
        { title: 'Tracking URL', dataIndex: 'tracking_url', key: 'tracking_url', render: text => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="default">Edit</Button>
                    <Button onClick={() => showDeleteModal(record.service_id)} type="default" danger>Delete</Button>
                </Space>
            )
        }
    ];

    const showDeleteModal = (serviceId) => {
        setCurrentServiceId(serviceId);
        setIsDeleteModalVisible(true);
    };

    return (
        <div>
            <MainContent>
              <NavBarMenu title={'Delivery'} />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Search Delivery Services..."
                    value={searchText}
                    onChange={e => handleSearchChange(e.target.value)}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" style={{ backgroundColor: buttonColor, borderColor: buttonColor }} onClick={() => showModal()}>Add Delivery Service</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredServices}
                rowKey="service_id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Edit Delivery Service' : 'Add Delivery Service'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editMode ? 'Update' : 'Add'}
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="serviceForm"
                >
                    <Form.Item name="service_name" label="Service Name" rules={[{ required: true, message: 'Please enter the service name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true, message: 'Please enter the contact number' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="tracking_url" label="Tracking URL" rules={[{ required: true, message: 'Please enter the tracking URL' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Delete Delivery Service"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this delivery service?</p>
            </Modal>
            </MainContent>
        </div>
    );
};

export default ThirdPartyServicePage;
