import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { Line, Pie, Radar } from '@ant-design/plots';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // 模拟数据
  const salesData = [
    { date: '2024-01', sales: 3500 },
    { date: '2024-02', sales: 4200 },
    { date: '2024-03', sales: 3800 },
    { date: '2024-04', sales: 5000 },
    { date: '2024-05', sales: 4800 },
    { date: '2024-06', sales: 6000 },
  ];

  const categoryData = [
    { type: 'Fish', value: 45 },
    { type: 'Shellfish', value: 30 },
    { type: 'Crustaceans', value: 15 },
    { type: 'Other', value: 10 },
  ];

  const performanceData = [
    { item: 'Sales Growth', score: 80 },
    { item: 'Customer Satisfaction', score: 90 },
    { item: 'Delivery Speed', score: 85 },
    { item: 'Product Quality', score: 95 },
    { item: 'Supplier Relations', score: 88 },
  ];

  const lineConfig = {
    data: salesData,
    xField: 'date',
    yField: 'sales',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const pieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      autoRotate: false,
      formatter: (text: string, item: { value: number; type: string } | undefined, idx: number) => {
        const sum = categoryData.reduce((acc, cur) => acc + cur.value, 0);
        const percent = ((item?.value || 0) / sum * 100).toFixed(1);
        return `${item?.type || ''}\n${percent}%`;
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'bottom',
      layout: 'horizontal',
    },
    interactions: [{ type: 'element-active' }],
  };

  const radarConfig = {
    data: performanceData,
    xField: 'item',
    yField: 'score',
    meta: {
      score: {
        min: 0,
        max: 100,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
    },
    area: {},
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card className="dashboard-card">
            <Statistic
              className="dashboard-statistic"
              title="Total Orders"
              value={2851}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="dashboard-card">
            <Statistic
              className="dashboard-statistic"
              title="Active Users"
              value={1280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="dashboard-card">
            <Statistic
              className="dashboard-statistic"
              title="Total Revenue"
              value={289500}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Sales Trend" className="dashboard-card">
            <div className="dashboard-chart">
              <Line {...lineConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Product Category Distribution" className="dashboard-card">
            <div className="dashboard-chart">
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="Performance Metrics" className="dashboard-card">
            <div className="dashboard-chart">
              <Radar {...radarConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 