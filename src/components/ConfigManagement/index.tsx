import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Button, Tag, Statistic } from 'antd';
import { PieChartOutlined, SearchOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import styles from './index.module.less';

interface ConfigStatistics {
  totalConfigs: number;
  normalConfigs: number;
  warningConfigs: number;
  errorConfigs: number;
}

interface ConfigData {
  key: string;
  id: string;
  name: string;
  march: string;
  marchWarning: string;
  april: string;
  aprilWarning: string;
  totalDelivery: string;
  upgradeDelivery: string;
  lastDeliveryTime: string;
  deliveryStatus: string;
  failureTime: string;
}

const ConfigManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<ConfigStatistics>({
    totalConfigs: 1570,
    normalConfigs: 671,
    warningConfigs: 263,
    errorConfigs: 636
  });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<ConfigData[]>([]);

  useEffect(() => {
    // 模拟加载数据
    setLoading(true);
    const mockData: ConfigData[] = Array(20).fill(null).map((_, index) => ({
      key: (index + 1).toString(),
      id: (index + 1).toString(),
      name: `上海站${index + 1}`,
      march: '12,123',
      marchWarning: '文字内容',
      april: '12,123',
      aprilWarning: '文字内容',
      totalDelivery: '12,123',
      upgradeDelivery: '文字内容',
      lastDeliveryTime: '12,123',
      deliveryStatus: '文字内容',
      failureTime: '文字内容',
    }));
    setData(mockData);
    setLoading(false);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = data.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '3月基线',
      dataIndex: 'march',
      key: 'march',
      width: 100,
    },
    {
      title: '3月预警情况',
      dataIndex: 'marchWarning',
      key: 'marchWarning',
      width: 120,
      render: (text: string) => (
        <Tag color={text === '文字内容' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: '4月基线',
      dataIndex: 'april',
      key: 'april',
      width: 100,
    },
    {
      title: '4月预警情况',
      dataIndex: 'aprilWarning',
      key: 'aprilWarning',
      width: 120,
      render: (text: string) => (
        <Tag color={text === '文字内容' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: '累计升级送达',
      dataIndex: 'totalDelivery',
      key: 'totalDelivery',
      width: 120,
    },
    {
      title: '升级送达状态',
      dataIndex: 'upgradeDelivery',
      key: 'upgradeDelivery',
      width: 120,
      render: (text: string) => (
        <Tag color={text === '文字内容' ? 'blue' : 'orange'}>{text}</Tag>
      ),
    },
    {
      title: '最后送达时间',
      dataIndex: 'lastDeliveryTime',
      key: 'lastDeliveryTime',
      width: 150,
    },
    {
      title: '送达状态判例',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 120,
    },
    {
      title: '生效时间',
      dataIndex: 'failureTime',
      key: 'failureTime',
      width: 150,
    },
  ];

  return (
    <div className={styles['config-management']}>
      <h2>共配治理</h2>
      
      <Row gutter={[16, 16]} className={styles['statistics-row']}>
        <Col span={6}>
          <Card>
            <Statistic
              title="治理项总数"
              value={statistics.totalConfigs}
              prefix={<PieChartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常配点"
              value={statistics.normalConfigs}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预警配点"
              value={statistics.warningConfigs}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常配点"
              value={statistics.errorConfigs}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <div className={styles['table-operations']}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input.Search
              placeholder="请输入商品名称"
              style={{ width: 200 }}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col>
            <Button type="primary">导出</Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          total: data.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default ConfigManagement; 