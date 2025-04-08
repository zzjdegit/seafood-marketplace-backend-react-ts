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
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../../api/productsApi';
import { Product } from '../../types';
const { Search } = Input;

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentCategory, setCurrentCategory] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    const fetchProducts = async (
        page = 1,
        pageSize = 10,
        search = '',
        category = '',
        sortField = 'createdAt',
        sortOrder: 'ascend' | 'descend' | null = null
    ) => {
        try {
            setLoading(true);
            const response = await getAllProducts({
                page,
                pageSize,
                search,
                category,
                sortField,
                sortOrder,
            });
            setProducts(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.total,
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
        console.log('Table change:', { pagination, filters, sorter }); // For debugging
        const categoryFilter = filters.category && filters.category.length > 0 ? filters.category[0] : '';
        setCurrentCategory(categoryFilter);

        // Handle sorting
        const sortField = sorter.field || 'createdAt';
        // Convert antd's sorter.order to our API's expected format
        let sortOrder: 'ascend' | 'descend' | null = null;
        if (sorter.order === 'ascend' || sorter.order === 'descend') {
            sortOrder = sorter.order;
        }

        fetchProducts(
            pagination.current,
            pagination.pageSize,
            searchText,
            categoryFilter,
            sortField,
            sortOrder
        );
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        fetchProducts(1, pagination.pageSize, value, currentCategory);
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
                await updateProduct(editingProduct.id, values);
                message.success('Product updated successfully');
            } else {
                await createProduct(values);
                message.success('Product created successfully');
            }
            setModalVisible(false);
            fetchProducts(pagination.current, pagination.pageSize, searchText, currentCategory);
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            message.error('Invalid product ID');
            return;
        }
        try {
            await deleteProduct(id);
            message.success('Product deleted successfully');
            fetchProducts(pagination.current, pagination.pageSize, searchText, currentCategory);
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Failed to delete product');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 220,
            ellipsis: true,
            fixed: 'left' as const
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'column-name',
            sorter: true,
            width: 150,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'column-description',
            ellipsis: true,
            width: 200,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'column-price',
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: true,
            width: 120,
            align: 'right' as const,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'column-stock',
            sorter: true,
            width: 120,
            align: 'right' as const,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'column-category',
            width: 120,
            filters: [
                { text: 'Fish', value: 'Fish' },
                { text: 'Shellfish', value: 'Shellfish' },
                { text: 'Other', value: 'Other' },
            ],
            filterMode: 'menu' as const,
            filterSearch: true,
            onFilter: (value: any, record: Product) => record.category === value,
        },
        {
            title: 'Actions',
            key: 'column-actions',
            width: 200,
            align: 'center' as const,
            render: (_: any, record: Product) => (
                <Space key={`actions-${record.id}`} size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                        size="middle"
                        style={{ padding: 0 }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                    >
                        <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                            size="middle"
                            style={{ padding: 0 }}
                        />
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

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }} key="statistics-row">
                <Col span={8} key="total-products-col">
                    <Card key="total-products-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Total Products"
                            value={products.length}
                            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="total-stock-col">
                    <Card key="total-stock-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Total Stock"
                            value={products.reduce((sum, product) => sum + product.stock, 0)}
                            prefix={<StockOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="average-price-col">
                    <Card key="average-price-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Average Price"
                            value={products.length ? (products.reduce((sum, product) => sum + product.price, 0) / products.length).toFixed(2) : 0}
                            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: '8px' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Search
                        placeholder="Search products"
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
                        Add Product
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
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
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editingProduct || undefined}
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
                        <Input.TextArea rows={4} size="large" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            { required: true, message: 'Please input product price!' },
                            { type: 'number', min: 0, message: 'Price must be greater than 0!' }
                        ]}
                    >
                        <InputNumber
                            prefix="$"
                            min={0}
                            step={0.01}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select product category!' }]}
                    >
                        <Select size="large">
                            <Select.Option value="Fish">Fish</Select.Option>
                            <Select.Option value="Shellfish">Shellfish</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="stock"
                        label="Stock"
                        rules={[
                            { required: true, message: 'Please input stock quantity!' },
                            { type: 'number', min: 0, message: 'Stock must be greater than or equal to 0!' }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="imageUrl"
                        label="Image URL"
                    >
                        <Input size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement;