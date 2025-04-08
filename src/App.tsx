import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import OrderManagement from './components/OrderManagement';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import Dashboard from './components/Dashboard';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#fff', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            Seafood Marketplace
          </h1>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar 
            style={{ 
              backgroundColor: '#1890ff',
              cursor: 'pointer',
            }} 
            icon={<UserOutlined />} 
          />
        </Dropdown>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider 
          width={200} 
          style={{ 
            background: '#fff',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            overflow: 'auto',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ marginLeft: 200, minHeight: 'calc(100vh - 64px)' }}>
          <Content style={{ padding: '24px', background: '#f5f7fa' }}>
            <Routes>
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <MainLayout />
    </Router>
  );
};

export default App;