import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Button, Tag, Statistic, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { getConfigList, getGovernanceData, getDeliveryData, exportConfigData } from '../../api/configApi';
import type { ConfigItem, ConfigStatistics, GovernanceData, DeliveryData } from '../../types/config';
import styles from './index.module.less';

const ConfigManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<ConfigStatistics>({
    totalConfigs: 0,
    normalConfigs: 0,
    warningConfigs: 0,
    errorConfigs: 0,
    deliveryCount: 0,
    deliveryRate: 0,
    upgradeRate: 0,
    monthlyChange: {
      configs: 0,
      delivery: 0,
      upgrade: 0
    }
  });
  const [governanceData, setGovernanceData] = useState<GovernanceData>({
    normal: 0,
    warning: 0,
    error: 0,
    others: 0
  });
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    delivered: 0,
    delivering: 0,
    undelivered: 0,
    others: 0
  });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<ConfigItem[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const response = await getConfigList({
        page: current || 1,
        pageSize: pageSize || 10,
        search: searchText
      });
      setData(response.data);
      setStatistics({
        ...response.statistics,
        monthlyChange: response.statistics.monthlyChange || {
          configs: 0,
          delivery: 0,
          upgrade: 0
        }
      });
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('获取配置数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const [governanceResponse, deliveryResponse] = await Promise.all([
        getGovernanceData(),
        getDeliveryData()
      ]);
      setGovernanceData(governanceResponse);
      setDeliveryData(deliveryResponse);
    } catch (error) {
      message.error('获取图表数据失败');
    }
  };

  useEffect(() => {
    fetchData();
    fetchChartData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ConfigItem> | SorterResult<ConfigItem>[]
  ) => {
    setPagination(newPagination);
    fetchData();
  };

  const handleExport = async () => {
    try {
      const blob = await exportConfigData({
        page: 1,
        pageSize: pagination.total || 0,
        search: searchText
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `配置管理数据_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('导出数据失败');
    }
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
        const dataMap = {
          '正常配点': governanceData.normal,
          '预警配点': governanceData.warning,
          '异常配点': governanceData.error,
          '其他配点': governanceData.others
        };
        return `${name}  ${dataMap[name as keyof typeof dataMap]}`;
      }
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '30%',
          top: '45%',
          style: {
            text: statistics?.totalConfigs?.toString() || '--',
            fontSize: 24,
            fontWeight: 'normal',
            fill: 'rgba(0,0,0,0.85)',
            textAlign: 'center'
          }
        },
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
          { value: governanceData.normal, name: '正常配点' },
          { value: governanceData.warning, name: '预警配点' },
          { value: governanceData.error, name: '异常配点' },
          { value: governanceData.others, name: '其他配点' }
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
        const dataMap = {
          '已送达': deliveryData.delivered,
          '送达中': deliveryData.delivering,
          '未送达': deliveryData.undelivered,
          '其他状态': deliveryData.others
        };
        return `${name}  ${dataMap[name as keyof typeof dataMap]}`;
      }
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '30%',
          top: '45%',
          style: {
            text: statistics?.totalConfigs?.toString() || '--',
            fontSize: 24,
            fontWeight: 'normal',
            fill: 'rgba(0,0,0,0.85)',
            textAlign: 'center'
          }
        },
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
          { value: deliveryData.delivered, name: '已送达' },
          { value: deliveryData.delivering, name: '送达中' },
          { value: deliveryData.undelivered, name: '未送达' },
          { value: deliveryData.others, name: '其他状态' }
        ]
      }
    ]
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: 'column-id',
      width: 240,
      fixed: 'left' as const,
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left' as const,
    },
    {
      title: '3月基线',
      dataIndex: 'marchBaseline',
      width: 100,
    },
    {
      title: '3月预警情况',
      dataIndex: 'marchWarning',
      width: 120,
      render: (text: string) => (
        text ? <Tag color="success">{text}</Tag> : '--'
      ),
    },
    {
      title: '4月基线',
      dataIndex: 'aprilBaseline',
      width: 100,
    },
    {
      title: '4月预警情况',
      dataIndex: 'aprilWarning',
      width: 120,
      render: (text: string) => (
        text ? <Tag color="success">{text}</Tag> : '--'
      ),
    },
    {
      title: '累计升级送达',
      dataIndex: 'totalDelivery',
      width: 120,
    },
    {
      title: '升级送达状态',
      dataIndex: 'upgradeDeliveryStatus',
      width: 120,
      render: (text: string) => (
        <Tag color="processing">{text}</Tag>
      ),
    },
    {
      title: '最后送达时间',
      dataIndex: 'lastDeliveryTime',
      width: 250,
      render: (text: string) => (
        moment(text).format('YYYY-MM-DD HH:mm:ss')
      ),
    },
    {
      title: '送达状态判例',
      dataIndex: 'deliveryStatus',
      width: 120,
      render: (text: string) => (
        <Tag color="geekblue">{text}</Tag>
      ),
    },
    {
      title: '生效时间',
      dataIndex: 'effectiveTime',
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
                    <div className={styles.subLabel}>
                      较上月 {statistics.monthlyChange.configs > 0 ? '+' : ''}{statistics.monthlyChange.configs}
                    </div>
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
                    <div className={styles.subLabel}>
                      较上月 {statistics.monthlyChange.delivery > 0 ? '+' : ''}{statistics.monthlyChange.delivery}
                    </div>
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
                suffix={
                  <span className={styles.trend}>
                    {statistics.monthlyChange.configs > 0 ? '+' : ''}{statistics.monthlyChange.configs}
                  </span>
                }
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="outlined" className={styles.statsCard}>
              <Statistic
                title="送达数"
                value={statistics.deliveryRate?.toFixed(0)}
                suffix={
                  <span className={styles.trend}>
                    {statistics.monthlyChange.delivery > 0 ? '+' : ''}{statistics.monthlyChange.delivery}
                  </span>
                }
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="outlined" className={styles.statsCard}>
              <Statistic
                title="升级送达"
                value={statistics.upgradeRate?.toFixed(0)}
                suffix={
                  <span className={styles.trend}>
                    {statistics.monthlyChange.upgrade > 0 ? '+' : ''}{statistics.monthlyChange.upgrade}
                  </span>
                }
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
          rowKey={(record) => record._id}
        />
      </Card>
    </div>
  );
};

export default ConfigManagement; 