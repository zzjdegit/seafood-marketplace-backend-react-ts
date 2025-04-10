import { rest } from 'msw';

export const handlers = [
  // User API mocks
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
  rest.get('/api/products/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        totalProducts: 50,
        totalStock: 1000,
        averagePrice: 29.99,
      })
    );
  }),

  // Order API mocks
  rest.get('/api/orders/statistics', (req, res, ctx) => {
    return res(
      ctx.json({
        totalOrders: 200,
        completedOrders: 150,
        totalRevenue: 5999.99,
      })
    );
  }),
]; 