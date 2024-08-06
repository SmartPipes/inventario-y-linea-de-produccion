import React from 'react';
import { Form, Input, Button, message } from 'antd';
import moment from 'moment';

const FormUpdateAddress = ({ visible, onCancel, onUpdate, initialValues }) => {
    const [form] = Form.useForm();

    // Set initial values
    React.useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                address: initialValues.address || '',
                // Convert birthdate to moment object
                birthdate: initialValues.birthdate ? moment(initialValues.birthdate) : null,
                // Include other fields, but they are hidden in the form
                first_name: initialValues.first_name,
                last_name: initialValues.last_name,
                email: initialValues.email,
                phone: initialValues.phone,
                role: initialValues.role,
                status: initialValues.status,
                password: initialValues.password,
            });
        }
    }, [initialValues, form]);

    const handleSubmit = (values) => {
        const payload = {
            ...values,
            // Ensure all fields are included in the payload, including hidden ones
            address: values.address,
            first_name: values.first_name,
            last_name: values.last_name,
            birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : null,
            email: values.email,
            phone: values.phone,
            role: values.role,
            status: values.status,
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
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please input your address!' }]}
            >
                <Input.TextArea />
            </Form.Item>

            {/* Hidden fields */}
            <Form.Item name="first_name" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="last_name" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="birthdate" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="email" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="phone" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="role" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="status" noStyle>
                <Input type="hidden" disabled/>
            </Form.Item>
            <Form.Item name="password" noStyle>
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

export default FormUpdateAddress;
