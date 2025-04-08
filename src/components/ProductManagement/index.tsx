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
    Statistic
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    SearchOutlined,
    ShoppingOutlined,
    DollarOutlined,
    StockOutlined
} from '@ant-design/icons';
import { productsApi } from '../../services/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}

const { Search } = Input;

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    const fetchProducts = async (page = 1, pageSize = 10, search = '') => {
        try {
            setLoading(true);
            const response = await productsApi.getAll({
                page,
                pageSize,
                search,
            });
            setProducts(response.data.items);
            setPagination({
                current: page,
                pageSize,
                total: response.data.total,
            });
        } catch (error) {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        fetchProducts(pagination.current, pagination.pageSize, searchText);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        fetchProducts(1, pagination.pageSize, value);
    };

    const showModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            form.setFieldsValue(product);
        } else {
            setEditingProduct(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingProduct) {
                await productsApi.update(editingProduct.id, values);
                message.success('Product updated successfully');
            } else {
                await productsApi.create(values);
                message.success('Product created successfully');
            }
            setModalVisible(false);
            fetchProducts(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await productsApi.delete(id);
            message.success('Product deleted successfully');
            fetchProducts(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
            message.error('Failed to delete product');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: true,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: [
                { text: 'Fish', value: 'Fish' },
                { text: 'Shellfish', value: 'Shellfish' },
                { text: 'Other', value: 'Other' },
            ],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Product Management</h1>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={products.length}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Stock"
                            value={products.reduce((sum, product) => sum + product.stock, 0)}
                            prefix={<StockOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Average Price"
                            value={products.length ? (products.reduce((sum, product) => sum + product.price, 0) / products.length).toFixed(2) : 0}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Search
                        placeholder="Search products"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        size="large"
                    >
                        Add Product
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={pagination}
                    onChange={handleTableChange}
                    loading={loading}
                    scroll={{ x: 1200 }}
                />
            </Card>

            <Modal
                title={editingProduct ? 'Edit Product' : 'Add Product'}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
                destroyOnClose
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input product description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: 'Please input product price!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    size="large"
                                    prefix="$"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="stock"
                                label="Stock"
                                rules={[{ required: true, message: 'Please input stock quantity!' }]}
                            >
                                <InputNumber 
                                    min={0} 
                                    style={{ width: '100%' }} 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select size="large">
                            <Select.Option value="Fish">Fish</Select.Option>
                            <Select.Option value="Shellfish">Shellfish</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;