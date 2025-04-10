import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductManagement from '../index';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('ProductManagement Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ProductManagement />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays product statistics after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('Fish Products')).toBeInTheDocument();
      expect(screen.getByText('Shellfish Products')).toBeInTheDocument();
      expect(screen.getByText('Other Products')).toBeInTheDocument();
    });
  });

  it('displays product table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });
  });

  it('handles category filter', async () => {
    renderComponent();
    
    await waitFor(() => {
      const categoryFilter = screen.getByText('Category');
      fireEvent.click(categoryFilter);
    });
    
    const fishOption = screen.getByText('Fish');
    fireEvent.click(fishOption);
    
    await waitFor(() => {
      expect(screen.getByText('Fish')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
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
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Name')).toHaveAttribute('aria-sort', 'ascending');
    });
  });
}); 