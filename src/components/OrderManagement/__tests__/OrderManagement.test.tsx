import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderManagement from '../index';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('OrderManagement Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <OrderManagement />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays order statistics after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
      expect(screen.getByText('Pending Orders')).toBeInTheDocument();
      expect(screen.getByText('Processing Orders')).toBeInTheDocument();
      expect(screen.getByText('Completed Orders')).toBeInTheDocument();
      expect(screen.getByText('Cancelled Orders')).toBeInTheDocument();
    });
  });

  it('displays order table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Order ID')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('Total Amount')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText('Search orders...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });
  });

  it('handles status filter', async () => {
    renderComponent();
    
    await waitFor(() => {
      const statusFilter = screen.getByText('Status');
      fireEvent.click(statusFilter);
    });
    
    const pendingOption = screen.getByText('Pending');
    fireEvent.click(pendingOption);
    
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    renderComponent();
    
    await waitFor(() => {
      const nextPageButton = screen.getByTitle('Next Page');
      fireEvent.click(nextPageButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('handles sorting', async () => {
    renderComponent();
    
    await waitFor(() => {
      const orderIdHeader = screen.getByText('Order ID');
      fireEvent.click(orderIdHeader);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Order ID')).toHaveAttribute('aria-sort', 'ascending');
    });
  });
}); 