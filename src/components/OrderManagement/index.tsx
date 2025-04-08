import React from 'react';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';

const OrderManagement: React.FC = () => {
    return (
        <div>
            <h1>Order Management</h1>
            <OrderList />
            <OrderDetails />
        </div>
    );
};

export default OrderManagement;