import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../index';
import { getUserStatistics } from '../../../api/usersApi';
import { getProductStatistics } from '../../../api/productsApi';
import { getOrderStatistics } from '../../../api/ordersApi';

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
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock implementations
    (getUserStatistics as jest.Mock).mockResolvedValue(mockUserStats);
    (getProductStatistics as jest.Mock).mockResolvedValue(mockProductStats);
    (getOrderStatistics as jest.Mock).mockResolvedValue(mockOrderStats);
  });

  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders statistics cards with correct data', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('5999.99$')).toBeInTheDocument();
    });
  });

  it('renders all charts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('User Distribution')).toBeInTheDocument();
      expect(screen.getByText('Product Statistics')).toBeInTheDocument();
      expect(screen.getByText('Order Trends')).toBeInTheDocument();
    });
  });

  it('fetches data on component mount', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(getUserStatistics).toHaveBeenCalledTimes(1);
      expect(getProductStatistics).toHaveBeenCalledTimes(1);
      expect(getOrderStatistics).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    (getUserStatistics as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch statistics:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
}); 