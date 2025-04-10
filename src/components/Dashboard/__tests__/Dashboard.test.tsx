import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../index';
import { getUserStatistics } from '../../../api/usersApi';
import { getProductStatistics } from '../../../api/productsApi';
import { getOrderStatistics } from '../../../api/ordersApi';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

// Mock the API calls
jest.mock('../../../api/usersApi');
jest.mock('../../../api/productsApi');
jest.mock('../../../api/ordersApi');

const mockUserStats = {
  totalUsers: 100,
  adminUsers: 20,
  regularUsers: 80,
};

const mockProductStats = {
  totalProducts: 50,
  totalStock: 1000,
  averagePrice: 29.99,
};

const mockOrderStats = {
  totalOrders: 200,
  completedOrders: 150,
  totalRevenue: 5999.99,
};

describe('Dashboard Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock implementations
    (getUserStatistics as jest.Mock).mockResolvedValue(mockUserStats);
    (getProductStatistics as jest.Mock).mockResolvedValue(mockProductStats);
    (getOrderStatistics as jest.Mock).mockResolvedValue(mockOrderStats);
  });

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays dashboard statistics after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });
  });

  it('displays revenue chart after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    });
  });

  it('displays order status chart after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Order Status')).toBeInTheDocument();
    });
  });

  it('displays recent orders table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Recent Orders')).toBeInTheDocument();
      expect(screen.getByText('Order ID')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('displays top products table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Top Products')).toBeInTheDocument();
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders dashboard title', () => {
    renderComponent();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders statistics cards with correct data', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$1000')).toBeInTheDocument();
    });
  });

  it('renders all charts', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
      expect(screen.getByText('Order Status')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });
}); 