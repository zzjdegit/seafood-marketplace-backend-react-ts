import React, { useEffect, useState } from 'react';

interface Order {
    id: number;
    customerName: string;
    status: string;
    total: number;
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Mock data for development
                const mockOrders: Order[] = [
                    { id: 1, customerName: 'John Doe', status: 'Pending', total: 100.00 },
                    { id: 2, customerName: 'Jane Smith', status: 'Completed', total: 150.00 },
                    { id: 3, customerName: 'Bob Johnson', status: 'Processing', total: 200.00 },
                ];
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOrders(mockOrders);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Order List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Order ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Customer Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={{ border: '1px solid #ddd' }}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.customerName}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.status}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>${order.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;