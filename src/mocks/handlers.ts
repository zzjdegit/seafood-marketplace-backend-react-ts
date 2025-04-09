import { http, HttpResponse } from 'msw';

export const handlers = [
  // User API mocks
  http.get('/api/users/statistics', () => {
    return HttpResponse.json({
      totalUsers: 100,
      adminUsers: 20,
      regularUsers: 80,
    });
  }),

  // Product API mocks
  http.get('/api/products/statistics', () => {
    return HttpResponse.json({
      totalProducts: 50,
      totalStock: 1000,
      averagePrice: 29.99,
    });
  }),

  // Order API mocks
  http.get('/api/orders/statistics', () => {
    return HttpResponse.json({
      totalOrders: 200,
      completedOrders: 150,
      totalRevenue: 5999.99,
    });
  }),
]; 