import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Alert } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  IeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/plots';
import { getUserStatistics } from '../../api/usersApi';
import { getProductStatistics } from '../../api/productsApi';
import { getOrderStatistics } from '../../api/ordersApi';
import { UserStatistics } from '../../types';

interface ProductStatistics {
  totalProducts: number;
  totalStock: number;
  averagePrice: number;
}

interface OrderStatistics {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

interface PieDataItem {
  type: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStatistics>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });

  const [productStats, setProductStats] = useState<ProductStatistics>({
    totalProducts: 0,
    totalStock: 0,
    averagePrice: 0,
  });

  const [orderStats, setOrderStats] = useState<OrderStatistics>({
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 用户数据转换为饼图数据
  const userPieData = [
    { type: 'Admin Users', value: userStats.adminUsers },
    { type: 'Regular Users', value: userStats.regularUsers },
  ];

  // 商品数据转换为柱形图数据
  const productBarData = [
    { type: 'Total Products', value: productStats.totalProducts },
    { type: 'Total Stock', value: productStats.totalStock },
    { type: 'Average Price', value: productStats.averagePrice },
  ];

  // 订单数据转换为折线图数据（模拟历史数据）
  const orderLineData = [
    { month: 'Jan', orders: Math.floor(orderStats.totalOrders * 0.7) },
    { month: 'Feb', orders: Math.floor(orderStats.totalOrders * 0.8) },
    { month: 'Mar', orders: Math.floor(orderStats.totalOrders * 0.9) },
    { month: 'Apr', orders: Math.floor(orderStats.totalOrders * 0.85) },
    { month: 'May', orders: Math.floor(orderStats.totalOrders * 0.95) },
    { month: 'Jun', orders: orderStats.totalOrders },
  ];

  const fetchAllStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [users, products, orders] = await Promise.all([
        getUserStatistics(),
        getProductStatistics(),
        getOrderStatistics(),
      ]);

      setUserStats(users);
      setProductStats(products);
      setOrderStats(orders);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStatistics();
    // 设置定时刷新，每分钟更新一次数据
    const interval = setInterval(fetchAllStatistics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // 饼图配置
  const pieConfig = {
    data: userPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      formatter: (datum: PieDataItem) => {
        if (!datum || !userStats.totalUsers) return '';
        return `${datum.type}: ${((datum.value / userStats.totalUsers) * 100).toFixed(1)}%`;
      },
      autoRotate: true,
    },
    legend: {
      position: 'bottom',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 柱形图配置
  const columnConfig = {
    data: productBarData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'top',
    },
    color: '#1890ff',
  };

  // 折线图配置
  const lineConfig = {
    data: orderLineData,
    xField: 'month',
    yField: 'orders',
    smooth: true,
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2
      }
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* 统计卡片行 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={userStats.totalUsers}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Products"
              value={productStats.totalProducts}
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={orderStats.totalRevenue}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              precision={2}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表行 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        {/* 用户饼图 */}
        <Col span={8}>
          <Card title="User Distribution" loading={loading}>
            <div style={{ height: 300 }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
        
        {/* 商品柱形图 */}
        <Col span={8}>
          <Card title="Product Statistics" loading={loading}>
            <div style={{ height: 300 }}>
              <Column {...columnConfig} />
            </div>
          </Card>
        </Col>
        
        {/* 订单折线图 */}
        <Col span={8}>
          <Card title="Order Trends" loading={loading}>
            <div style={{ height: 300 }}>
              <Line {...lineConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 