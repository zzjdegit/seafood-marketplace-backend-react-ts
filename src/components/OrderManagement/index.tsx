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
import { createOrder, deleteOrder, getAllOrders, updateOrder } from '../../api/ordersApi';
import { Order } from '../../types';
import { getAllProducts } from '../../api/productsApi';
const { Search } = Input;

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
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
            const response = await getAllOrders({
                page,
                pageSize,
                search,
                status: status as any,
                sortField,
                sortOrder,
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
            const response = await getAllProducts({
                page: 1,
                pageSize: 100,
                search: '',
            });
            setProducts(response.data);
        } catch (error) {
            message.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log('Table change:', { pagination, filters, sorter });
        const statusFilter = filters.status && filters.status.length > 0 ? filters.status[0] : '';
        setCurrentStatus(statusFilter);

        const sortField = sorter.field || 'createdAt';
        let sortOrder: 'ascend' | 'descend' | null = null;
        if (sorter.order === 'ascend' || sorter.order === 'descend') {
            sortOrder = sorter.order;
        }

        fetchOrders(
            pagination.current,
            pagination.pageSize,
            searchText,
            statusFilter,
            sortField,
            sortOrder
        );
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        fetchOrders(1, pagination.pageSize, value, currentStatus);
    };

    const showModal = (order?: Order) => {
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
            const totalPrice = selectedProduct.price * values.quantity;

            if (editingOrder) {
                await updateOrder(editingOrder.id, { ...values, totalPrice });
                message.success('Order updated successfully');
            } else {
                await createOrder({ ...values, totalPrice });
                message.success('Order created successfully');
            }
            setModalVisible(false);
            fetchOrders(pagination.current, pagination.pageSize, searchText, currentStatus);
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
            fetchOrders(pagination.current, pagination.pageSize, searchText, currentStatus);
        } catch (error) {
            console.error('Delete error:', error);
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
            width: 220,
            ellipsis: true,
        },
        {
            title: 'Product',
            dataIndex: 'productId',
            key: 'column-product',
            width: 150,
            render: (productId: string) => {
                const product = products.find(p => p.id === productId);
                return product ? product.name : productId;
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
            width: 120,
            align: 'right' as const,
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'column-status',
            width: 120,
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Completed', value: 'completed' },
                { text: 'Canceled', value: 'canceled' },
            ],
            render: (status: string) => (
                <Tag color={getStatusColor(status)} key={status}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'column-actions',
            width: 150,
            align: 'center' as const,
            render: (_: any, record: Order) => (
                <Space key={`actions-${record.id}`} size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
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
                            value={orders.length}
                            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="completed-orders-col">
                    <Card key="completed-orders-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Completed Orders"
                            value={orders.filter(o => o.status === 'completed').length}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="total-revenue-col">
                    <Card key="total-revenue-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Total Revenue"
                            value={orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: '8px' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Search
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
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="canceled">Canceled</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderManagement;