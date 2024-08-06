import React from 'react';
import { Form, Input, Button, DatePicker, Checkbox } from 'antd';
import moment from 'moment';

const FormUpdatePayment = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        expire_date: initialValues.expire_date ? moment(initialValues.expire_date) : null,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      expire_date: values.expire_date ? values.expire_date.format('YYYY-MM-DD') : null,
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
        name="payment_type"
        label="Payment Type"
        rules={[{ required: true, message: 'Please input the payment type!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="provider"
        label="Provider"
        rules={[{ required: true, message: 'Please input the provider!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="account_number"
        label="Account Number"
        rules={[{ required: true, message: 'Please input the account number!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="expire_date"
        label="Expire Date"
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="name_on_account"
        label="Name on Account"
        rules={[{ required: true, message: 'Please input the name on account!' }]}
      >
        <Input />
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
            Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormUpdatePayment;
