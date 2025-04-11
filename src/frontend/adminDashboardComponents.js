// Admin Dashboard Frontend Components
// This file contains React component templates for the admin dashboard

// Dashboard Overview Component
const DashboardOverview = `
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Alert } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, TagOutlined } from '@ant-design/icons';
import axios from 'axios';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    counts: {
      products: 0,
      orders: 0,
      users: 0,
      categories: 0
    },
    revenue: {
      total: 0,
      monthly: 0
    },
    recentOrders: [],
    topProducts: [],
    recentUsers: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/admin/dashboard/overview', {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
        setDashboardData(response.data.dashboard);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a href={\`/admin/orders/\${text}\`}>{text.substring(0, 8)}...</a>,
    },
    {
      title: 'Customer',
      dataIndex: 'shippingAddress',
      key: 'customer',
      render: (address) => address?.name || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => date ? new Date(date.seconds * 1000).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={\`status-badge status-\${status}\`}>{status}</span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => \`$\${total.toFixed(2)}\`,
    },
  ];

  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a href={\`/admin/products/\${record.id}\`}>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => \`$\${price.toFixed(2)}\`,
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      render: (inventory) => inventory <= 0 ? <span className="out-of-stock">Out of stock</span> : inventory,
    },
  ];

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      
      <Row gutter={16} className="stats-cards">
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Products"
              value={dashboardData.counts.products}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Orders"
              value={dashboardData.counts.orders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={dashboardData.counts.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={dashboardData.revenue.total}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="data-tables">
        <Col span={12}>
          <Card title="Recent Orders" loading={loading}>
            <Table 
              dataSource={dashboardData.recentOrders} 
              columns={orderColumns} 
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Products" loading={loading}>
            <Table 
              dataSource={dashboardData.topProducts} 
              columns={productColumns} 
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
`;

// Sales Analytics Component
const SalesAnalytics = `
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Spin, Alert } from 'antd';
import { Line, Pie, Bar } from '@ant-design/charts';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    salesByDay: {},
    salesByCategory: {},
    salesByPaymentMethod: {}
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(\`/api/admin/dashboard/analytics/sales?period=\${period}\`, {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
        setAnalyticsData(response.data.analytics);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data. Please try again.');
        console.error('Analytics data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [period]);

  // Transform data for charts
  const salesByDayData = Object.entries(analyticsData.salesByDay).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.count
  }));

  const salesByCategoryData = Object.entries(analyticsData.salesByCategory).map(([category, data]) => ({
    category,
    value: data.revenue
  }));

  const salesByPaymentMethodData = Object.entries(analyticsData.salesByPaymentMethod).map(([method, data]) => ({
    method,
    value: data.revenue
  }));

  // Chart configurations
  const lineConfig = {
    data: salesByDayData,
    xField: 'date',
    yField: 'revenue',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const pieConfig = {
    data: salesByCategoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const barConfig = {
    data: salesByPaymentMethodData,
    xField: 'value',
    yField: 'method',
    seriesField: 'method',
    legend: {
      position: 'top-left',
    },
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="sales-analytics">
      <h1>Sales Analytics</h1>
      
      <Row gutter={16} className="filter-row">
        <Col span={8}>
          <Select
            defaultValue="month"
            style={{ width: 200 }}
            onChange={handlePeriodChange}
          >
            <Option value="week">Last 7 Days</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
          </Select>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row gutter={16} className="chart-row">
          <Col span={24}>
            <Card title="Revenue Over Time">
              <Line {...lineConfig} />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="chart-row">
          <Col span={12}>
            <Card title="Sales by Category">
              <Pie {...pieConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Sales by Payment Method">
              <Bar {...barConfig} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default SalesAnalytics;
`;

// Inventory Management Component
const InventoryManagement = `
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Alert, Modal, Form, InputNumber, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const InventoryManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/admin/dashboard/inventory', {
        headers: {
          Authorization: \`Bearer \${token}\`
        }
      });
      setProducts(response.data.inventory.products);
      setError(null);
    } catch (err) {
      setError('Failed to load inventory data. Please try again.');
      console.error('Inventory data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        inventory: product.inventory,
        status: product.status
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      if (editingProduct) {
        await axios.put(\`/api/products/\${editingProduct.id}\`, {
          ...values
        }, {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
      } else {
        await axios.post('/api/products', {
          ...values
        }, {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      // Show error message
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a href={\`/admin/products/\${record.id}\`}>{text}</a>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      sorter: (a, b) => a.inventory - b.inventory,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'out_of_stock') {
          color = 'red';
        } else if (status === 'low_stock') {
          color = 'orange';
        }
        return (
          <Tag color={color}>
            {status.replace(/_/g, ' ').toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'In Stock', value: 'in_stock' },
        { text: 'Low Stock', value: 'low_stock' },
        { text: 'Out of Stock', value: 'out_of_stock' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(\`/api/products/\${id}\`, {
        headers: {
          Authorization: \`Bearer \${token}\`
        }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      // Show error message
    }
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="inventory-management">
      <h1>Inventory Management</h1>
      
      <Card>
        <div className="table-actions">
          <Input
            placeholder="Search products"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Product
          </Button>
        </div>
        
        <Table 
          dataSource={filteredProducts} 
          columns={columns} 
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="inventory"
            label="Inventory"
            rules={[{ required: true, message: 'Please enter inventory' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
          >
            <Select>
              <Option value="in_stock">In Stock</Option>
              <Option value="low_stock">Low Stock</Option>
              <Option value="out_of_stock">Out of Stock</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Update" : "Create"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
`;

// User Management Component
const UserManagement = `
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Alert, Modal, Form, Select } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/auth/users', {
        headers: {
          Authorization: \`Bearer \${token}\`
        }
      });
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error('User data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchText.toLowerCase()))
  );

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        email: user.email,
        displayName: user.displayName,
        role: user.role
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      if (editingUser) {
        await axios.put('/api/auth/users/role', {
          uid: editingUser.id,
          role: values.role
        }, {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
      } else {
        await axios.post('/api/admin/create', {
          email: values.email,
          password: values.password,
          displayName: values.displayName
        }, {
          headers: {
            Authorization: \`Bearer \${token}\`
          }
        });
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      // Show error message
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record) => text || record.email.split('@')[0],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        if (role === 'admin') {
          color = 'red';
        } else if (role === 'manager') {
          color = 'green';
        }
        return (
          <Tag color={color}>
            {role.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Customer', value: 'customer' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date.seconds * 1000).toLocaleDateString() : 'N/A',
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
      <Card>
        <div className="table-actions">
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => showModal()}
          >
            Add User
          </Button>
        </div>
        
        <Table 
          dataSource={filteredUsers} 
          columns={columns} 
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User Role" : "Add User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!editingUser && (
            <>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="displayName"
                label="Display Name"
              >
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Create"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
`;

module.exports = {
  DashboardOverview,
  SalesAnalytics,
  InventoryManagement,
  UserManagement
};
