import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  BlockOutlined,
  UnlockOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';

const { Option } = Select;

const Users = () => {
  const {
    users,
    usersLoading,
    usersError,
    fetchUsers,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
  } = useDashboardStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const result = await updateUser(editingUser._id, values);
      if (result.success) {
        message.success('User updated successfully');
        setEditModalVisible(false);
        form.resetFields();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        message.success('User deleted successfully');
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleBlock = async (userId) => {
    try {
      const result = await blockUser(userId);
      if (result.success) {
        message.success('User blocked successfully');
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to block user');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const result = await unblockUser(userId);
      if (result.success) {
        message.success('User unblocked successfully');
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to unblock user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '-',
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      key: 'status',
      render: (isBlocked) => (
        <Tag color={isBlocked ? 'red' : 'green'}>
          {isBlocked ? 'Blocked' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Email Verified',
      dataIndex: 'isEmailVerified',
      key: 'isEmailVerified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'red'}>
          {verified ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Phone Verified',
      dataIndex: 'isPhoneVerified',
      key: 'isPhoneVerified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'red'}>
          {verified ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.isBlocked ? (
            <Button
              icon={<UnlockOutlined />}
              size="small"
              type="primary"
              onClick={() => handleUnblock(record._id)}
            >
              Unblock
            </Button>
          ) : (
            <Button
              icon={<BlockOutlined />}
              size="small"
              danger
              onClick={() => handleBlock(record._id)}
            >
              Block
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeUsers = users.filter(user => !user.isBlocked).length;
  const blockedUsers = users.filter(user => user.isBlocked).length;

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Users Management</h1>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchUsers}
            loading={usersLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={activeUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Blocked Users"
              value={blockedUsers}
              prefix={<BlockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={usersLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[{ type: 'number', min: 1, max: 120 }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isEmailVerified"
                label="Email Verified"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPhoneVerified"
                label="Phone Verified"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
