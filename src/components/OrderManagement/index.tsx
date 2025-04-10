import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Button, 
    Input, 
    Space, 
    Modal, 
    Form, 
    InputNumber, 
    Select, 
    message, 
    Popconfirm,
    Card,
    Row,
    Col,
    Statistic,
    Tag
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    SearchOutlined,
    ShoppingOutlined,
    DollarOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { createOrder, deleteOrder, getOrders, updateOrder, getOrderStatistics } from '../../api/ordersApi';
import { Order, Product } from '../../types';
import { getProducts } from '../../api/productsApi';
import { OrderStatus, OrderStatusCN } from '../../types/enums';
import { TablePaginationConfig, FilterValue, SorterResult } from 'antd/lib/table/interface';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<{
        current: number;
        pageSize: number;
        total: number;
    }>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [statistics, setStatistics] = useState({
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
    });

    const [form] = Form.useForm();

    const fetchOrders = async (
        page = 1,
        pageSize = 10,
        search = '',
        status = '',
        sortField = 'createdAt',
        sortOrder: 'ascend' | 'descend' | null = null
    ) => {
        try {
            setLoading(true);
            const response = await getOrders({
                page,
                pageSize,
                search,
                status,
                sortField,
                sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : '1',
            });
            setOrders(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.total,
            });
        } catch (error) {
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProducts({
                page: 1,
                pageSize: 100,
                search: '',
            });
            setProducts(response.data);
        } catch (error) {
            message.error('Failed to fetch products');
        }
    };

    const fetchStatistics = async () => {
        try {
            const stats = await getOrderStatistics();
            setStatistics(stats);
        } catch (error) {
            message.error('Failed to fetch order statistics');
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchStatistics();
    }, []);

    const handleTableChange = async (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Order> | SorterResult<Order>[],
    ) => {
        // Get sort field and order
        const sortField = Array.isArray(sorter) ? sorter[0]?.field : sorter?.field;
        const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

        // Get status filter - now supports multiple values
        const status = filters['column-status'] as string[] || [];

        setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0
        });
        setCurrentStatus(status.join(','));
        
        try {
          const ordersData = await getOrders({
            page: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            search: searchText,
            status: status.join(','),
            sortField: sortField as string,
            sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : '1',
          });
          
          setOrders(ordersData.data);
          setPagination(prev => ({
              ...prev,
              total: ordersData.total
          }));
        } catch (error) {
            message.error('Failed to fetch data');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchOrders(1, pagination.pageSize, value, currentStatus);
    };

    const showModal = (order?: Order & { productId?: string }) => {
        if (order) {
            setEditingOrder(order);
            form.setFieldsValue(order);
        } else {
            setEditingOrder(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const selectedProduct = products.find(p => p.id === values.productId);
            
            if (!selectedProduct) {
                message.error('Product not found');
                return;
            }

            const totalPrice = selectedProduct.price * values.quantity;

            if (editingOrder) {
                await updateOrder(editingOrder.id, { ...values, totalPrice });
                message.success('Order updated successfully');
            } else {
                await createOrder({ ...values, totalPrice });
                message.success('Order created successfully');
            }
            setModalVisible(false);
            await Promise.all([
                fetchOrders(pagination.current, pagination.pageSize, searchText, currentStatus),
                fetchStatistics()
            ]);
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            message.error('Invalid order ID');
            return;
        }
        try {
            await deleteOrder(id);
            message.success('Order deleted successfully');
            await Promise.all([
                fetchOrders(pagination.current, pagination.pageSize, searchText, currentStatus),
                fetchStatistics()
            ]);
        } catch (error) {
            message.error('Failed to delete order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'canceled':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'column-id',
            width: 160,
            ellipsis: true,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'column-product',
            width: 250,
            render: (product: Product) => {
                return `${product.name} - ${product.price}`;
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'column-quantity',
            width: 100,
            align: 'right' as const,
            sorter: true,
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'column-price',
            width: 100,
            align: 'right' as const,
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'column-status',
            width: 80,
            filters: [
                { text: OrderStatusCN.PENDING, value: OrderStatus.PENDING },
                { text: OrderStatusCN.PROCESSING, value: OrderStatus.PROCESSING },
                { text: OrderStatusCN.COMPLETED, value: OrderStatus.COMPLETED },
                { text: OrderStatusCN.CANCELLED, value: OrderStatus.CANCELLED },
            ],
            render: (status: string) => {
                const key = status.toLocaleUpperCase() as keyof typeof OrderStatusCN;
                return <Tag color={getStatusColor(status)} key={status}>
                    {OrderStatusCN[key]}
                </Tag>
            },
        },
        {
            title: 'Actions',
            key: 'column-actions',
            width: 80,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: any, record: Order) => (
                <Space key={`actions-${record.id}`} size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal({ ...record, productId: record.product.id })}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this order?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                    >
                        <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

  return (
      <div>
          <div className="page-header">
              <h1 className="page-title">Order Management</h1>
          </div>

          <Row gutter={[24, 24]} style={{ marginBottom: 24 }} key="statistics-row">
              <Col span={8} key="total-orders-col">
                  <Card key="total-orders-card" style={{ borderRadius: '8px' }}>
                      <Statistic
                          title="Total Orders"
                          value={statistics.totalOrders}
                          prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                      />
                  </Card>
              </Col>
              <Col span={8} key="completed-orders-col">
                  <Card key="completed-orders-card" style={{ borderRadius: '8px' }}>
                      <Statistic
                          title="Completed Orders"
                          value={statistics.completedOrders}
                          prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      />
                  </Card>
              </Col>
              <Col span={8} key="total-revenue-col">
                  <Card key="total-revenue-card" style={{ borderRadius: '8px' }}>
                      <Statistic
                          title="Total Revenue"
                          value={statistics.totalRevenue}
                          prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                          precision={2}
                      />
                  </Card>
              </Col>
          </Row>

          <Card style={{ borderRadius: '8px' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Input.Search
                      placeholder="Search orders"
                      allowClear
                      enterButton={<SearchOutlined />}
                      onSearch={handleSearch}
                      style={{ width: 300, borderRadius: '6px' }}
                      size="large"
                  />
                  <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => showModal()}
                      size="large"
                      style={{ borderRadius: '6px', height: '40px' }}
                  >
                      Add Order
                  </Button>
              </div>

              <Table
                  columns={columns}
                  dataSource={orders}
                  rowKey={(record) => record.id}
                  pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `Total ${total} items`,
                      style: { marginTop: '16px' }
                  }}
                  onChange={handleTableChange}
                  loading={loading}
                  scroll={{ x: 1200 }}
                  style={{ marginTop: '8px' }}
              />
          </Card>

          <Modal
            title={editingOrder ? "Edit Order" : "Add Order"}
            open={modalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={600}
            style={{ borderRadius: '8px' }}
          >
              <Form
                  form={form}
                  layout="vertical"
                  initialValues={editingOrder || undefined}
              >
                  <Form.Item
                      name="productId"
                      label="Product"
                      rules={[{ required: true, message: 'Please select a product!' }]}
                  >
                      <Select size="large">
                          {products.map(product => (
                              <Select.Option key={product.id} value={product.id}>
                                  {product.name} - ${product.price}
                              </Select.Option>
                          ))}
                      </Select>
                  </Form.Item>
                  <Form.Item
                      name="quantity"
                      label="Quantity"
                      rules={[{ required: true, message: 'Please input quantity!' }]}
                  >
                      <InputNumber
                          min={1}
                          style={{ width: '100%' }}
                          size="large"
                      />
                  </Form.Item>
                  <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true, message: 'Please select a status!' }]}
                  >
                      <Select size="large">
                          <Select.Option value={OrderStatus.PENDING}>{OrderStatusCN.PENDING}</Select.Option>
                          <Select.Option value={OrderStatus.PROCESSING}>{OrderStatusCN.PROCESSING}</Select.Option>
                          <Select.Option value={OrderStatus.COMPLETED}>{OrderStatusCN.COMPLETED}</Select.Option>
                          <Select.Option value={OrderStatus.CANCELLED}>{OrderStatusCN.CANCELLED}</Select.Option>
                      </Select>
                  </Form.Item>
              </Form>
          </Modal>
      </div>
  );
};

export default OrderManagement;