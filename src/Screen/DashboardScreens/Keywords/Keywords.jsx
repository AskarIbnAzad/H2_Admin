import React, { useState, useEffect } from "react";
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
  Tag,
  Typography,
  Spin,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";

const { Title } = Typography;
const { Option } = Select;

const Keywords = () => {
  // State management
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [form] = Form.useForm();

  // Fetch keywords on component mount and pagination change
  useEffect(() => {
    fetchKeywords();
    // //
  }, [pagination.current]);

  // Function to fetch keywords
  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const response = await apiHandle.get(
        `get-keywords?page=${pagination.current}`
      );

      if (response.status) {
        setKeywords(response.data?.keywords || []);
        setPagination({
          ...pagination,
          current: response.current_page,
          total: response.total,
          pageSize: response.per_page,
        });
      } else {
        message.error("Failed to fetch keywords");
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
      message.error("An error occurred while fetching keywords");
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignment counts for all keywords
  const fetchAssignmentCounts = async () => {
    try {
      const response = await apiHandle.get('/keyword-assignment-counts');
      setAssignmentCounts(response.data?.counts || {});
    } catch (error) {
      console.error("Error fetching assignment counts:", error);
    }
  };

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Search filter functionality
  const handleSearch = (value) => {
    setSearchText(value);
  };

  console.log("keywords", keywords);

  const filteredKeywords = keywords?.filter(
    (item) =>
      item.keyword.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase())
  );

  // Modal handlers
  const showModal = (record = null) => {
    setEditingKeyword(record);
    if (record) {
      form.setFieldsValue({
        keyword: record.keyword,
        type: record.type,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingKeyword(null);
    form.resetFields();
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let response;
      if (editingKeyword) {
        // Update existing keyword
        response = await apiHandle.post(
          `add-update-keyword/${editingKeyword.id}`,
          values
        );
        message.success("Keyword updated successfully");
      } else {
        // Add new keyword
        response = await apiHandle.post("add-update-keyword", values);
        message.success("Keyword added successfully");
      }

      if (response) {
        setIsModalVisible(false);
        fetchKeywords();
        // //
      }
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save keyword");
    } finally {
      setLoading(false);
    }
  };

  // Delete keyword handler
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await apiHandle.post(`delete-keyword/${id}`);
      message.success("Keyword deleted successfully");
      fetchKeywords();
      // //
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete keyword");
    } finally {
      setLoading(false);
    }
  };

  // Handle article assignment modal
  const handleManageArticles = (keyword) => {
    setSelectedKeyword(keyword);
    setIsAssignModalVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Keyword",
      dataIndex: "keyword",
      key: "keyword",
      width: "25%",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (type) => (
        <Tag color={type === "Primary" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Assigned Articles",
      key: "assignedCount",
      width: "15%",
      render: (_, record) => (
        <Badge 
          count={assignmentCounts[record.id] || 0} 
          style={{ backgroundColor: '#004c78' }}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
            style={{
              backgroundColor: "#004c78",
            }}
          >
            Edit
          </Button>
          <Button
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              borderColor: "#1890ff",
            }}
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleManageArticles(record)}
          >
            Articles
            <Badge 
              count={record.articles_count || 0} 
              style={{ backgroundColor: '#ff4d4f', marginLeft: 4 }}
            />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this keyword?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                backgroundColor: "#fff1f0",
                color: "#cf1322",
                borderColor: "#ffa39e",
              }}
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Main rendering
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {/* <Title level={2} className="m-0">Keywords Management</Title> */}
        <div className="flex space-x-5 items-center mb-6">
          <BackButton path={"/DataManager"} />
          <h1 className="text-2xl font-bold">Keywords Management</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          //   className="bg-[#004c78]"
          style={{
            backgroundColor: "#004c78",
          }}
        >
          Add Keyword
        </Button>
      </div>

      {/* Search box */}
      <div className="mb-6">
        <Input
          placeholder="Search keywords..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-full md:w-96"
        />
      </div>

      {/* Keywords table */}
      <Spin spinning={loading} tip="Loading...">
        <Table
          columns={columns}
          dataSource={searchText ? filteredKeywords : keywords}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          className="shadow-md rounded-md overflow-hidden"
        />
      </Spin>

      {/* Add/Edit Modal */}
      <Modal
        title={editingKeyword ? "Edit Keyword" : "Add New Keyword"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="bg-[#004c78]"
          >
            {editingKeyword ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="keyword"
            label="Keyword"
            rules={[{ required: true, message: "Please enter a keyword" }]}
          >
            <Input placeholder="Enter keyword" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select a type">
              <Option value="Primary">Primary</Option>
              <Option value="Secondary">Secondary</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Article Assignment Modal */}
      <ArticleAssignmentModal
        visible={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedKeyword(null);
        }}
        selectedItem={selectedKeyword}
        assignmentType="keyword"
        itemNameField="keyword"
        onAssignmentChange={
          () => {
            fetchKeywords();
          }
        }
      />
    </div>
  );
};

export default Keywords;
