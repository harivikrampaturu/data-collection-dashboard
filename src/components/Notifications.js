import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  SendOutlined,
  MailOutlined,
  BellOutlined,
} from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const Notifications = () => {
  const { sendNotification, sendEmail } = useDashboardStore();
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [notificationForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  const handleSendNotification = async (values) => {
    setNotificationLoading(true);
    try {
      const result = await sendNotification(values);
      if (result.success) {
        message.success('Notification sent successfully!');
        notificationForm.resetFields();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to send notification');
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleSendEmail = async (values) => {
    setEmailLoading(true);
    try {
      const result = await sendEmail(values);
      if (result.success) {
        message.success('Email sent successfully!');
        emailForm.resetFields();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to send email');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Notifications & Communications</h1>
      </div>

      <Row gutter={[24, 24]}>
        {/* Send Notification */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                Send Push Notification
              </Space>
            }
            extra={<BellOutlined style={{ color: '#1890ff' }} />}
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleSendNotification}
            >
              <Form.Item
                name="title"
                label="Notification Title"
                rules={[{ required: true, message: 'Please enter notification title' }]}
              >
                <Input placeholder="Enter notification title" />
              </Form.Item>

              <Form.Item
                name="body"
                label="Notification Message"
                rules={[{ required: true, message: 'Please enter notification message' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter notification message"
                />
              </Form.Item>

              <Form.Item
                name="type"
                label="Notification Type"
                rules={[{ required: true, message: 'Please select notification type' }]}
              >
                <Select placeholder="Select notification type">
                  <Option value="info">Information</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="success">Success</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="targetUsers"
                label="Target Users"
                rules={[{ required: true, message: 'Please select target users' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select target users (leave empty for all users)"
                >
                  <Option value="all">All Users</Option>
                  <Option value="active">Active Users Only</Option>
                  <Option value="blocked">Blocked Users Only</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={notificationLoading}
                  icon={<SendOutlined />}
                  block
                >
                  Send Notification
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Send Email */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <MailOutlined />
                Send Email
              </Space>
            }
            extra={<MailOutlined style={{ color: '#52c41a' }} />}
          >
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleSendEmail}
            >
              <Form.Item
                name="to"
                label="Recipient Email"
                rules={[
                  { required: true, message: 'Please enter recipient email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter recipient email address" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Email Subject"
                rules={[{ required: true, message: 'Please enter email subject' }]}
              >
                <Input placeholder="Enter email subject" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Email Message"
                rules={[{ required: true, message: 'Please enter email message' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter email message"
                />
              </Form.Item>

              <Form.Item
                name="emailType"
                label="Email Type"
                rules={[{ required: true, message: 'Please select email type' }]}
              >
                <Select placeholder="Select email type">
                  <Option value="invitation">Invitation</Option>
                  <Option value="notification">Notification</Option>
                  <Option value="reminder">Reminder</Option>
                  <Option value="update">Update</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={emailLoading}
                  icon={<SendOutlined />}
                  block
                >
                  Send Email
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Communication Guidelines */}
      <Card style={{ marginTop: 24 }}>
        <Title level={4}>Communication Guidelines</Title>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Title level={5}>Push Notifications</Title>
            <ul>
              <li>Keep titles short and descriptive</li>
              <li>Use clear, actionable language</li>
              <li>Consider timing for user engagement</li>
              <li>Test notifications before sending to all users</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Email Communications</Title>
            <ul>
              <li>Use professional subject lines</li>
              <li>Include clear call-to-action</li>
              <li>Personalize content when possible</li>
              <li>Follow email best practices for deliverability</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Notifications;
