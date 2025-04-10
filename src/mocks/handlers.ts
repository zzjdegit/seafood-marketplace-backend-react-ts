import { rest } from 'msw';

const mockUsers = [
  {
    id: '1',
    username: 'testuser1',
    email: 'test1@example.com',
    role: 'user',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    username: 'admin1',
    email: 'admin1@example.com',
    role: 'admin',
    createdAt: '2024-03-20T11:00:00Z',
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test Description 1',
    price: 19.99,
    stock: 100,
    category: 'FISH',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 29.99,
    stock: 50,
    category: 'SHELLFISH',
    createdAt: '2024-03-20T11:00:00Z',
  },
  {
    id: '3',
    name: 'Test Product 3',
    description: 'Test Description 3',
    price: 39.99,
    stock: 75,
    category: 'OTHER',
    createdAt: '2024-03-20T12:00:00Z',
  },
];

const mockOrders = [
  {
    id: '1',
    customer: {
      id: '1',
      username: 'testuser1',
      email: 'test1@example.com',
    },
    totalAmount: 39.98,
    status: 'PENDING',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    customer: {
      id: '2',
      username: 'admin1',
      email: 'admin1@example.com',
    },
    totalAmount: 29.99,
    status: 'COMPLETED',
    createdAt: '2024-03-20T11:00:00Z',
  },
];

const mockDashboard = {
  totalRevenue: 1000,
  totalOrders: 50,
  totalProducts: 20,
  totalUsers: 10,
  revenueData: [
    { date: '2024-03-01', value: 100 },
    { date: '2024-03-02', value: 200 },
  ],
  orderStatusData: [
    { status: 'PENDING', value: 10 },
    { status: 'PROCESSING', value: 20 },
    { status: 'COMPLETED', value: 20 },
  ],
  recentOrders: mockOrders.slice(0, 5),
  topProducts: mockProducts.slice(0, 5).map(product => ({
    ...product,
    sales: 10,
    revenue: product.price * 10,
  })),
};

export const handlers = [
  // User API mocks
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        users: mockUsers,
        total: mockUsers.length,
      })
    );
  }),

  rest.get('/api/users/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        totalUsers: 100,
        adminUsers: 20,
        regularUsers: 80,
      })
    );
  }),

  // Product API mocks
  rest.get('/api/products', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const pageSize = Number(req.url.searchParams.get('pageSize')) || 10;
    const search = req.url.searchParams.get('search') || '';
    const category = req.url.searchParams.get('category') || '';
    const sortField = req.url.searchParams.get('sortField') || 'createdAt';
    const sortOrder = req.url.searchParams.get('sortOrder') || '1';

    let filteredProducts = [...mockProducts];

    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category) {
      const categories = category.split(',');
      filteredProducts = filteredProducts.filter(product => 
        categories.includes(product.category)
      );
    }

    // Apply sorting
    filteredProducts.sort((a: any, b: any) => {
      const order = sortOrder === '1' ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * order;
      if (a[sortField] > b[sortField]) return 1 * order;
      return 0;
    });

    // Apply pagination
    const start = (page - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(start, start + pageSize);

    return res(
      ctx.json({
        data: paginatedProducts,
        total: filteredProducts.length,
        page,
        pageSize,
      })
    );
  }),

  rest.get('/api/products/statistics', (req, res, ctx) => {
    const fishProducts = mockProducts.filter(p => p.category === 'FISH').length;
    const shellfishProducts = mockProducts.filter(p => p.category === 'SHELLFISH').length;
    const otherProducts = mockProducts.filter(p => p.category === 'OTHER').length;
    const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
    const averagePrice = mockProducts.reduce((sum, p) => sum + p.price, 0) / mockProducts.length;

    return res(
      ctx.json({
        totalProducts: mockProducts.length,
        fishProducts,
        shellfishProducts,
        otherProducts,
        totalStock,
        averagePrice: Number(averagePrice.toFixed(2)),
      })
    );
  }),

  // Order API mocks
  rest.get('/api/orders', (req, res, ctx) => {
    return res(
      ctx.json({
        orders: mockOrders,
        total: mockOrders.length,
      })
    );
  }),

  rest.get('/api/orders/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        totalOrders: 200,
        completedOrders: 150,
        totalRevenue: 5999.99,
      })
    );
  }),

  // Dashboard API mocks
  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(
      ctx.json(mockDashboard)
    );
  }),
]; 