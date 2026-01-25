import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Image,
  Modal,
  Button,
  Badge,
  Select,
  Avatar,
  Input,
  message,
  Card,
  Divider,
  Typography,
  Space,
  Tooltip,
  Empty,
  Spin,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  MailOutlined,
  EditOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MessageOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import { DeleteOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SendEmailModal from "../../../Component/Modal/SendEmailModal";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const AdminFeedbackSystem = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    Resolved: 0,
    "In Progress": 0,
    Pending: 0,
  });
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedFeedbackForEmail, setSelectedFeedbackForEmail] = useState(null);
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Status colors configuration
  const statusConfig = {
    Resolved: {
      display: "Resolved",
      color: "#52c41a", // green
      icon: <CheckCircleOutlined />,
    },
    "In Progress": {
      display: "In Progress",
      color: "#1890ff", // blue
      icon: <ClockCircleOutlined />,
    },
    Pending: {
      display: "Pending",
      color: "#faad14", // gold
      icon: <ExclamationCircleOutlined />,
    },
  };

  // Fetch feedbacks from API with pagination
  const fetchFeedbacks = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      console.log(`Fetching page ${page} with ${pageSize} items per page`);
      
      const response = await apiHandle.get(`get-feedbacks?page=${page}&per_page=${pageSize}`);
      console.log("API Response:", response?.data);
      
      setFeedbacks(response?.data);
      setStatusCounts(response?.data?.status_counts || {});
      
      // Update pagination state with API response
      setPagination({
        current: response?.data?.pagination?.current_page || 1,
        pageSize: response?.data?.pagination?.per_page || 10,
        total: response?.data?.pagination?.total || 0,
      });
      
      console.log("Pagination updated:", {
        current: response?.data?.pagination?.current_page,
        total: response?.data?.pagination?.total,
        pageSize: response?.data?.pagination?.per_page
      });
      
    } catch (error) {
      console.error("Fetch error:", error.response?.data);
      message.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle table change (pagination, sorting, filtering)
  const handleTableChange = (newPagination, filters, sorter) => {
    console.log("Table change:", newPagination);
    setPagination(newPagination);
    fetchFeedbacks(newPagination.current, newPagination.pageSize);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatusKey) => {
    try {
      setLoading(true);
      await apiHandle.post(`update-feedback-status/${id}`, {
        status: newStatusKey,
      });

      // Refresh current page
      await fetchFeedbacks(pagination.current, pagination.pageSize);

      message.success({
        content: "Status updated successfully",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Filter feedbacks based on search (client-side filtering on current page data)
  const filteredFeedbacks = feedbacks?.data?.filter((feedback) => {
    const searchLower = searchValue?.toLowerCase();
    return (
      feedback.user?.name?.toLowerCase().includes(searchLower) ||
      feedback.article?.title?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  // Show feedback details
  const showFeedbackDetails = (record) => {
    setCurrentFeedback(record);
    setDetailModalVisible(true);
  };

  const deletehandle = async (item) => {
    try {
      await apiHandle.post(`delete-feedback/${item?.id}`);
      
      // Refresh current page after deletion
      await fetchFeedbacks(pagination.current, pagination.pageSize);
      
      message.success({
        content: "Feedback deleted successfully",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    } catch (error) {
      message.error("Failed to delete feedback");
    }
  };

  // Render Article Details or Direct URL based on what's available
  const renderContentSource = (record) => {
    if (record.article) {
      return (
        <div className="max-w-[400px]">
          <Tooltip title={record.article.title}>
            <Text
              strong
              ellipsis
              className="text-gray-900 hover:text-blue-600 cursor-pointer"
            >
              {record.article.title}
            </Text>
          </Tooltip>
          <div onClick={
                () => window.open(`https://doi.org/${record.article.doi}`, "_blank")
          } className="cursor-pointer mt-2 flex flex-wrap gap-2">
            <Tag color="blue" icon={<FileTextOutlined />}>
              <a
          onClick={
            () => {
              navigate(`/article-preview/${record.article.mhid}`);
            }
          }

                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                MHID: {record.article.mhid}
              </a>
            </Tag>
            <Tag color="cyan">
              <a
                href={`https://doi.org/${record.article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                DOI: {record.article.doi}
              </a>
            </Tag>
          </div>
        </div>
      );
    } else if (record.page_url) {
      return (
        <div className="max-w-[400px]">
          <Tooltip title={record.page_url}>
            <Text
              strong
              ellipsis
              className="text-gray-900 hover:text-blue-600 cursor-pointer"
            >
              <LinkOutlined className="mr-2" />
              Direct Page Feedback
            </Text>
          </Tooltip>
          <div className="mt-2">
            <a href={record.page_url} target="_blank" rel="noopener noreferrer">
              <Tag color="purple" icon={<LinkOutlined />}>
                View Page
              </Tag>
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="max-w-[400px]">
          <Text type="secondary" italic>
            <ExclamationCircleOutlined className="mr-2" />
            No article reference available
          </Text>
        </div>
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: "User Details",
      key: "user",
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            style={{
              backgroundColor: "#004c78",
              borderColor: "#004c78",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size="large"
            icon={<UserOutlined />}
          >
            {record?.user?.name?.charAt(0)}
          </Avatar>
          <div>
            <Text strong className="text-gray-800">
              {record.user.name}
            </Text>
            <br />
            <Text type="secondary" className="text-sm truncate">
              {record.user.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Content Reference",
      key: "contentReference",
      render: (_, record) => renderContentSource(record),
    },
    {
      title: "Feedback Items",
      key: "feedbackCount",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Badge
          count={record.feedback?.length || 0}
          showZero
          style={{
            backgroundColor: "#004c78",
            fontSize: "14px",
            padding: "0 8px",
          }}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 180,
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
          suffixIcon={<EditOutlined className="text-gray-500" />}
          className="w-full"
          dropdownStyle={{ minWidth: "150px" }}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <Option key={key} value={key}>
              <div className="flex items-center">
                {config.icon}
                <span className="ml-2" style={{ color: config.color }}>
                  {config.display}
                </span>
              </div>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Date Submitted",
      key: "created_at",
      width: 150,
      render: (_, record) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-500" />
          <Text type="secondary">
            {new Date(record?.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => showFeedbackDetails(record)}
            style={{
              backgroundColor: "#004c78",
              borderColor: "#004c78",
              borderRadius: "4px",
            }}
            size="small"
          >
            View
          </Button>
          <Button
            icon={<MailOutlined />}
            type="default"
            style={{
              color: '#52c41a',
              borderColor: '#52c41a',
              borderRadius: "4px",
            }}
            onClick={() => {
              setSelectedFeedbackForEmail(record);
              setEmailModalVisible(true);
            }}
            size="small"
          >
            Email
          </Button>
          <Button
            icon={<DeleteOutline fontSize="16" />}
            type="primary"
            danger
            onClick={() => deletehandle(record)}
            style={{
              borderRadius: "4px",
            }}
            size="small"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const navigate = useNavigate();

  // Feedback details modal component
  const FeedbackDetailsModal = () => {
    if (!currentFeedback) return null;

    const renderContentInfo = () => {
      if (currentFeedback.article) {
        return (
          <Card
            title={
              <div className="flex items-center">
                <FileTextOutlined className="text-blue-600 mr-2" />
                <span>Article Information</span>
              </div>
            }
            className="border shadow-sm"
          >
            <Title level={5}>{currentFeedback.article.title}</Title>
            <Space wrap>
              <Tag color="blue">
                <a
              onClick={
                () => {
                  navigate(`/article-preview/${currentFeedback.article.mhid}`);
                }
              }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'nonde' }}
                >
                  MHID: {currentFeedback.article.mhid}
                </a>
              </Tag>
              <Tag color="cyan">
                <a
                  href={`https://doi.org/${currentFeedback.article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  DOI: {currentFeedback.article.doi}
                </a>
              </Tag>
              <Tag color="purple">
                <CalendarOutlined className="mr-1" />
                {new Date(currentFeedback?.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Tag>
            </Space>
          </Card>
        );
      } else if (currentFeedback.page_url) {
        return (
          <Card
            title={
              <div className="flex items-center">
                <LinkOutlined className="text-blue-600 mr-2" />
                <span>Page Information</span>
              </div>
            }
            className="border shadow-sm"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>Direct Page Feedback</Text>
              <a
                href={currentFeedback.page_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  wordBreak: "break-all",
                  maxWidth: "100%",
                  display: "inline-block",
                }}
              >
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  style={{ marginRight: "8px" }}
                >
                  Visit Page
                </Button>
                {currentFeedback.page_url}
              </a>
              <Tag color="purple">
                <CalendarOutlined className="mr-1" />
                {new Date(currentFeedback?.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Tag>
            </Space>
          </Card>
        );
      } else {
        return (
          <Card
            title={
              <div className="flex items-center">
                <ExclamationCircleOutlined className="text-orange-500 mr-2" />
                <span>Content Information</span>
              </div>
            }
            className="border shadow-sm"
          >
            <Empty
              description="No article or page reference available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Tag color="orange" style={{ marginTop: "8px" }}>
              <CalendarOutlined className="mr-1" />
              {new Date(currentFeedback?.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </Tag>
          </Card>
        );
      }
    };

    return (
      <Modal
        visible={detailModalVisible}
        title={
          <div className="flex items-center">
            <MessageOutlined className="text-blue-600 mr-2 text-xl" />
            <span>Feedback Details</span>
          </div>
        }
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        bodyStyle={{
          padding: "24px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        className="feedback-detail-modal"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="border shadow-sm">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size={50}
                    style={{ backgroundColor: "#004c78" }}
                    icon={<UserOutlined />}
                  >
                    {currentFeedback?.user?.name?.charAt(0)}
                  </Avatar>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {currentFeedback.user.name}
                    </Title>
                    <Text type="secondary">{currentFeedback.user.email}</Text>
                  </div>
                </div>
                <div>
                  <Tag
                    icon={statusConfig[currentFeedback.status].icon}
                    color={statusConfig[currentFeedback.status].color}
                    style={{
                      padding: "4px 12px",
                      fontSize: "14px",
                    }}
                  >
                    {statusConfig[currentFeedback.status].display}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          <Col span={24}>{renderContentInfo()}</Col>

          <Col span={24}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageOutlined className="text-blue-600 mr-2" />
                    <span>Feedback Items</span>
                  </div>
                  <Badge
                    count={currentFeedback?.feedback?.length || 0}
                    style={{ backgroundColor: "#004c78" }}
                  />
                </div>
              }
              className="border shadow-sm"
            >
              {currentFeedback?.feedback?.length > 0 ? (
                currentFeedback.feedback.map((section, index) => (
                  <div key={index} className="mb-6">
                    <Card
                      size="small"
                      className="mb-4 border-l-4"
                      style={{ borderLeftColor: "#1890ff" }}
                    >
                      <div className="mb-3">
                        <Text strong className="text-gray-800">
                          <Badge
                            count={index + 1}
                            style={{
                              backgroundColor: "#004c78",
                              marginRight: "8px",
                            }}
                          />
                          Feedback Point
                        </Text>
                      </div>
                      <div className="mb-4 relative group">
                        <Image
                          width="100%"
                          src={section.screenshot}
                          alt="Feedback screenshot"
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                          preview={{
                            mask: (
                              <div className="flex items-center">
                                <EyeOutlined className="mr-2" />
                                <span>View Full Image</span>
                              </div>
                            ),
                          }}
                        />
                        <Tag
                          className="absolute bottom-2 right-2"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            border: "none",
                          }}
                        >
                          Fig.{index + 1}
                        </Tag>
                      </div>
                      <Divider orientation="left">
                        <Text type="secondary">Issue Details</Text>
                      </Divider>
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Text strong style={{ color: "#d48806" }}>
                            Issue:
                          </Text>
                          <Paragraph style={{ marginTop: "8px" }}>
                            {section.explanation}
                          </Paragraph>
                        </div>
                        <Divider dashed />
                        <div>
                          <Text strong style={{ color: "#389e0d" }}>
                            Suggestion:
                          </Text>
                          <Paragraph
                            style={{
                              marginTop: "8px",
                              padding: "12px",
                              backgroundColor: "rgba(82, 196, 26, 0.1)",
                              border: "1px solid rgba(82, 196, 26, 0.2)",
                              borderRadius: "4px",
                            }}
                          >
                            {section.revision || "No suggestion provided"}
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              ) : (
                <Empty
                  description="No feedback items found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <Card className="shadow-md border-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <Title level={4} className="flex items-center">
              <MailOutlined className="mr-3" />
              Research Feedback Management
            </Title>
            <Text type="secondary" className="mt-1 block">
              Total: {pagination.total} feedbacks
            </Text>
          </div>

          <div className="mt-4 lg:mt-0 w-full lg:w-auto">
            <Input.Search
              placeholder="Search by user or article title"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: "100%", maxWidth: "350px" }}
              prefix={<SearchOutlined className="text-gray-400" />}
              allowClear
            />
          </div>
        </div>

        <div className="mb-6">
          <Row gutter={16}>
            {Object.entries(statusConfig).map(([statusKey, config]) => (
              <Col xs={24} sm={8} key={statusKey}>
                <Card
                  size="small"
                  className="text-center"
                  style={{
                    borderTop: `3px solid ${config.color}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                  }}
                >
                  <Statistic
                    title={
                      <div className="flex items-center justify-center gap-2">
                        {config.icon}
                        <span>{config.display}</span>
                      </div>
                    }
                    value={statusCounts[statusKey] || 0}
                    valueStyle={{ color: config.color, fontWeight: "bold" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={searchValue ? filteredFeedbacks : feedbacks?.data}
            rowKey="id"
            loading={{
              spinning: loading,
              indicator: <Spin size="large" />,
            }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} feedbacks`,
              onChange: (page, pageSize) => {
                console.log("Pagination change:", { page, pageSize });
                handleTableChange({ current: page, pageSize, total: pagination.total });
              },
              onShowSizeChange: (current, size) => {
                console.log("Page size change:", { current, size });
                handleTableChange({ current: 1, pageSize: size, total: pagination.total });
              }
            }}
            onChange={handleTableChange}
            bordered
            scroll={{ x: 1200 }}
            rowClassName={(record, index) =>
              `transition-all duration-300 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`
            }
            locale={{
              emptyText: (
                <Empty
                  description="No feedback data found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </div>
      </Card>

      <FeedbackDetailsModal />

      {/* Send Email Modal */}
      <SendEmailModal
        visible={emailModalVisible}
        onClose={() => {
          setEmailModalVisible(false);
          setSelectedFeedbackForEmail(null);
        }}
        recipientData={
          selectedFeedbackForEmail
            ? {
                id: selectedFeedbackForEmail.id,
                name: selectedFeedbackForEmail.name,
                email: selectedFeedbackForEmail.email,
              }
            : null
        }
        recipientType="feedback"
        onSuccess={() => {
          message.success('Email sent to feedback submitter successfully');
        }}
      />
    </div>
  );
};

export default AdminFeedbackSystem;