import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';
import TaskForm from './TaskForm';
import dayjs from 'dayjs';

const Tasks = () => {
  const {
    tasks=[],
    tasksLoading,
    tasksError,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useDashboardStore();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = () => {
    setFormMode('create');
    setEditingTask(null);
    setDrawerVisible(true);
  };

  const handleEdit = (task) => {
    setFormMode('edit');
    setEditingTask(task);
    setDrawerVisible(true);
  };

  const handleFormSubmit = async (taskData) => {
    setFormLoading(true);
    try {
      let result;
      if (formMode === 'create') {
        result = await createTask(taskData);
      } else {
        result = await updateTask(editingTask._id, taskData);
      }

      if (result.success) {
        message.success(`Task ${formMode === 'create' ? 'created' : 'updated'} successfully`);
        setDrawerVisible(false);
        setEditingTask(null);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error(`Failed to ${formMode === 'create' ? 'create' : 'update'} task`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId) => {
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        message.success('Task deleted successfully');
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Media Type',
      dataIndex: 'mediaType',
      key: 'mediaType',
      render: (type) => (
        <Tag color="blue">
          {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Required Qty',
      dataIndex: 'requiredQuantity',
      key: 'requiredQuantity',
      width: 100,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentPerSubmission',
      key: 'paymentPerSubmission',
      render: (amount) => amount ? `$${amount}` : '-',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Immediate',
      dataIndex: 'broadcastOptions',
      key: 'immediate',
      render: (options) => (
        <Tag color={options?.immediate ? 'green' : 'default'}>
          {options?.immediate ? 'Yes' : 'No'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MM-DD HH:mm'),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this task?"
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

  const activeTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'active').length : 0;
  const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'completed').length : 0;
  const totalRequiredQuantity = Array.isArray(tasks) ? tasks.reduce((sum, task) => sum + (task.requiredQuantity || 0), 0) : 0;
  const totalPayment = Array.isArray(tasks) ? tasks.reduce((sum, task) => sum + (task.paymentPerSubmission || 0), 0) : 0;

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Tasks Management</h1>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchTasks}
              loading={tasksLoading}
            >
              Refresh
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              Create Task
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={tasks.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Tasks"
              value={activeTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Required Qty"
              value={totalRequiredQuantity}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tasks Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={tasks}
          loading={tasksLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tasks`,
          }}
        />
      </Card>

      {/* Task Form Drawer */}
      <TaskForm
        visible={drawerVisible}
        onClose={handleDrawerClose}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        task={editingTask}
        mode={formMode}
      />
    </div>
  );
};

export default Tasks;
