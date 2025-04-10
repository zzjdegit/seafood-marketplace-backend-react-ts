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
    StockOutlined
} from '@ant-design/icons';
import { Product, ProductListParams } from '../../types';
import { Category, CategoryCN } from '../../types/enums';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductStatistics } from '../../api/productsApi';
import { TablePaginationConfig, FilterValue, SorterResult } from 'antd/lib/table/interface';

const { Search } = Input;
const { Option } = Select;

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentCategory, setCurrentCategory] = useState<string | undefined>();
    const [pagination, setPagination] = useState<{
        current: number;
        pageSize: number;
        total: number;
    }>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [statistics, setStatistics] = useState({ totalStock: 0, averagePrice: 0 });

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
            const response = await getProducts({
                page,
                pageSize,
                search,
                category,
                sortField,
                sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : null,
            });
            setProducts(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.total,
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const stats = await getProductStatistics();
            setStatistics(stats);
        } catch (error) {
            message.error('Failed to fetch statistics');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchStatistics();
    }, []);

    const handleTableChange = async (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Product> | SorterResult<Product>[],
    ) => {
        // Get sort field and order
        const sortField = Array.isArray(sorter) ? sorter[0]?.field : sorter?.field;
        const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

        // Get category filter - now supports multiple values
        const category = filters['column-category'] as string[] || [];
        const price = filters['column-price'] as string[] || [];
        const stock = filters['column-stock'] as string[] || [];

        setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0
        });
        setCurrentCategory(category.join(','));
        
        try {
            const productsData = await getProducts({
                page: pagination.current || 1,
                pageSize: pagination.pageSize || 10,
                search: searchText,
                category: category.join(','),
                price: price[0],
                stock: stock[0],
                sortField: sortField as string,
                sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : '1',
            });
            
            setProducts(productsData.data);
            setPagination(prev => ({
                ...prev,
                total: productsData.total
            }));
        } catch (error) {
            message.error('Failed to fetch data');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
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
            form.resetFields();
            await Promise.all([
                fetchProducts(pagination.current, pagination.pageSize, searchText, currentCategory),
                fetchStatistics()
            ]);
        } catch (error) {
            console.error('Failed to save product:', error);
            message.error('Failed to save product');
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
            await Promise.all([
                fetchProducts(pagination.current, pagination.pageSize, searchText, currentCategory),
                fetchStatistics()
            ]);
        } catch (error) {
            console.error('Failed to delete product:', error);
            message.error('Failed to delete product');
        }
    };

    const getCategoryColor = (category: Category) => {
        switch (category) {
            case Category.FISH:
                return 'blue';
            case Category.SHELLFISH:
                return 'green';
            case Category.OTHER:
                return 'default';
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
            fixed: 'left' as const
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'column-name',
            sorter: true,
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'column-description',
            ellipsis: true,
            width: 300,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'column-price',
            render: (price: number) => `$${price.toFixed(2)}`,
            sorter: true,
            width: 120,
            align: 'right' as const,
            filterMode: 'menu' as const,
            filters: [
                { text: '< $20', value: '0-20' },
                { text: '$20 - $50', value: '20-50' },
                { text: '> $50', value: '50-999999' }
            ]
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'column-stock',
            sorter: true,
            width: 120,
            align: 'right' as const,
            filterMode: 'menu' as const,
            filters: [
                { text: 'Out of Stock', value: '0' },
                { text: 'Low Stock (<50)', value: '1-49' },
                { text: 'In Stock (≥50)', value: '50-999999' }
            ]
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'column-category',
            width: 120,
            filters: Object.values(Category).map(category => ({
                text: CategoryCN[category],
                value: category as string
            })),
            filterMode: 'menu' as const,
            filterSearch: true,
            render: (category: Category) => (
                <Tag color={getCategoryColor(category)}>
                    {CategoryCN[category]}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'column-actions',
            width: 100,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: any, record: Product) => (
                <Space key={`actions-${record.id}`} size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
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
                            style={{ padding: 0 }}
                        />
                    </Popconfirm>
                </Space>
            )
        }
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
                            value={pagination.total}
                            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="total-stock-col">
                    <Card key="total-stock-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Total Stock"
                            value={statistics.totalStock}
                            prefix={<StockOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col span={8} key="average-price-col">
                    <Card key="average-price-card" style={{ borderRadius: '8px' }}>
                        <Statistic
                            title="Average Price"
                            value={statistics.averagePrice}
                            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                            precision={2}
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
                            {Object.values(Category).map(category => (
                                <Option key={category as string} value={category}>
                                    {CategoryCN[category]}
                                </Option>
                            ))}
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