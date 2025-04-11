import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useRoutes } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import routes from './routes';

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const OrderManagement = lazy(() => import('./components/OrderManagement'));
const ProductManagement = lazy(() => import('./components/ProductManagement'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const ConfigManagement = lazy(() => import('./components/ConfigManagement'));

const { Header, Content, Sider } = Layout;

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

const MainLayout: React.FC = () => {
  const location = useLocation();
  const element = useRoutes(routes);

  const menuItems: MenuProps['items'] = routes.map(route => ({
    key: route.path || '/',
    icon: route.handle?.icon,
    label: route.handle?.label,
    onClick: () => {
      // Handle menu item click if needed
    }
  }));

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
      <Sider 
        width={200} 
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          position: 'fixed',
          left: 0,
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div style={{ 
          height: 64, 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <img 
            src="https://img.icons8.com/color/48/000000/fish-food.png" 
            alt="Seafood Marketplace Logo" 
            style={{ 
              width: 32, 
              height: 32, 
              marginRight: 8 
            }} 
          />
          <span style={{ 
            fontSize: 16, 
            fontWeight: 600,
            color: '#1890ff'
          }}>
            Seafood Market
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            height: 'calc(100vh - 64px)', 
            borderRight: 0,
            paddingTop: 8
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 200,
          zIndex: 999,
          boxShadow: '0 2px 8px 0 rgba(29,35,41,.05)'
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar 
              style={{ 
                backgroundColor: '#1890ff',
                cursor: 'pointer'
              }} 
              icon={<UserOutlined />} 
            />
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: '88px 24px 24px', 
          padding: 24, 
          background: '#fff', 
          minHeight: 280,
          borderRadius: 8
        }}>
          <Suspense fallback={<Loading />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/config-management" element={<ConfigManagement />} />
            </Routes>
          </Suspense>
        </Content>
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