import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const UserManagement: React.FC = () => {
    // Mock data for development
    const [users] = useState<User[]>([
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Manager',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'Staff',
            status: 'Inactive'
        }
    ]);

    return (
        <div>
            <h1>User Management</h1>
            <div style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Role</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ border: '1px solid #ddd' }}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.id}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.role}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;