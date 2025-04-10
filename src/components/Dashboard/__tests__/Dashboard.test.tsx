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

// Mock @ant-design/plots components
jest.mock('@ant-design/plots', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
  Column: () => <div data-testid="column-chart">Column Chart</div>,
}));

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
    const loadingCards = document.querySelectorAll('.ant-card-loading');
    expect(loadingCards.length).toBeGreaterThan(0);
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

  it('displays charts after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('column-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock API error
    (getUserStatistics as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch statistics/i)).toBeInTheDocument();
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
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$5999.99')).toBeInTheDocument();
    });
  });
});