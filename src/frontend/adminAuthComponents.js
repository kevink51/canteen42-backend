// Admin Login Component
const AdminLogin = `
import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Firebase Authentication
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Verify admin role with backend
      const response = await axios.post('/api/admin/login/verify', { idToken });
      
      if (response.data.success) {
        // Store token and user info
        localStorage.setItem('authToken', idToken);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userEmail', response.data.user.email);
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('You do not have admin privileges.');
        // Sign out user
        auth.signOut();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Card className="admin-login-card">
        <Title level={2} className="text-center">Admin Login</Title>
        
        {error && (
          <Alert
            message="Login Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}
        
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
`;

// Admin Layout Component
const AdminLayout = `
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, message } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  TagOutlined, 
  ShoppingCartOutlined,
  GiftOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'admin') {
      message.error('You must be logged in as an admin to access this page');
      navigate('/admin/login');
      return;
    }
    
    setUserEmail(email || '');
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      
      message.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout');
    }
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/admin/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/admin/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  
  // Determine which menu item is active
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return ['dashboard'];
    if (path.includes('/admin/products')) return ['products'];
    if (path.includes('/admin/orders')) return ['orders'];
    if (path.includes('/admin/users')) return ['users'];
    if (path.includes('/admin/categories')) return ['categories'];
    if (path.includes('/admin/coupons')) return ['coupons'];
    if (path.includes('/admin/suppliers')) return ['suppliers'];
    return ['dashboard'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <Title level={4} style={{ color: 'white', margin: '16px 0', textAlign: 'center' }}>
            {collapsed ? 'C42' : 'CANTEEN42'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="products" icon={<TagOutlined />}>
            <Link to="/admin/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="categories" icon={<ShoppingOutlined />}>
            <Link to="/admin/categories">Categories</Link>
          </Menu.Item>
          <Menu.Item key="coupons" icon={<GiftOutlined />}>
            <Link to="/admin/coupons">Coupons</Link>
          </Menu.Item>
          <Menu.Item key="suppliers" icon={<ShoppingOutlined />}>
            <Link to="/admin/suppliers">Suppliers</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header" style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              size="large"
            />
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{userEmail}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-content"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
`;

// Admin Routes Configuration
const AdminRoutes = `
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import DashboardOverview from './DashboardOverview';
import SalesAnalytics from './SalesAnalytics';
import InventoryManagement from './InventoryManagement';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CategoryManagement from './CategoryManagement';
import CouponManagement from './CouponManagement';
import SupplierManagement from './SupplierManagement';
import AdminProfile from './AdminProfile';
import AdminSettings from './AdminSettings';

// Auth guard component
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route 
        path="/" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="analytics" element={<SalesAnalytics />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="coupons" element={<CouponManagement />} />
        <Route path="suppliers" element={<SupplierManagement />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
`;

module.exports = {
  AdminLogin,
  AdminLayout,
  AdminRoutes
};
