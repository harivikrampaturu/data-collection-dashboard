import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Space, message } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';

const Dashboard = () => {
  const {
    stats,
    statsLoading,
    users,
    tasks=[],
    fetchStats,
    fetchUsers,
    fetchTasks,
  } = useDashboardStore();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchTasks();
  }, [fetchStats, fetchUsers, fetchTasks]);

  const handleRefresh = () => {
    fetchStats();
    fetchUsers();
    fetchTasks();
    message.success('Data refreshed successfully');
  };

  const recentUsers = users.slice(0, 5).map(user => ({
    key: user._id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    status: user.isBlocked ? 'Blocked' : 'Active',
    createdAt: new Date(user.createdAt).toLocaleDateString(),
  }));

  const recentTasks = Array.isArray(tasks) ? tasks.slice(0, 5).map(task => ({
    key: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: new Date(task.createdAt).toLocaleDateString(),
  })) : [];

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Active' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  const taskColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? '#52c41a' : '#1890ff',
          textTransform: 'capitalize'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Dashboard</h1>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={statsLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Total Tasks"
              value={stats.totalTasks}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <Statistic
              title="Total Responses"
              value={stats.totalResponses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Data Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Users" extra={<Button type="link">View All</Button>}>
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Tasks" extra={<Button type="link">View All</Button>}>
            <Table
              columns={taskColumns}
              dataSource={recentTasks}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
