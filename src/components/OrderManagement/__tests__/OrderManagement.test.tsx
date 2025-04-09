import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderManagement from '../index';
import { getOrders, updateOrder, deleteOrder } from '../../../api/ordersApi';

// Mock the API calls
jest.mock('../../../api/ordersApi');

const mockOrders = [
  {
    id: '1',
    product: {
      id: '1',
      name: 'Test Product 1',
      price: 19.99,
    },
    quantity: 2,
    totalPrice: 39.98,
    status: 'pending',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    product: {
      id: '2',
      name: 'Test Product 2',
      price: 29.99,
    },
    quantity: 1,
    totalPrice: 29.99,
    status: 'completed',
    createdAt: '2024-03-20T11:00:00Z',
  },
];

describe('OrderManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOrders as jest.Mock).mockResolvedValue({
      orders: mockOrders,
      total: mockOrders.length,
    });
  });

  it('renders order table with correct columns', async () => {
    render(<OrderManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Order Management')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('Total Price')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('displays order data correctly', async () => {
    render(<OrderManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('39.98')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('handles order status update', async () => {
    (updateOrder as jest.Mock).mockResolvedValue({
      ...mockOrders[0],
      status: 'processing',
    });

    render(<OrderManagement />);
    
    await waitFor(() => {
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
    });
    
    // Change status
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'processing');
    
    // Submit form
    fireEvent.click(screen.getByText('OK'));
    
    await waitFor(() => {
      expect(updateOrder).toHaveBeenCalledWith('1', {
        status: 'processing',
      });
    });
  });

  it('handles order deletion', async () => {
    (deleteOrder as jest.Mock).mockResolvedValue({ success: true });
    
    render(<OrderManagement />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
    });
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Yes'));
    
    await waitFor(() => {
      expect(deleteOrder).toHaveBeenCalledWith('1');
    });
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    (getOrders as jest.Mock).mockRejectedValue(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<OrderManagement />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('filters orders by status', async () => {
    render(<OrderManagement />);
    
    // Select completed status
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'completed');
    
    await waitFor(() => {
      expect(getOrders).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        'completed'
      );
    });
  });
}); 