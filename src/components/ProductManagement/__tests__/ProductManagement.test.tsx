import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductManagement from '../index';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../api/productsApi';

// Mock the API calls
jest.mock('../../../api/productsApi');

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test Description 1',
    price: 19.99,
    stock: 100,
    category: 'seafood',
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 29.99,
    stock: 50,
    category: 'fish',
  },
];

describe('ProductManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: mockProducts.length,
    });
  });

  it('renders product table with correct columns', async () => {
    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Product Management')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('displays product data correctly', async () => {
    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('19.99')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('seafood')).toBeInTheDocument();
    });
  });

  it('opens create product modal when Add Product button is clicked', async () => {
    render(<ProductManagement />);
    
    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create Product')).toBeInTheDocument();
    });
  });

  it('handles product creation successfully', async () => {
    (createProduct as jest.Mock).mockResolvedValue({
      id: '3',
      name: 'New Product',
      description: 'New Description',
      price: 39.99,
      stock: 75,
      category: 'seafood',
    });

    render(<ProductManagement />);
    
    // Click add button
    fireEvent.click(screen.getByText('Add Product'));
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Name'), 'New Product');
    await userEvent.type(screen.getByLabelText('Description'), 'New Description');
    await userEvent.type(screen.getByLabelText('Price'), '39.99');
    await userEvent.type(screen.getByLabelText('Stock'), '75');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'seafood');
    
    // Submit form
    fireEvent.click(screen.getByText('OK'));
    
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        name: 'New Product',
        description: 'New Description',
        price: 39.99,
        stock: 75,
        category: 'seafood',
      });
    });
  });

  it('handles product deletion', async () => {
    (deleteProduct as jest.Mock).mockResolvedValue({ success: true });
    
    render(<ProductManagement />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
    });
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Yes'));
    
    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith('1');
    });
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    (getProducts as jest.Mock).mockRejectedValue(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ProductManagement />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
}); 