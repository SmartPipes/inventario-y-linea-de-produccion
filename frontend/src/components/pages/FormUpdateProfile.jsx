import React from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import moment from 'moment';

const FormUpdateProfile = ({ visible, onCancel, onUpdate, initialValues }) => {
    const [form] = Form.useForm();

    // Set initial values
    React.useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                birthdate: initialValues.birthdate ? moment(initialValues.birthdate) : null,
                // Role and status are included but not shown in the form
                role: initialValues.role,
                status: initialValues.status,
            });
        }
    }, [initialValues, form]);

    const handleSubmit = (values) => {
        // Convert birthdate to the required format
        const payload = {
            ...values,
            birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : null,
            // Ensure role and status are included in the payload
            role: values.role,
            status: values.status,
            // Add password if provided
            password: values.password || undefined,
        };
        onUpdate(payload);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="birthdate"
                label="Birthdate"
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password (leave blank to keep current)"
            >
                <Input.Password />
            </Form.Item>

            {/* Hidden fields for role and status */}
            <Form.Item name="role" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="status" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update
                </Button>
                <Button style={{ marginLeft: '8px' }} onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormUpdateProfile;
