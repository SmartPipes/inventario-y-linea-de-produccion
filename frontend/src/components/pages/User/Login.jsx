import React from 'react';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Button, Typography, Checkbox, Form, Input, Layout } from 'antd';
const { Text } = Typography;
import LoginImg from '../../../assets/Login.jpg';
const { Content } = Layout;
const { Item: FormItem } = Form;
import { LoginStyle } from '../../../Styled/Global.styled';

export const Login = (credentials) => {
  return (
    <>
    <LoginStyle/>
    <Content
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#E2FBD7', 
      }}
    >
      <Card hoverable style={{ width: 820 }} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={LoginImg} style={{ display: 'block', width: 400 }} />
          <div style={{ padding: 32 }}>
            <Typography.Title level={2} style={{ marginRight: '170px' }}>
              Login
            </Typography.Title>
            <Form
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 8 }}
              style={{ width: 800 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <FormItem
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 3, span: 16 }}
              >
                <Checkbox>Remember me</Checkbox>
              </FormItem>
            </Form>
            <Button>
              Access <FontAwesomeIcon icon={faRightToBracket} />
            </Button>
          </div>
        </div>
      </Card>
    </Content>
    </>
  );
};
