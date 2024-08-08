import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import {
  BarChart, LineChart, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, Bar, Line,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import { apiClient } from '../../ApiClient';
import { API_URL_PRO_ORDERS, API_URL_INV, API_URL_DELIVERY_SALES, API_URL_DELIVERY_ORDERS, API_URL_USERS, API_URL_INVENTORYSUM } from './Config';
import { FaCogs, FaBoxes, FaDollarSign, FaTruck } from 'react-icons/fa';
import '../../Styled/Dashboard.css'; // Importar estilos adicionales

const { Title } = Typography;

export const Home = React.memo(() => {
  const [productionData, setProductionData] = useState([]);
  const [completedProductionCount, setCompletedProductionCount] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [inventorySum, setInventorySum] = useState(0);
  const [loading, setLoading] = useState(true);

  const colors = useMemo(() => ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'], []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productionResp, inventoryResp, salesResp, deliveryResp, usersResp, inventorySumResp] = await Promise.all([
          apiClient.get(API_URL_PRO_ORDERS),
          apiClient.get(API_URL_INV),
          apiClient.get(API_URL_DELIVERY_SALES),
          apiClient.get(API_URL_DELIVERY_ORDERS),
          apiClient.get(API_URL_USERS),
          apiClient.get(API_URL_INVENTORYSUM)
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
        const completedCount = productionResp.data.filter(item => item.status === 'Completed').length;

        const adaptedInventoryData = inventoryResp.data.map(item => ({
          name: item.item_type,
          value: Math.max(parseInt(item.stock) || 0, 0)
        }));

        const adaptedSalesData = salesResp.data.map(sale => ({
          name: `Venta ${sale.sale_id}`,
          value: parseFloat(sale.total),
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

        const totalInventorySum = inventorySumResp.data.reduce((acc, item) => acc + item.total_stock, 0);

        setProductionData(productionStats);
        setCompletedProductionCount(completedCount);
        setInventoryData(adaptedInventoryData);
        setSalesData(adaptedSalesData);
        setDeliveryData(deliveryStats);
        setUsersData(adaptedUsersData);
        setInventorySum(totalInventorySum);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = useMemo(() => salesData.reduce((acc, sale) => acc + sale.value, 0), [salesData]);

  const usersByRole = usersData.reduce((acc, user) => {
    const role = user.category;
    if (!acc[role]) {
      acc[role] = { role, count: 0 };
    }
    acc[role].count += 1;
    return acc;
  }, {});
  const usersByRoleData = Object.values(usersByRole);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="glass-card green-card">
            <Title level={4} className="card-title">
              <FaCogs style={{ marginRight: '8px'}} />
              Total Production
            </Title>
            <p className="card-value">Completed: {completedProductionCount}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="glass-card blue-card">
            <Title level={4} className="card-title">
              <FaBoxes style={{ marginRight: '8px' }} />
              Total Stock Inventory
            </Title>
            <p className="card-value">{inventorySum} units</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="glass-card yellow-card">
            <Title level={4} className="card-title">
              <FaDollarSign style={{ marginRight: '8px' }} />
              Sales Profits
            </Title>
            <p className="card-value">${totalSales}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="glass-card red-card">
            <Title level={4} className="card-title">
              <FaTruck style={{ marginRight: '8px' }} />
              Deliveries made
            </Title>
            <p className="card-value">{deliveryData.length} Deliveries</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Product stock when first entering inventory" bordered={false} className="glass-card">
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
        <Col xs={24} md={12}>
          <Card title="Production Statistics" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="rgba(31, 94, 34, 0.608)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Delivery Statistics" bordered={false} className="glass-card">
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
        <Col xs={24} md={12}>
          <Card title="Total Sales and Benefits" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" stackId="a" fill="rgba(46, 112, 49, 0.52)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24}>
          <Card title="Active Users" bordered={false} className="glass-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="rgba(2, 128, 8, 0.2)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Home;
