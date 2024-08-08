import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Form, Input, Button, Space, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [roleFilter, setRoleFilter] = useState(null);
    const searchInput = useRef(null);

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
            const role = values.division ? 'User' : 'Admin'; // Set role based on division selection
            const userData = {
                last_login: null,
                first_name: values.first_name,
                last_name: values.last_name,
                birthdate: values.birthdate,
                email: values.email,
                phone: values.phone,
                role: role,
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
                if (values.division) {
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
                } else if (divisionUser) {
                    await apiClient.delete(`${API_URL_DIVISION_USERS}${divisionUser.division_user_id}/`);
                }

                message.success('User updated successfully');
            } else {
                const response = await apiClient.post(API_URL_USERS, userData);
                const newUserId = response.data.id;
                if (values.division) {
                    const divisionData = {
                        removed_date: null,
                        division: values.division,
                        user: newUserId
                    };
                    console.log('Division data to send:', divisionData);
                    await apiClient.post(API_URL_DIVISION_USERS, divisionData);
                }
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

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const handleRoleFilterChange = value => {
        setRoleFilter(value);
    };

    const filteredUsers = roleFilter
        ? users.filter(user => user.role === roleFilter)
        : users;

    const columns = [
        { title: 'First Name', dataIndex: 'first_name', key: 'first_name', ...getColumnSearchProps('first_name') },
        { title: 'Last Name', dataIndex: 'last_name', key: 'last_name', ...getColumnSearchProps('last_name') },
        { title: 'Email', dataIndex: 'email', key: 'email', ...getColumnSearchProps('email') },
        { title: 'Role', dataIndex: 'role', key: 'role', ...getColumnSearchProps('role') },
        {
            title: 'Division',
            dataIndex: 'id',
            key: 'division',
            render: userId => {
                const divisionUser = divisionUsers.find(du => du.user === userId);
                const division = divisions.find(div => div.division_id === (divisionUser?.division || ''));
                return division ? division.name : '';
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
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => showModal()}>Add User</Button>
                <Select
                    placeholder="Filter by role"
                    onChange={handleRoleFilterChange}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="Admin">Admin</Option>
                    <Option value="User">User</Option>
                    <Option value="Client">Client</Option>
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredUsers}
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
                    <Form.Item name="password" label="Password" rules={[{ required: !editMode }]}>
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
