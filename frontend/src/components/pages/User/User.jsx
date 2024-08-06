import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, Space, message, Select } from 'antd';
import { API_URL_USERS, API_URL_DIVISIONS, API_URL_DIVISION_USERS } from '../Config';
import NavBarMenu from '../inventory/NavBarMenu';
import { apiClient } from '../../../ApiClient';

const { Option } = Select;

export const User = () => {
    const [users, setUsers] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [divisionUsers, setDivisionUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState(null);
    const [originalPassword, setOriginalPassword] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchDivisions();
        fetchDivisionUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_URL_USERS);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Error fetching users');
        }
        setLoading(false);
    };

    const fetchDivisions = async () => {
        try {
            const response = await apiClient.get(API_URL_DIVISIONS);
            setDivisions(response.data);
            console.log('Divisions:', response.data);
        } catch (error) {
            console.error('Error fetching divisions:', error);
            message.error('Error fetching divisions');
        }
    };

    const fetchDivisionUsers = async () => {
        try {
            const response = await apiClient.get(API_URL_DIVISION_USERS);
            setDivisionUsers(response.data);
            console.log('Division Users:', response.data);
        } catch (error) {
            console.error('Error fetching division users:', error);
            message.error('Error fetching division users');
        }
    };

    const showModal = async (user = null) => {
        setCurrentUser(user);
        setEditMode(!!user);
        if (user) {
            const divisionUser = divisionUsers.find(du => du.user === user.id);
            const userResponse = await apiClient.get(`${API_URL_USERS}${user.id}/`);
            const userData = userResponse.data;

            setOriginalPassword(userData.password); // Store original password

            form.setFieldsValue({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                division: divisionUser ? divisionUser.division : null,
                phone: user.phone || '',
                birthdate: user.birthdate || null,
                password: '' // Leave blank for edit, password should be updated only if provided
            });
        } else {
            form.resetFields();
            setOriginalPassword(''); // Clear original password
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const userData = {
                last_login: null,
                first_name: values.first_name,
                last_name: values.last_name,
                birthdate: values.birthdate,
                email: values.email,
                phone: values.phone,
                role: 'Admin',
                status: 'Active',
                is_staff: false,
                is_superuser: false,
                is_active: true,
                password: values.password ? values.password : originalPassword // Use original password if not changed
            };

            console.log('User data to send:', userData);

            if (editMode) {
                console.log('Editing user with ID:', currentUser.id);
                await apiClient.put(`${API_URL_USERS}${currentUser.id}/`, userData);
                const divisionUser = divisionUsers.find(du => du.user === currentUser.id);
                const divisionData = {
                    removed_date: null,
                    division: values.division,
                    user: currentUser.id
                };
                console.log('Division data to send:', divisionData);
                if (divisionUser) {
                    await apiClient.put(`${API_URL_DIVISION_USERS}${divisionUser.division_user_id}/`, divisionData);
                } else {
                    await apiClient.post(API_URL_DIVISION_USERS, divisionData);
                }
                message.success('User updated successfully');
            } else {
                const response = await apiClient.post(API_URL_USERS, userData);
                const newUserId = response.data.id;
                const divisionData = {
                    removed_date: null,
                    division: values.division,
                    user: newUserId
                };
                console.log('Division data to send:', divisionData);
                await apiClient.post(API_URL_DIVISION_USERS, divisionData);
                message.success('User added successfully');
            }
            fetchUsers();
            fetchDivisionUsers();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving user:', error);
            console.error('Error details:', error.response?.data || error);
            message.error(`Error saving user: ${error.response?.data?.detail || error.message}`);
        }
    };

    const columns = [
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Division',
            dataIndex: 'id',
            key: 'division',
            render: userId => {
                const divisionUser = divisionUsers.find(du => du.user === userId);
                const division = divisions.find(div => div.division_id === (divisionUser?.division || ''));
                return division ? division.name : 'Unknown';
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} type="link">Edit</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <NavBarMenu title="User Management" />
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>Add User</Button>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
            />
            <Modal
                title={editMode ? 'Edit User' : 'Add User'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input type="password" />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthdate" label="Birthdate">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="division" label="Division">
                        <Select>
                            {divisions.map(division => (
                                <Option key={division.division_id} value={division.division_id}>
                                    {division.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
