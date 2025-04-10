import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserManagement from '../index';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

describe('UserManagement Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserManagement />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays user statistics after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Admin Users')).toBeInTheDocument();
      expect(screen.getByText('Regular Users')).toBeInTheDocument();
    });
  });

  it('displays user table after loading', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });
  });

  it('handles role filter', async () => {
    renderComponent();
    
    await waitFor(() => {
      const roleFilter = screen.getByText('Role');
      fireEvent.click(roleFilter);
    });
    
    const adminOption = screen.getByText('Admin');
    fireEvent.click(adminOption);
    
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
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