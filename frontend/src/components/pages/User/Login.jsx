import React from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import backgroundImage from '../../../../public/BackGround.jpg';
import { login, apiClient } from '../../../ApiClient';
import { useNavigate } from 'react-router-dom';
import { API_URL_USERS } from '../Config';

const { Title, Paragraph } = Typography;

const Login = ({ setToken, setUserRole, setUserName }) => {
  const navigate = useNavigate();

  const getUserInfo = async (email) => {
    try {
      const response = await apiClient.get(API_URL_USERS);
      const currentUser = response.data.find(user => user.email === email);
      return currentUser;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    try {
      console.log('Attempting login with values:', values);
      const response = await login(values.email, values.password);

      console.log('Response received:', response);
      if (response.access) {
        // Fetch user info after login
        const userInfo = await getUserInfo(values.email);
        console.log('User Info:', userInfo);

        if (userInfo && userInfo.role) {
          console.log('User role:', userInfo.role);
          if (userInfo.role === 'Client') {
            message.error('Rol de usuario no Permitido.');
            navigate('/login');
          } else {
            message.success('Inicio de sesión exitoso!');
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('user_role', userInfo.role);
            localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
            setToken(response.access);
            setUserRole(userInfo.role);
            setUserName(`${userInfo.first_name} ${userInfo.last_name}`);
            navigate('/home');
          }
        } else {
          message.error('Información de usuario no disponible.');
        }
      } else {
        message.error('Error en el inicio de sesión. Por favor, revisa tus credenciales.');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error en el inicio de sesión. Por favor, intenta nuevamente más tarde.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Error en el inicio de sesión. Por favor, revisa tus credenciales.');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)',
        }}
      />
      <Card
        title={<Title level={2} style={{ color: '#fff' }}>Welcome Admin</Title>}
        style={{
          width: 400,
          borderRadius: 10,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.0)',
          padding: '30px',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Paragraph style={{ color: '#fff' }}>
        Please log in with your email and password to continue.
        </Paragraph>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor, introduce tu correo electrónico!' },
              { type: 'email', message: 'El correo electrónico no es válido!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, introduce tu contraseña!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Iniciar Sesión
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" style={{ width: '100%', padding: '10px 0', fontSize: '14px', color: '#fff' }}>
              ¿Olvidaste tu contraseña?
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
