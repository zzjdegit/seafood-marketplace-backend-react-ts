import { setupServer } from 'msw/node';
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

export const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        users: mockUsers,
        total: mockUsers.length,
      })
    );
  }),

  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        products: mockProducts,
        total: mockProducts.length,
      })
    );
  }),

  rest.get('/api/orders', (req, res, ctx) => {
    return res(
      ctx.json({
        orders: mockOrders,
        total: mockOrders.length,
      })
    );
  }),

  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(
      ctx.json(mockDashboard)
    );
  }),

  rest.get('/api/users/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        total: 10,
        admin: 2,
        user: 8,
      })
    );
  }),

  rest.get('/api/products/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        total: 20,
        fish: 10,
        shellfish: 8,
        other: 2,
      })
    );
  }),

  rest.get('/api/orders/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        total: 50,
        pending: 10,
        processing: 20,
        completed: 20,
        cancelled: 0,
      })
    );
  })
); 