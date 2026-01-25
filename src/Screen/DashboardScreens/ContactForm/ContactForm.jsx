import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Card, 
  Tag, 
  Row, 
  Col, 
  Tooltip, 
  Spin, 
  Modal, 
  message, 
  Pagination, 
  Empty 
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  FileTextOutlined, 
  FilePdfOutlined, 
  FileImageOutlined, 
  FileOutlined, 
  MailOutlined, 
  UserOutlined, 
  MessageOutlined, 
  CalendarOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { apiHandle } from '../../../Config/ApiHandle/apiHandle';
import SendEmailModal from '../../../Component/Modal/SendEmailModal';

const { Title, Text } = Typography;
const { Search } = Input;

const ContactFormManagement = () => {
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedContactForEmail, setSelectedContactForEmail] = useState(null);

  // Fetch contact form submissions
  const fetchContactSubmissions = async () => {
    setLoading(true);
    try {
      const response = await apiHandle.get('get-submit-contact-form');
      setContactSubmissions(response?.data?.contact_info);
      setFilteredSubmissions(response?.data?.contact_info);
      setPagination(prev => ({
        ...prev,
        total: response.data.length
      }));
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      message.error('Failed to load contact form submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredSubmissions(contactSubmissions);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = contactSubmissions.filter(
      item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.message.toLowerCase().includes(searchLower)
    );
    
    setFilteredSubmissions(filtered);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchText('');
    fetchContactSubmissions();
  };

  // View submission details
  const handleView = (record) => {
    setCurrentSubmission(record);
    setViewModalVisible(true);
  };

  // Handle delete confirmation
  const showDeleteConfirm = (id) => {
    setDeletingId(id);
    setDeleteModalVisible(true);
  };

  // Delete submission
  const handleDelete = async () => {
    try {
      // Implement deletion logic here with your API
      await apiHandle.post(`delete-form-contact/${deletingId}`);
      
      // For demo, we'll just filter the item out
      const newData = contactSubmissions.filter(item => item.id !== deletingId);
      setContactSubmissions(newData);
      setFilteredSubmissions(newData);
      
      message.success('Contact submission deleted successfully');
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting submission:', error);
      message.error('Failed to delete contact submission');
    }
  };

  // Determine file type icon
  const getFileIcon = (attachment) => {
    if (!attachment) return <FileOutlined />;
    
    if (attachment.toLowerCase().endsWith('.pdf')) {
      return <FilePdfOutlined />;
    } else if (
      attachment.toLowerCase().endsWith('.jpg') || 
      attachment.toLowerCase().endsWith('.jpeg') || 
      attachment.toLowerCase().endsWith('.png') || 
      attachment.toLowerCase().endsWith('.gif')
    ) {
      return <FileImageOutlined />;
    } else {
      return <FileOutlined />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      )
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      key: 'attachment',
      render: (text) => (
        text ? (
          <Tooltip title="View Attachment">
            <a 
              href={text} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'rgba(0, 0, 0, 0.65)' }}
            >
              {getFileIcon(text)}
              {text.split('/').pop().length > 15 
                ? `${text.split('/').pop().substring(0, 15)}...` 
                : text.split('/').pop()}
            </a>
          </Tooltip>
        ) : (
          <span>No attachment</span>
        )
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {formatDate(text)}
        </span>
      ),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          />
          <Button
            type="default"
            icon={<MailOutlined />}
            size="small"
            style={{ color: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => {
              setSelectedContactForEmail(record);
              setEmailModalVisible(true);
            }}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      )
    }
  ];

  // Render file preview based on type
  const renderAttachmentPreview = (url) => {
    if (!url) return <Empty description="No attachment" />;

    if (url.toLowerCase().endsWith('.pdf')) {
      return (
        <iframe 
          src={url} 
          width="100%" 
          height="500px" 
          title="PDF Viewer"
          style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}
        />
      );
    } else if (
      url.toLowerCase().endsWith('.jpg') || 
      url.toLowerCase().endsWith('.jpeg') || 
      url.toLowerCase().endsWith('.png') || 
      url.toLowerCase().endsWith('.gif')
    ) {
      return (
        <img 
          src={url} 
          alt="Attachment Preview" 
          style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain" }}
        />
      );
    } else {
      return (
        <div className="text-center p-4">
          <FileOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <p className="mt-2">
            <a href={url} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </p>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              <FileTextOutlined /> Contact Form Submissions
            </Title>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="Search by name, email or message"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="Total Submissions" 
                value={contactSubmissions.length} 
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="With Attachments" 
                value={contactSubmissions.filter(item => item.attachment).length} 
                prefix={<FilePdfOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="Today's Submissions" 
                value={contactSubmissions.filter(item => {
                  const today = new Date().toISOString().split('T')[0];
                  return item.created_at.includes(today);
                }).length}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="Unread Submissions" 
                value={0} // You can implement read/unread status if needed
                prefix={<MailOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredSubmissions}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize
              });
            }
          }}
          locale={{
            emptyText: <Empty description="No contact form submissions found" />
          }}
        />
      </Card>

      {/* View Submission Modal */}
      <Modal
        title={
          <span>
            <EyeOutlined /> View Contact Form Submission
          </span>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {currentSubmission && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="border p-4 rounded bg-gray-50">
                  <p><strong><UserOutlined /> Name:</strong> {currentSubmission.name}</p>
                  <p><strong><MailOutlined /> Email:</strong> {currentSubmission.email}</p>
                  <p><strong><CalendarOutlined /> Date:</strong> {formatDate(currentSubmission.created_at)}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className="border p-4 rounded bg-gray-50">
                  <p><strong>ID:</strong> {currentSubmission.id}</p>
                  <p>
                    <strong>Attachment:</strong>{" "}
                    {currentSubmission.attachment ? (
                      <a href={currentSubmission.attachment} target="_blank" rel="noopener noreferrer">
                        {getFileIcon(currentSubmission.attachment)}{" "}
                        {currentSubmission.attachment.split('/').pop()}
                      </a>
                    ) : (
                      "No attachment"
                    )}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className="border p-4 rounded bg-gray-50">
                  <p className="mb-2"><strong><MessageOutlined /> Message:</strong></p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{currentSubmission.message}</p>
                </div>
              </Col>
              {currentSubmission.attachment && (
                <Col span={24}>
                  <Title level={5}>Attachment Preview</Title>
                  <div className="border p-4 rounded bg-gray-50">
                    {renderAttachmentPreview(currentSubmission.attachment)}
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Confirmation"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this contact form submission? This action cannot be undone.</p>
      </Modal>

      {/* Send Email Modal */}
      <SendEmailModal
        visible={emailModalVisible}
        onClose={() => {
          setEmailModalVisible(false);
          setSelectedContactForEmail(null);
        }}
        recipientData={selectedContactForEmail}
        recipientType="contact"
        onSuccess={() => {
          message.success('Email sent to contact successfully');
        }}
      />
    </div>
  );
};

// Statistic component for statistics cards
const Statistic = ({ title, value, prefix }) => (
  <div>
    <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}>{title}</Text>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
      <span style={{ fontSize: 18, marginRight: 8 }}>{prefix}</span>
      <Title level={4} style={{ margin: 0 }}>{value}</Title>
    </div>
  </div>
);

export default ContactFormManagement;