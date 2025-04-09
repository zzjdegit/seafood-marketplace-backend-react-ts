import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagement from '../index';
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/usersApi';

// Mock the API calls
jest.mock('../../../api/usersApi');

const mockUsers = [
  {
    id: '1',
    username: 'testuser1',
    email: 'test1@example.com',
    role: 'user',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    username: 'admin1',
    email: 'admin1@example.com',
    role: 'admin',
    createdAt: '2024-03-20T11:00:00Z',
  },
];

describe('UserManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUsers as jest.Mock).mockResolvedValue({
      users: mockUsers,
      total: mockUsers.length,
    });
  });

  it('renders user table with correct columns', async () => {
    render(<UserManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('displays user data correctly', async () => {
    render(<UserManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
    });
  });

  it('opens create user modal when Add User button is clicked', async () => {
    render(<UserManagement />);
    
    const addButton = screen.getByText('Add User');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create User')).toBeInTheDocument();
    });
  });

  it('handles user creation successfully', async () => {
    (createUser as jest.Mock).mockResolvedValue({
      id: '3',
      username: 'newuser',
      email: 'newuser@example.com',
      role: 'user',
      createdAt: '2024-03-20T12:00:00Z',
    });

    render(<UserManagement />);
    
    // Click add button
    fireEvent.click(screen.getByText('Add User'));
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Username'), 'newuser');
    await userEvent.type(screen.getByLabelText('Email'), 'newuser@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'user');
    
    // Submit form
    fireEvent.click(screen.getByText('OK'));
    
    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
      });
    });
  });

  it('handles user role update', async () => {
    (updateUser as jest.Mock).mockResolvedValue({
      ...mockUsers[0],
      role: 'admin',
    });

    render(<UserManagement />);
    
    await waitFor(() => {
      const editButton = screen.getAllByText('Edit')[0];
      fireEvent.click(editButton);
    });
    
    // Change role
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'admin');
    
    // Submit form
    fireEvent.click(screen.getByText('OK'));
    
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith('1', {
        role: 'admin',
      });
    });
  });

  it('handles user deletion', async () => {
    (deleteUser as jest.Mock).mockResolvedValue({ success: true });
    
    render(<UserManagement />);
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('Delete')[0];
      fireEvent.click(deleteButton);
    });
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Yes'));
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith('1');
    });
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    (getUsers as jest.Mock).mockRejectedValue(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<UserManagement />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('filters users by role', async () => {
    render(<UserManagement />);
    
    // Select admin role
    await userEvent.selectOptions(screen.getByLabelText('Role'), 'admin');
    
    await waitFor(() => {
      expect(getUsers).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        'admin'
      );
    });
  });
}); 