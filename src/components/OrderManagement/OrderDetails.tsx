import React, { useState } from 'react';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

const OrderDetails: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    
    // Mock data for development
    const mockOrderItems: OrderItem[] = [
        { id: 1, name: 'Fresh Salmon', quantity: 2, price: 25.00 },
        { id: 2, name: 'Lobster', quantity: 1, price: 50.00 },
        { id: 3, name: 'Shrimp', quantity: 3, price: 15.00 },
    ];

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Order Details</h2>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h3>Order Items</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Item</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Quantity</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Price</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockOrderItems.map(item => (
                            <tr key={item.id} style={{ border: '1px solid #ddd' }}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.quantity}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>${item.price.toFixed(2)}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <strong>Total: ${mockOrderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;