import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  IeOutlined
} from '@ant-design/icons';
import { createUser, deleteUser, getUsers, updateUser, getUserStatistics } from '../../api/usersApi';
import { User, UserStatistics } from '../../types';
import { Role, RoleCN } from '../../types/enums';
import { TablePaginationConfig, FilterValue, SorterResult } from 'antd/lib/table/interface';

const { Search } = Input;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  const [form] = Form.useForm();

  const fetchUsers = async (
    page = 1,
    pageSize = 10,
    search = '',
    role: string = '',
    sortField = 'createdAt',
    sortOrder: 'ascend' | 'descend' | null = null
  ) => {
    try {
      setLoading(true);
      const response = await getUsers({
        page,
        pageSize,
        search,
        role: role || undefined,
        sortField,
        sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : '1',
      });
      setUsers(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (error) {
      message.error('Failed to fetch user statistics');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  const handleTableChange = async (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[],
  ) => {
    // Get sort field and order
    const sortField = Array.isArray(sorter) ? sorter[0]?.field : sorter?.field;
    const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

    // Get role filter
    const role = filters['column-role'] as Role[] || [];

    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || 0
    });
    setCurrentRole(role.join(','));
    
    try {
      const usersData = await getUsers({
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
        search: searchText,
        role: role.join(','),
        sortField: sortField as string,
        sortOrder: sortOrder === 'ascend' ? '1' : sortOrder === 'descend' ? '-1' : '1',
      });
      
      setUsers(usersData.data);
      setPagination(prev => ({
        ...prev,
        total: usersData.total
      }));
    } catch (error) {
      message.error('Failed to fetch data');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers(1, pagination.pageSize, value, currentRole);
  };

  const showModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        ...user,
        password: '' // Clear password field when editing
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        const updateData = { ...values };
        delete updateData.password;
        await updateUser(editingUser.id, updateData);
        message.success('User updated successfully');
      } else {
        const userData = {
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role || 'user',
        };
        await createUser(userData);
        message.success('User created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      await Promise.all([
        fetchUsers(pagination.current, pagination.pageSize, searchText),
        fetchStatistics()
      ]);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
      await Promise.all([
        fetchUsers(pagination.current, pagination.pageSize, searchText, currentRole),
        fetchStatistics()
      ]);
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'red';
      case Role.USER:
        return 'blue';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'column-id',
      width: 160,
      ellipsis: true,
      fixed: 'left' as const
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'column-username',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'column-email',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'column-role',
      width: 100,
      filters: Object.values(Role).map(role => ({
        text: RoleCN[role.toUpperCase() as keyof typeof RoleCN],
        value: role
      })),
      filterMode: 'menu' as const,
      filterSearch: true,
      render: (role: Role) => (
        <Tag color={getRoleColor(role)}>
          {RoleCN[role.toUpperCase() as keyof typeof RoleCN]}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'column-createdAt',
      sorter: true,
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'column-actions',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Space key={`actions-${record.id}`} size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ padding: 0 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }} key="statistics-row">
        <Col span={8} key="total-users-col">
          <Card key="total-users-card" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Total Users"
              value={statistics.totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8} key="admin-users-col">
          <Card key="admin-users-card" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Admin Users"
              value={statistics.adminUsers}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={8} key="regular-users-col">
          <Card key="regular-users-card" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Regular Users"
              value={statistics.regularUsers}
              prefix={<IeOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '8px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input.Search
            placeholder="Search users"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300, borderRadius: '6px' }}
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            size="large"
            style={{ borderRadius: '6px', height: '40px' }}
          >
            Add User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            style: { marginTop: '16px' }
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          style={{ marginTop: '8px' }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select user role!' }]}
          >
            <Select size="large">
              {Object.values(Role).map(role => (
                <Select.Option key={role as string} value={role}>
                  {RoleCN[role.toUpperCase() as keyof typeof RoleCN]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;