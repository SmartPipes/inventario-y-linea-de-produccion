import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import backgroundImage from '../../../../public/BackGround.jpg';
import { login, apiClient } from '../../../ApiClient';
import { useNavigate } from 'react-router-dom';
import { API_URL_USERS } from '../Config';
import '../../../Styled/Login.styled.css';

const { Title, Paragraph } = Typography;

const Login = ({ setToken, setUserRole, setUserName }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const getUserInfo = async (email) => {
    try {
      const response = await apiClient.get(API_URL_USERS);
      // Encuentra el usuario actual en la lista
      const currentUser = response.data.find(user => user.email === email);
      return currentUser;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const handleLogin = async (values) => {
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
            message.success('Inicio de sesión exitoso!');
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('user_role', userInfo.role);
            localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
            setToken(response.access);
            setUserRole(userInfo.role);
            setUserName(`${userInfo.first_name} ${userInfo.last_name}`);
            navigate('/home');
          } else {
            message.error('Solo los usuarios con rol de Client pueden iniciar sesión.');
            setToken(null);
            setUserRole(null);
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

  const handleRegister = async (values) => {
    const newUser = {
      ...values,
      is_active: true,
      user_permissions: [
        133, 134, 135, 136, 137, 138, 139, 140, 129, 130,
        131, 132, 141, 142, 143, 144, 145, 146, 147, 148
      ],
      is_staff: false,
      is_superuser: false,
      role: 'Client',
      status: 'Active'
    };

    try {
      await apiClient.post(API_URL_USERS, newUser);
      message.success('Registro exitoso! Ahora puedes iniciar sesión.');
      setIsFlipped(false);
    } catch (error) {
      console.error('Error during registration:', error);
      message.error('Error en el registro. Por favor, intenta nuevamente.');
    }
  };

  const onLoginFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
    message.error('Error en el inicio de sesión. Por favor, revisa tus credenciales.');
  };

  const onRegisterFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
    message.error('Error en el registro. Por favor, revisa los datos ingresados.');
  };

  return (
    <div
      className={`login-register-container ${isFlipped ? 'flipped' : ''}`}
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
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
      />
      <div className="card-wrapper">
        <Card
          className="card-side front"
          title={<Title level={2} style={{ color: '#fff' }}>{!isFlipped ? 'Bienvenido Client' : ''}</Title>}
          style={{
            width: 400,
            borderRadius: 20,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            textAlign: 'center',
            zIndex: 1,
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
          }}
        >
          {!isFlipped && (
            <Paragraph style={{ color: '#fff' }}>
              Por favor, inicia sesión con tu correo electrónico y contraseña para continuar.
            </Paragraph>
          )}
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            onFinishFailed={onLoginFinishFailed}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor, introduce tu correo electrónico!' },
                { type: 'email', message: 'El correo electrónico no es válido!' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Correo Electrónico" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, introduce tu contraseña!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Iniciar Sesión
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => setIsFlipped(true)} style={{ width: '100%', padding: '10px 0', fontSize: '14px', color: '#fff' }}>
                ¿No tienes cuenta? ¡Regístrate ahora!
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          className="card-side back"
          title={<Title level={2} style={{ color: '#fff' }}>Registrarse</Title>}
          style={{
            width: 400,
            borderRadius: 20,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            textAlign: 'center',
            zIndex: 1,
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
          }}
        >
          <Paragraph style={{ color: '#fff' }}>
            Por favor, llena los siguientes campos para crear una cuenta.
          </Paragraph>
          <Form
            name="register"
            initialValues={{ remember: true }}
            onFinish={handleRegister}
            onFinishFailed={onRegisterFinishFailed}
          >
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: 'Por favor, introduce tu nombre!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nombre" />
            </Form.Item>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: 'Por favor, introduce tu apellido!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Apellido" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor, introduce tu correo electrónico!' },
                { type: 'email', message: 'El correo electrónico no es válido!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Correo Electrónico" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, introduce tu contraseña!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Por favor, introduce tu teléfono!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Teléfono" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Registrarse
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => setIsFlipped(false)} style={{ width: '100%', padding: '10px 0', fontSize: '14px', color: '#fff' }}>
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
