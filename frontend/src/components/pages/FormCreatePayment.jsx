import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Checkbox, message } from 'antd';
import { postPaymentMethod, getUserProfile } from '../../ApiClient'; // Asegúrate de que la ruta es correcta
import moment from 'moment';

const { Option } = Select;

const FormCreatePayment = ({ onClose }) => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userProfile = await getUserProfile();
        setUserId(userProfile.id); // O el campo adecuado según tu perfil de usuario
        form.setFieldsValue({ client_id: userProfile.id }); // Establece el valor inicial del campo client_id
      } catch (error) {
        message.error('Failed to fetch user ID.');
      }
    };

    fetchUserId();
  }, [form]);

  const handleSubmit = async (values) => {
    const { provider, account_number, expire_date, name_on_account, payment_type, is_default, client_id } = values;

    // Asegurarse de que userId esté disponible
    if (!userId) {
      message.error('User ID is not available.');
      return;
    }

    try {
      await postPaymentMethod({
        provider,
        account_number,
        expire_date: expire_date.format('YYYY-MM-DD'),
        name_on_account,
        payment_type,
        is_default,
        client_id: userId // Asegúrate de usar el userId en lugar del valor del campo client_id
      });
      message.success('Payment method added successfully.');
      onClose(); // Cerrar el modal si la petición es exitosa
    } catch (error) {
      message.error('Failed to create payment method.');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Add Payment Method</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="client_id"
            label="client id"
            rules={[{ required: true, message: 'Client ID is required.' }]}
            noStyle
          >
            <Input type="hidden" disabled value={userId || 'Fetching...'} />
          </Form.Item>

          <Form.Item
            name="payment_type"
            label="Payment Type"
            initialValue="Debit"
            rules={[{ required: true, message: 'Please select a payment type.' }]}
          >
            <Select placeholder="Select payment type">
              <Option value="Debito">Debit</Option>
              <Option value="Credito">Credit</Option>
              <Option value="PayPal">PayPal</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="provider"
            label="Provider"
            rules={[{ required: true, message: 'Provider cannot be blank.' }]}
          >
            <Input placeholder="Provider" />
          </Form.Item>

          <Form.Item
            name="account_number"
            label="Account Number"
            rules={[{ required: true, message: 'Account number cannot be blank.' }]}
          >
            <Input placeholder="Account Number" />
          </Form.Item>

          <Form.Item
            name="expire_date"
            label="Expire Date"
            rules={[{ required: true, message: 'Expire date is required.' }]}
          >
            <DatePicker format="YYYY-MM-DD" placeholder="Expire Date (YYYY-MM-DD)" />
          </Form.Item>

          <Form.Item
            name="name_on_account"
            label="Name on Account"
            rules={[{ required: true, message: 'Name on account cannot be blank.' }]}
          >
            <Input placeholder="Name on Account" />
          </Form.Item>

          <Form.Item
            name="is_default"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Set as Default</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button style={{ marginLeft: '8px' }} onClick={onClose}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormCreatePayment;
