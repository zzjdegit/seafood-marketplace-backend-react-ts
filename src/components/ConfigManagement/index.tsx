import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Button, Tag, Statistic } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.less';

interface ConfigStatistics {
  totalConfigs: number;
  normalConfigs: number;
  warningConfigs: number;
  errorConfigs: number;
  deliveryCount: number;
  deliveryRate: number;
  upgradeRate: number;
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
    totalConfigs: 980,
    normalConfigs: 671,
    warningConfigs: 263,
    errorConfigs: 636,
    deliveryCount: 123456,
    deliveryRate: 123456,
    upgradeRate: 0.01
  });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<ConfigData[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  });

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
    setPagination(prev => ({ ...prev, total: mockData.length }));
    setLoading(false);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    // 实现搜索逻辑
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ConfigData> | SorterResult<ConfigData>[]
  ) => {
    setPagination(pagination);
    // 实现表格变化逻辑
  };

  const handleExport = () => {
    // 实现导出逻辑
  };

  const getGovernancePieOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 10,
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      textStyle: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.65)'
      },
      formatter: (name: string) => {
        const data = [
          { name: '正常配点', value: 471 },
          { name: '预警配点', value: 263 },
          { name: '异常配点', value: 636 },
          { name: '其他配点', value: 200 }
        ];
        const item = data.find(item => item.name === name);
        return `${name}  ${item?.value}`;
      }
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '30%',
          top: '45%',
          style: {
            text: '980',
            fontSize: 24,
            fontWeight: 'normal',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'rgba(0,0,0,0.85)',
            textAlign: 'center'
          }
        },
        {
          type: 'text',
          left: '33%',
          top: '65%',
          style: {
            text: '总数',
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(0,0,0,0.45)',
            textAlign: 'center'
          }
        }
      ]
    },
    color: ['#52C41A', '#FAAD14', '#FF4D4F', '#1890FF'],
    series: [
      {
        name: '治理评估',
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 471, name: '正常配点' },
          { value: 263, name: '预警配点' },
          { value: 636, name: '异常配点' },
          { value: 200, name: '其他配点' }
        ]
      }
    ]
  });

  const getDeliveryPieOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 10,
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 8,
      textStyle: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.65)'
      },
      formatter: (name: string) => {
        const data = [
          { name: '已送达', value: 471 },
          { name: '送达中', value: 263 },
          { name: '未送达', value: 636 },
          { name: '其他状态', value: 200 }
        ];
        const item = data.find(item => item.name === name);
        return `${name}  ${item?.value}`;
      }
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '30%',
          top: '45%',
          style: {
            text: '980',
            fontSize: 24,
            fontWeight: 'normal',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'rgba(0,0,0,0.85)',
            textAlign: 'center'
          }
        },
        {
          type: 'text',
          left: '33%',
          top: '65%',
          style: {
            text: '总数',
            fontSize: 12,
            fontWeight: 'normal',
            fill: 'rgba(0,0,0,0.45)',
            textAlign: 'center'
          }
        }
      ]
    },
    color: ['#52C41A', '#FAAD14', '#FF4D4F', '#1890FF'],
    series: [
      {
        name: '配送评估',
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 471, name: '已送达' },
          { value: 263, name: '送达中' },
          { value: 636, name: '未送达' },
          { value: 200, name: '其他状态' }
        ]
      }
    ]
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 80,
      fixed: 'left' as const,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left' as const,
    },
    {
      title: '3月基线',
      dataIndex: 'march',
      width: 100,
    },
    {
      title: '3月预警情况',
      dataIndex: 'marchWarning',
      width: 120,
      render: (text: string) => (
        <Tag color="success">{text}</Tag>
      ),
    },
    {
      title: '4月基线',
      dataIndex: 'april',
      width: 100,
    },
    {
      title: '4月预警情况',
      dataIndex: 'aprilWarning',
      width: 120,
      render: (text: string) => (
        <Tag color="success">{text}</Tag>
      ),
    },
    {
      title: '累计升级送达',
      dataIndex: 'totalDelivery',
      width: 120,
    },
    {
      title: '升级送达状态',
      dataIndex: 'upgradeDelivery',
      width: 120,
      render: (text: string) => (
        <Tag color="processing">{text}</Tag>
      ),
    },
    {
      title: '最后送达时间',
      dataIndex: 'lastDeliveryTime',
      width: 150,
    },
    {
      title: '送达状态判例',
      dataIndex: 'deliveryStatus',
      width: 120,
    },
    {
      title: '生效时间',
      dataIndex: 'failureTime',
      width: 150,
    },
  ];

  return (
    <div className={styles.configManagement}>
      <div className={styles.overviewSection}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card variant="outlined" className={styles.overviewCard}>
              <div className={styles.cardTitle}>治理评估（三月基线运营情况分析）</div>
              <div className={styles.cardContent}>
                <div className={styles.mainStats}>
                  <div className={styles.number}>{statistics.totalConfigs}</div>
                  <div className={styles.label}>
                    <div>治理评估点数</div>
                    <div className={styles.subLabel}>较上月 -2 -3 -4</div>
                  </div>
                </div>
                <div className={styles.pieChart}>
                  <ReactECharts
                    option={getGovernancePieOption()}
                    style={{ height: 160, width: 330 }}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card variant="outlined" className={styles.overviewCard}>
              <div className={styles.cardTitle}>配送评估（三月月度调整点升级送达分析）</div>
              <div className={styles.cardContent}>
                <div className={styles.mainStats}>
                  <div className={styles.number}>{statistics.totalConfigs}</div>
                  <div className={styles.label}>
                    <div>治理评估点数</div>
                    <div className={styles.subLabel}>较上月 -2 -3 -4</div>
                  </div>
                </div>
                <div className={styles.pieChart}>
                  <ReactECharts
                    option={getDeliveryPieOption()}
                    style={{ height: 160, width: 330 }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card variant="outlined" className={styles.statsCard}>
              <Statistic
                title="治理数"
                value={statistics.deliveryCount}
                suffix={<span className={styles.trend}>+1.23</span>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="outlined" className={styles.statsCard}>
              <Statistic
                title="送达数"
                value={statistics.deliveryRate}
                suffix={<span className={styles.trend}>+1.23</span>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="outlined" className={styles.statsCard}>
              <Statistic
                title="升级送达"
                value={statistics.upgradeRate}
                suffix={<span className={styles.trend}>+1.23</span>}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card variant="outlined" style={{ marginTop: 24 }}>
        <div className={styles.tableOperations}>
          <Row justify="space-between" align="middle">
            <Col>
              <Input.Search
                placeholder="请输入商品名称"
                style={{ width: 300 }}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
                size="large"
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                size="large"
              >
                导出
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default ConfigManagement; 