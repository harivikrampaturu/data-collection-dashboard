import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Descriptions,
  Image,
  Typography,
  Input,
  Form,
  Tabs,
  Divider,
} from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FileImageOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import useDashboardStore from '../store/dashboardStore';
import api from '../services/api';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const TaskResponses = () => {
  const {
    tasks,
    taskResponses,
    taskResponsesLoading,
    fetchTasks,
    fetchTaskResponses,
    updateResponseStatus,
  } = useDashboardStore();

  const [selectedTask, setSelectedTask] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingResponse, setViewingResponse] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewingResponse, setReviewingResponse] = useState(null);
  const [feedbackForm] = Form.useForm();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [mediaSignedUrls, setMediaSignedUrls] = useState({});
  const [loadingMedia, setLoadingMedia] = useState(false);

  console.log('taskResponses', taskResponses);
  console.log('tasks', tasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (selectedTask) {
      fetchTaskResponses(selectedTask);
    }
  }, [selectedTask, fetchTaskResponses]);

  const handleTaskChange = (taskId) => {
    setSelectedTask(taskId);
  };


  const handleReview = async (response) => {
    setReviewingResponse(response);
    setReviewModalVisible(true);
    feedbackForm.resetFields();
    setMediaSignedUrls({});
    
    // Fetch signed URLs for all media files
    if (response.mediaFiles && response.mediaFiles.length > 0) {
      setLoadingMedia(true);
      try {
        const urls = {};
        const promises = response.mediaFiles.map(async (file) => {
          const signedUrl = await fetchMediaSignedUrl(response._id, file._id);
          if (signedUrl) {
            urls[file._id] = signedUrl;
          }
        });
        
        await Promise.all(promises);
        setMediaSignedUrls(urls);
      } catch (error) {
        console.error('Error fetching signed URLs:', error);
        message.error('Failed to load media files');
      } finally {
        setLoadingMedia(false);
      }
    }
  };

  const handleViewResponse = async (response) => {
    setViewingResponse(response);
    setViewModalVisible(true);
    setMediaSignedUrls({});
    
    // Fetch signed URLs for all media files
    if (response.mediaFiles && response.mediaFiles.length > 0) {
      setLoadingMedia(true);
      try {
        const urls = {};
        const promises = response.mediaFiles.map(async (file) => {
          const signedUrl = await fetchMediaSignedUrl(response._id, file._id);
          if (signedUrl) {
            urls[file._id] = signedUrl;
          }
        });
        
        await Promise.all(promises);
        setMediaSignedUrls(urls);
      } catch (error) {
        console.error('Error fetching signed URLs:', error);
        message.error('Failed to load media files');
      } finally {
        setLoadingMedia(false);
      }
    }
  };

  const fetchMediaSignedUrl = async (responseId, mediaId) => {
    try {
      const response = await api.get(`/task/v1/tasks/responses/${responseId}/media/${mediaId}/signed-url`);
      return response.data.signedUrl;
    } catch (error) {
      console.error('Failed to fetch signed URL:', error);
      message.error('Failed to load media preview');
      return null;
    }
  };

  const handleStatusChange = async (responseId, status) => {
    try {
      const result = await updateResponseStatus(responseId, status);
      if (result.success) {
        message.success('Response status updated successfully');
        if (selectedTask) {
          fetchTaskResponses(selectedTask);
        }
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to update response status');
    }
  };

  const handleReviewSubmit = async (values) => {
    const { status, feedback } = values;
    
    if ((status === 'declined' || status === 'rejected' || status === 'resubmission_requested') && !feedback) {
      message.error('Feedback is required for this status');
      return;
    }

    setUpdatingStatus(true);
    try {
      const result = await updateResponseStatus(reviewingResponse._id, status, feedback);
      if (result.success) {
        message.success(`Response ${status} successfully`);
        setReviewModalVisible(false);
        if (selectedTask) {
          fetchTaskResponses(selectedTask);
        }
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Failed to update response status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested': return 'orange';
      case 'accepted': return 'cyan';
      case 'declined': return 'red';
      case 'submitted': return 'blue';
      case 'resubmission_requested': return 'gold';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'paid': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId, record) => (
        <div>
          <div>{record.userName || 'Unknown User'}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {userId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      ellipsis: true,
      render: (response) => response || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 180 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="requested">Requested</Option>
          <Option value="accepted">Accepted</Option>
          <Option value="declined">Declined</Option>
          <Option value="submitted">Submitted</Option>
          <Option value="resubmission_requested">Resubmission Requested</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
          <Option value="paid">Paid</Option>
        </Select>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewResponse(record)}
          >
            View
          </Button>
          {(record.status === 'submitted' || record.status === 'resubmission_requested') && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleReview(record)}
            >
              Review
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const selectedTaskData = tasks.find(task => task._id === selectedTask);
  const totalResponses = taskResponses.length;
  const requestedResponses = taskResponses.filter(r => r.status === 'requested').length;
  const acceptedResponses = taskResponses.filter(r => r.status === 'accepted').length;
  const submittedResponses = taskResponses.filter(r => r.status === 'submitted').length;
  const approvedResponses = taskResponses.filter(r => r.status === 'approved').length;
  const rejectedResponses = taskResponses.filter(r => r.status === 'rejected').length;
  const paidResponses = taskResponses.filter(r => r.status === 'paid').length;

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Task Responses</h1>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => selectedTask && fetchTaskResponses(selectedTask)}
            loading={taskResponsesLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Task Selection */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Text strong>Select Task:</Text>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a task to view responses"
              value={selectedTask}
              onChange={handleTaskChange}
            >
              {tasks.map(task => (
                <Option key={task._id} value={task._id}>
                  {task.title}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {selectedTask && (
        <>
          {/* Task Info */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Task Information</Title>
            <Descriptions column={2}>
              <Descriptions.Item label="Title">{selectedTaskData?.title}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="blue">{selectedTaskData?.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color="orange">{selectedTaskData?.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Points">{selectedTaskData?.points || '-'}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedTaskData?.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Total"
                  value={totalResponses}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff', fontSize: 18 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Requested"
                  value={requestedResponses}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Accepted"
                  value={acceptedResponses}
                  valueStyle={{ color: '#13c2c2', fontSize: 18 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Submitted"
                  value={submittedResponses}
                  valueStyle={{ color: '#1890ff', fontSize: 18 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Approved"
                  value={approvedResponses}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a', fontSize: 18 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic
                  title="Paid"
                  value={paidResponses}
                  valueStyle={{ color: '#237804', fontSize: 18 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Responses Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={taskResponses}
              loading={taskResponsesLoading}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} responses`,
              }}
            />
          </Card>
        </>
      )}

      {/* View Response Modal */}
      <Modal
        title="Response Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={1000}
      >
        {viewingResponse && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="User Name" span={2}>
                {viewingResponse.userSnapshot?.name || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {viewingResponse.userSnapshot?.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {viewingResponse.userSnapshot?.gender || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {viewingResponse.userSnapshot?.age || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {viewingResponse.userSnapshot?.location?.city || '-'}, {viewingResponse.userSnapshot?.location?.state || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={getStatusColor(viewingResponse.status)}>
                  {viewingResponse.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted At">
                {new Date(viewingResponse.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(viewingResponse.updatedAt).toLocaleString()}
              </Descriptions.Item>
              {viewingResponse.feedback && (
                <Descriptions.Item label="Feedback" span={2}>
                  <Text type="warning">{viewingResponse.feedback}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
            
            {viewingResponse.mediaFiles && viewingResponse.mediaFiles.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>Media Files ({viewingResponse.mediaFiles.length})</Title>
                {loadingMedia ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Text>Loading media files...</Text>
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {viewingResponse.mediaFiles.map((file, index) => (
                      <Col span={12} key={file._id || index}>
                        <Card size="small" title={file.fileName || `File ${index + 1}`}>
                          {renderMediaFile(file)}
                          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            <div>Type: {file.type}</div>
                            <div>Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                            <div>Format: {file.mimeType}</div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title={`Review Submission - ${reviewingResponse?.userSnapshot?.name || 'User'}`}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        width={1200}
        footer={null}
      >
        {reviewingResponse && (
          <div>
            {/* Media Preview */}
            {reviewingResponse.mediaFiles && reviewingResponse.mediaFiles.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Submitted Media Files</Title>
                {loadingMedia ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Text>Loading media files...</Text>
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {reviewingResponse.mediaFiles.map((file, index) => (
                      <Col span={12} key={file._id || index}>
                        <Card size="small" title={file.fileName || `File ${index + 1}`}>
                          {renderMediaFile(file)}
                          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            <div>Type: {file.type}</div>
                            <div>Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            <Divider />

            {/* Review Form */}
            <Form
              form={feedbackForm}
              layout="vertical"
              onFinish={handleReviewSubmit}
              initialValues={{ status: reviewingResponse.status }}
            >
              <Form.Item
                name="status"
                label="Review Decision"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select size="large">
                  <Option value="approved">
                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> Approve
                  </Option>
                  <Option value="rejected">
                    <ClockCircleOutlined style={{ color: '#f5222d' }} /> Reject
                  </Option>
                  <Option value="resubmission_requested">
                    <ReloadOutlined style={{ color: '#faad14' }} /> Request Resubmission
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
              >
                {({ getFieldValue }) => {
                  const selectedStatus = getFieldValue('status');
                  const requiresFeedback = ['rejected', 'resubmission_requested'].includes(selectedStatus);
                  
                  return (
                    <Form.Item
                      name="feedback"
                      label="Feedback"
                      rules={[
                        {
                          required: requiresFeedback,
                          message: 'Feedback is required for this decision',
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={
                          requiresFeedback
                            ? 'Please provide feedback explaining your decision...'
                            : 'Optional: Add feedback for the user...'
                        }
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={updatingStatus}>
                    Submit Review
                  </Button>
                  <Button onClick={() => setReviewModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );

  function renderMediaFile(file) {
    // Use signed URL if available
    const signedUrl = mediaSignedUrls[file._id];
    
    console.log('Rendering file:', file.fileName, 'Signed URL:', signedUrl);
    
    if (!signedUrl) {
      return <Text type="secondary">No preview available</Text>;
    }

    if (file.type === 'video' || file.mimeType?.startsWith('video/')) {
      return (
        <div style={{ backgroundColor: '#000', borderRadius: 8, overflow: 'hidden' }}>
          <video
            key={signedUrl}
            controls
            controlsList="nodownload"
            playsInline
            style={{ 
              width: '100%', 
              maxHeight: 400,
              display: 'block'
            }}
            preload="auto"
            onError={(e) => {
              console.error('Video error:', e);
              console.error('Video source:', signedUrl);
              console.error('MIME type:', file.mimeType);
            }}
            onLoadedData={() => console.log('Video loaded successfully:', file.fileName)}
          >
            <source src={signedUrl} type={file.mimeType} />
            Your browser does not support the video tag.
            <p style={{ color: '#fff', padding: 20 }}>
              If the video doesn't play, <a href={signedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>download it here</a>.
            </p>
          </video>
        </div>
      );
    }

    if (file.type === 'audio' || file.mimeType?.startsWith('audio/')) {
      return (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <SoundOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <audio key={signedUrl} controls style={{ width: '100%' }}>
            <source src={signedUrl} type={file.mimeType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (file.type === 'image' || file.mimeType?.startsWith('image/')) {
      return (
        <Image
          key={signedUrl}
          src={signedUrl}
          alt={file.fileName}
          style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsbpDhIqC2YHgeGJQUI6SEKKqg4MhO1DBVFKRWDaqOTA"
        />
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <FileImageOutlined style={{ fontSize: 48, color: '#888' }} />
        <div style={{ marginTop: 8 }}>
          <a href={signedUrl} target="_blank" rel="noopener noreferrer" download>
            Download File
          </a>
        </div>
      </div>
    );
  }
};

export default TaskResponses;
