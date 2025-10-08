import React, { useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Button,
  Space,
  Divider,
  Typography,
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import LocationSelector from './LocationSelector';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const TaskForm = ({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false, 
  task = null, 
  mode = 'create' // 'create' or 'edit'
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && task && mode === 'edit') {
      // Populate form with existing task data
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        mediaType: task.mediaType,
        specificRequirements: task.specificRequirements,
        requiredQuantity: task.requiredQuantity,
        bufferQuantity: task.bufferQuantity,
        paymentPerSubmission: task.paymentPerSubmission,
        status: task.status,
        priority: task.priority,
        immediate: task.broadcastOptions?.immediate || false,
        // Location data
        country: task.filters?.location?.country || null,
        state: task.filters?.location?.state || null,
        city: task.filters?.location?.city || null,
        states: task.filters?.location?.states || [],
        cities: task.filters?.location?.cities || [],
        pincodes: task.filters?.location?.pincodes || [],
        // Demographics
        gender: task.filters?.gender || 'any',
        ageMin: task.filters?.ageRange?.min,
        ageMax: task.filters?.ageRange?.max,
      });
    } else if (visible && mode === 'create') {
      // Reset form for new task
      form.resetFields();
    }
  }, [visible, task, mode, form]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure
    const taskData = {
      title: values.title,
      description: values.description,
      mediaType: values.mediaType,
      specificRequirements: values.specificRequirements,
      requiredQuantity: values.requiredQuantity,
      bufferQuantity: values.bufferQuantity || 0,
      paymentPerSubmission: values.paymentPerSubmission,
      status: values.status,
      filters: {
        location: {
          // Handle both global and India-specific location data
          country: values.country || null,
          state: values.state || null,
          city: values.city || null,
          states: values.states || [],
          cities: values.cities || [],
          pincodes: values.pincodes || []
        },
        gender: values.gender || 'any',
        ageRange: {
          min: values.ageMin || null,
          max: values.ageMax || null
        }
      },
      broadcastOptions: {
        immediate: values.immediate || false,
        priority: values.priority || 'medium'
      }
    };

    onSubmit(taskData);
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </Title>
      }
      width={600}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      extra={
        <Space>
          <Button icon={<CloseOutlined />} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            {mode === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        {/* Basic Information */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Basic Information</Title>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe what this task is about"
            />
          </Form.Item>

          <Form.Item
            name="mediaType"
            label="Media Type"
            rules={[{ required: true, message: 'Please select media type' }]}
          >
            <Select placeholder="Select media type">
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
              <Option value="audio">Audio</Option>
              <Option value="text">Text</Option>
              <Option value="mixed">Mixed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="specificRequirements"
            label="Specific Requirements"
            rules={[{ required: true, message: 'Please enter specific requirements' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe specific requirements for this task"
            />
          </Form.Item>
        </div>

        <Divider />

        {/* Quantity & Payment */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Quantity & Payment</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="requiredQuantity"
                label="Required Quantity"
                rules={[{ required: true, message: 'Please enter required quantity' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1} 
                  placeholder="Number of submissions needed"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bufferQuantity"
                label="Buffer Quantity"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  placeholder="Extra submissions (optional)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="paymentPerSubmission"
            label="Payment Per Submission"
            rules={[{ required: true, message: 'Please enter payment per submission' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              step={0.01} 
              placeholder="Amount in currency"
              prefix="$"
            />
          </Form.Item>
        </div>

        <Divider />

        {/* Status & Priority */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Status & Priority</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select>
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="immediate"
            label="Broadcast Immediately"
          >
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        {/* Location Filters */}
        <div style={{ marginBottom: 24 }}>
          <LocationSelector form={form} initialValues={task?.filters} />
        </div>

        <Divider />

        {/* Demographics Filters */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Demographics Filters (Optional)</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select>
                  <Option value="any">Any</Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ageMin"
                label="Min Age"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  max={100} 
                  placeholder="Minimum age"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ageMax"
                label="Max Age"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  max={100} 
                  placeholder="Maximum age"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Drawer>
  );
};

export default TaskForm;
