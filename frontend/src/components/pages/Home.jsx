import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import {
  BarChart, LineChart, PieChart, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import { apiClient } from '../../ApiClient';
import { API_URL_PRO_ORDERS, API_URL_INV, API_URL_DELIVERY_SALES, API_URL_DELIVERY_ORDERS, API_URL_USERS } from './Config';
import { FaCogs, FaBoxes, FaDollarSign, FaTruck } from 'react-icons/fa';
import '../../Styled/Dashboard.css'; // Importar estilos adicionales

const { Title } = Typography;

export const Home = React.memo(() => {
  const [productionData, setProductionData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = useMemo(() => ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'], []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productionResp, inventoryResp, salesResp, deliveryResp, usersResp] = await Promise.all([
          apiClient.get(API_URL_PRO_ORDERS),
          apiClient.get(API_URL_INV),
          apiClient.get(API_URL_DELIVERY_SALES),
          apiClient.get(API_URL_DELIVERY_ORDERS),
          apiClient.get(API_URL_USERS)
        ]);

        const adaptedProductionData = productionResp.data.reduce((acc, item) => {
          const statusKey = item.status || 'Unknown';
          if (!acc[statusKey]) {
            acc[statusKey] = { name: statusKey, value: 0 };
          }
          acc[statusKey].value += 1;
          return acc;
        }, {});
        const productionStats = Object.values(adaptedProductionData);

        const adaptedInventoryData = inventoryResp.data.map(item => ({
          name: item.item_type,
          value: Math.max(parseInt(item.stock) || 0, 0)
        }));

        const adaptedSalesData = salesResp.data.map(sale => ({
          name: `Venta ${sale.sale_id}`,
          value: parseFloat(sale.total)
        }));

        const adaptedDeliveryData = deliveryResp.data.reduce((acc, delivery) => {
          const dateKey = delivery.delivery_date.split('T')[0];
          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, total: 0 };
          }
          acc[dateKey].total += 1;
          return acc;
        }, {});
        const deliveryStats = Object.values(adaptedDeliveryData);

        const adaptedUsersData = usersResp.data.map(user => ({
          category: user.role,
          activeUsers: 1
        }));

        setProductionData(productionStats);
        setInventoryData(adaptedInventoryData);
        setSalesData(adaptedSalesData);
        setDeliveryData(deliveryStats);
        setUsersData(adaptedUsersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = useMemo(() => salesData.reduce((acc, sale) => acc + sale.value, 0), [salesData]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="dashboard-container">
      {/*<Title level={2} className="dashboard-title">Dashboard - Smart Pipes</Title>*/}
      <Row gutter={16}>
        <Col span={6}>
          <Card hoverable className="glass-card green-card">
            <Title level={4} className="card-title">
              <FaCogs style={{ marginRight: '8px'}} />
              Total Producción
            </Title>
            <p className="card-value">{productionData.length} órdenes</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="glass-card blue-card">
            <Title level={4} className="card-title">
              <FaBoxes style={{ marginRight: '8px' }} />
              Inventario Total
            </Title>
            <p className="card-value">{inventoryData.length} items</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="glass-card yellow-card">
            <Title level={4} className="card-title">
              <FaDollarSign style={{ marginRight: '8px' }} />
              Ventas Ganadas
            </Title>
            <p className="card-value">${totalSales}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="glass-card red-card">
            <Title level={4} className="card-title">
              <FaTruck style={{ marginRight: '8px' }} />
              Entregas Realizadas
            </Title>
            <p className="card-value">{deliveryData.length} entregas</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Inventario" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3a6351" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Estadísticas de Producción" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3a6351" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Estadísticas de Entregas" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={deliveryData}>
                <defs>
                  <linearGradient id="colorDeliv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3a6351" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3a6351" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 'dataMax']} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#3a6351" fillOpacity={1} fill="url(#colorDeliv)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Ventas Totales" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={salesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#3a6351">
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Usuarios Activos" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeUsers" fill="#3a6351" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Home;
