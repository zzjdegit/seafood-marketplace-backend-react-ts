import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { DashboardOutlined, ShoppingCartOutlined, UserOutlined, ShopOutlined, SettingOutlined } from '@ant-design/icons';
import Dashboard from '../components/Dashboard';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import UserManagement from '../components/UserManagement';
import ConfigManagement from '../components/ConfigManagement';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
    handle: {
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>
    }
  },
  {
    path: '/products',
    element: <ProductManagement />,
    handle: {
      icon: <ShoppingCartOutlined />,
      label: <Link to="/products">商品管理</Link>
    }
  },
  {
    path: '/orders',
    element: <OrderManagement />,
    handle: {
      icon: <ShopOutlined />,
      label: <Link to="/orders">订单管理</Link>
    }
  },
  {
    path: '/users',
    element: <UserManagement />,
    handle: {
      icon: <UserOutlined />,
      label: <Link to="/users">用户管理</Link>
    }
  },
  {
    path: '/config-management',
    element: <ConfigManagement />,
    handle: {
      icon: <SettingOutlined />,
      label: <Link to="/config-management">共配治理</Link>
    }
  }
];

export default routes; 