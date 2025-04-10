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
      expect(screen.getByText('3')).toBeInTheDocument(); // Total products count
      expect(screen.getByText('Fish Products')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Fish products count
      expect(screen.getByText('Shellfish Products')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Shellfish products count
      expect(screen.getByText('Other Products')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Other products count
    });
  });

  it('displays product table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('Test Product 3')).toBeInTheDocument();
      expect(screen.getByText('FISH')).toBeInTheDocument();
      expect(screen.getByText('SHELLFISH')).toBeInTheDocument();
      expect(screen.getByText('OTHER')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Test Product 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Product 3')).not.toBeInTheDocument();
    });
  });

  it('handles category filter', async () => {
    renderComponent();
    
    await waitFor(() => {
      const categoryFilter = screen.getByText('Category');
      fireEvent.click(categoryFilter);
    });
    
    const fishOption = screen.getByText('FISH');
    fireEvent.click(fishOption);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Product 3')).not.toBeInTheDocument();
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
      expect(screen.getByText('1-3 of 3')).toBeInTheDocument();
    });
  });

  it('handles sorting', async () => {
    renderComponent();
    
    await waitFor(() => {
      const priceHeader = screen.getByText('Price');
      fireEvent.click(priceHeader);
    });
    
    await waitFor(() => {
      const prices = screen.getAllByText(/\$\d+\.\d{2}/);
      const priceValues = prices.map(p => parseFloat(p.textContent?.replace('$', '') || '0'));
      expect(priceValues).toEqual([19.99, 29.99, 39.99]);
    });

    const priceHeader = screen.getByText('Price');
    fireEvent.click(priceHeader);
    
    await waitFor(() => {
      const prices = screen.getAllByText(/\$\d+\.\d{2}/);
      const priceValues = prices.map(p => parseFloat(p.textContent?.replace('$', '') || '0'));
      expect(priceValues).toEqual([39.99, 29.99, 19.99]);
    });
  });
}); 