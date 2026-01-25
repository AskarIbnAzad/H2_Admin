import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Select,
  Spin,
  Tooltip,
  message,
  Typography,
  Card,
  Avatar,
  Tabs,
  Empty,
  Divider,
  Alert,
  Badge,
} from "antd";

// Icons
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileSearchOutlined,
  SelectOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

// React Router (make sure it's imported in your original file)
import { useNavigate } from "react-router-dom";

// Custom dependencies
import Highlighter from "react-highlight-words";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AssignArticleScreen = () => {
  const navigate = useNavigate(); // For navigation to article preview

  // State for article data and pagination
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  // State for search and filtering
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // State for modals and selected items
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]); // For multiple selection
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [bulkAssignModalVisible, setBulkAssignModalVisible] = useState(false); // New modal for bulk assignment
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [articleDetail, setArticleDetail] = useState(null);
  const [articleVerifiedCount, setArticleVerifiedCount] = useState(null);
  const [assignArticleCount, setAssignArticleCount] = useState(null);

  // Reviewer filter state
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);

  // Assignment status filter state
  const [assignmentStatus, setAssignmentStatus] = useState('all'); // 'all', 'assigned', 'unassigned'

  // Add state for global stats
  const [globalStats, setGlobalStats] = useState({
    totalArticles: 0,
    assignedArticles: 0,
    verifiedArticles: 0,
  });

  console.log("assignArticleCount", assignArticleCount);
  console.log("selectedArticles", selectedArticles);

  // Load data on mount only once
  useEffect(() => {
    // Initial data load - use page 1 as default
    handlePaginationChange(1, pageSize);
    fetchUsers();
  }, []);

  // Fetch global stats on mount
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        // Use the same endpoint but without reviewer/assignment filters
        const response = await apiHandle.post("get-assignment-articles", {
          per_page: 1,
          page: 1,
        });
        if (response.data?.data) {
          setGlobalStats({
            totalArticles: response.data?.total || 0,
            assignedArticles: response.data?.data?.assignedArticles || 0,
            verifiedArticles: response.data?.data?.verifiedArticles || 0,
          });
        }
      } catch (e) {
        // fallback to 0s
        setGlobalStats({ totalArticles: 0, assignedArticles: 0, verifiedArticles: 0 });
      }
    };
    fetchGlobalStats();
  }, []);

  // Fetch articles when pagination or filters change
  const handleFetchArticles = () => {
    fetchArticles();
  };

  // Fetch articles when assignmentStatus changes
  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line
  }, [assignmentStatus]);

  // Fetch articles when reviewer changes
  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line
  }, [selectedReviewerIds]);

  // Helper: get assignment param for backend
  const getAssignmentParam = () => {
    if (assignmentStatus === 'assigned') return true;
    if (assignmentStatus === 'unassigned') return false;
    return undefined;
  };

  const handleBackendSearch = (value) => {
    setSearchText(value);
    setLoading(true);
    const requestBody = {
      per_page: pageSize,
      page: 1,
      admin_search: value,
      reviewer_id: selectedReviewerIds.length > 0 ? selectedReviewerIds : undefined,
      assignment: getAssignmentParam(),
    };
    apiHandle
      .post("get-assignment-articles", requestBody)
      .then((response) => {
        if (response.data && response.data.data && Array.isArray(response.data.data.articles)) {
          setArticles(response.data.data.articles);
          setArticleVerifiedCount(response.data?.data?.verifiedArticles);
          setAssignArticleCount(response.data?.data?.assignedArticles);
          if (response.data?.total) setTotalArticles(response.data?.total);
          setCurrentPage(1);
        } else {
          setArticles([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setArticles([]);
        message.error("Search failed. Please try again.");
      });
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const currentPageToUse = currentPage;
      const pageSizeToUse = pageSize;
      const requestBody = {
        per_page: pageSizeToUse,
        page: currentPageToUse,
        reviewer_id: selectedReviewerIds.length > 0 ? selectedReviewerIds : undefined,
        admin_search: searchText || undefined,
        assignment: getAssignmentParam(),
      };

      console.log(
        `Fetching articles: page ${currentPageToUse}, size ${pageSizeToUse}`
      );

      // Updated to use the new endpoint
      const response = await apiHandle.post(
        "get-assignment-articles",
        requestBody
      );
      console.log("response.data.data.total", response.data);

      // Handle API response with pagination data
      if (response.data) {
        // Check if data contains 'data.articles' array structure
        if (response.data.data && Array.isArray(response.data.data.articles)) {
          setArticles(response.data.data.articles);
          setArticleVerifiedCount(response.data?.data?.verifiedArticles);
          setAssignArticleCount(response.data?.data?.assignedArticles);
          // Set total from the response structure
          if (response.data?.total) {
            setTotalArticles(response.data?.total);
          }
          if (response.data?.current_page) {
            setCurrentPage(response.data?.current_page);
          }
        }
        // Check if data directly contains articles array
        else if (Array.isArray(response.data.articles)) {
          setArticles(response.data.articles);
          if (response.data.total) {
            setTotalArticles(response.data.total);
          }
          if (response.data.current_page) {
            setCurrentPage(response.data.current_page);
          }
        }
        // Fallback if the structure is just an array
        else if (Array.isArray(response.data)) {
          setArticles(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setArticles([]);
        }
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Failed to load articles. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiHandle.get("get-all-users");
      // Ensure users is always an array
      if (response.data && Array.isArray(response.data.users)) {
        // Filter only users with 'Researcher' role
        const researcherUsers = response.data.users.filter(
          (user) => user.role_id === 2 && user.status === "Active"
        );
        setUsers(researcherUsers);
      } else {
        setUsers([]);
        console.error("Unexpected users API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users. Please try again.");
      setUsers([]);
    }
  };

  const handlePaginationChange = (page, pageSizeValue) => {
    console.log(`Pagination changed: page=${page}, pageSize=${pageSizeValue}`);

    // Update state
    setCurrentPage(page);
    setPageSize(pageSizeValue);

    // Manually construct request body and fetch with the new page
    const requestBody = {
      per_page: pageSizeValue,
      page: page,
    };

    // Direct API call with the correct page - updated to use the new endpoint
    setLoading(true);
    apiHandle
      .post("get-assignment-articles", requestBody)
      .then((response) => {
        console.log("Pagination API Response:", response.data?.data);

        if (response.data) {
          // Check for data.articles structure
          if (
            response.data.data &&
            Array.isArray(response.data.data.articles)
          ) {
            setArticleVerifiedCount(response.data?.data?.verifiedArticles);
            setAssignArticleCount(response.data?.data?.assignedArticles);
            setArticles(response.data.data.articles);
            if (response.data?.total) {
              setTotalArticles(response.data?.total);
            }
            if (response.data?.current_page) {
              setCurrentPage(response.data?.current_page);
            }
            if (response.data?.assignedArticles) {
              console.log("assignedArticles", response.data?.assignedArticles);
            }
            if (response.data?.last_page) {
              // You can optionally use the last_page info if needed
              console.log(`Total pages: ${response.data?.last_page}`);
            }
          }
          // Check direct articles array
          else if (Array.isArray(response.data.articles)) {
            setArticles(response.data.articles);
            if (response.data.total) {
              setTotalArticles(response.data.total);
            }
            if (response.data.current_page) {
              setCurrentPage(response.data.current_page);
            }
          }
          // Direct array fallback
          else if (Array.isArray(response.data)) {
            setArticles(response.data);
          } else {
            console.error("Unexpected API response format:", response.data);
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        message.error("Failed to load articles. Please try again.");
        setArticles([]);
        setLoading(false);
      });
  };

  // Open the view article modal
  const handleViewArticleDetails = (record) => {
    console.log("Viewing article details:", record);
    setArticleDetail(record);
    setViewModalVisible(true);
  };

  // Navigate to article preview page
  const handleViewFullArticle = (mhid) => {
    navigate(`/article-preview/${mhid}`);
  };

  // Open the assign article modal (single article)
  const showAssignModal = (article) => {
    console.log("Show assign modal for article:", article);
    setSelectedArticle(article);
    setAssignModalVisible(true);
  };

  // Open bulk assign modal
  const showBulkAssignModal = () => {
    if (selectedArticles.length === 0) {
      message.warning("Please select at least one article to assign");
      return;
    }
    setBulkAssignModalVisible(true);
  };

  // Close modals
  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setSelectedArticle(null);
    setSelectedUser(null);
  };

  const closeBulkAssignModal = () => {
    setBulkAssignModalVisible(false);
    setSelectedUser(null);
  };

  // Handle row selection
  const rowSelection = {
    selectedRowKeys: selectedArticles.map(article => article.id),
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      console.log('selectedRows changed: ', selectedRows);
      setSelectedArticles(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedArticles([]);
  };

  // Handle Search
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (!record[dataIndex]) return false;

      // Handle nested fields like publicData.title.name
      if (dataIndex.includes(".")) {
        const fields = dataIndex.split(".");
        let val = record;
        for (const field of fields) {
          if (val && val[field]) {
            val = val[field];
          } else {
            return false;
          }
        }
        return val.toString().toLowerCase().includes(value.toLowerCase());
      }

      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Handle filters and sorters
  const handleTableChange = (pagination, filters, sorter, extra) => {
    console.log(
      `Table change: action=${extra.action}, page=${pagination.current}`
    );

    // Set filter and sort info
    setFilteredInfo(filters);
    setSortedInfo(sorter);

    // If reviewer filter is applied, update selectedReviewerIds for backend filtering
    if (filters.reviewer && filters.reviewer.length > 0) {
      setSelectedReviewerIds(filters.reviewer);
    } else if (filters.reviewer && filters.reviewer.length === 0) {
      setSelectedReviewerIds([]);
    }

    // Handle pagination separately via dedicated function
    if (extra.action === "paginate") {
      handlePaginationChange(pagination.current, pagination.pageSize);
    }

    // If the action was 'filter' or 'sort', reset to page 1 and fetch
    if (extra.action === "filter" || extra.action === "sort") {
      // For filtering and sorting, we always go back to page 1
      handlePaginationChange(1, pagination.pageSize);
    }
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setCurrentPage(1);
    setSelectedReviewerIds([]);
    setTimeout(() => {
      fetchArticles();
    }, 0);
  };

  // Single article assignment
  const assignArticle = async () => {
    if (!selectedArticle || !selectedUser) {
      message.error("Please select both an article and a reviewer");
      return;
    }

    setAssignLoading(true);
    try {
      await apiHandle.post("assign-reviewer", {
        article_id: selectedArticle.id,
        reviewer_id: selectedUser.id,
      });

      message.success({
        content: `Successfully assigned article to ${selectedUser.name}`,
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });

      setAssignModalVisible(false);
      setSelectedArticle(null);
      setSelectedUser(null);

      // Refresh current page
      handlePaginationChange(currentPage, pageSize);
    } catch (error) {
      console.error("Error assigning article:", error);
      message.error({
        content: "Failed to assign article. Please try again.",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setAssignLoading(false);
    }
  };

  // Bulk article assignment
  const assignMultipleArticles = async () => {
    if (selectedArticles.length === 0 || !selectedUser) {
      message.error("Please select articles and a reviewer");
      return;
    }

    setAssignLoading(true);
    try {
      // Create an array of assignment requests
      const assignmentPromises = selectedArticles.map(article =>
        apiHandle.post("assign-reviewer", {
          article_id: article.id,
          reviewer_id: selectedUser.id,
        })
      );

      // Execute all assignments
      await Promise.all(assignmentPromises);

      message.success({
        content: `Successfully assigned ${selectedArticles.length} articles to ${selectedUser.name}`,
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });

      setBulkAssignModalVisible(false);
      setSelectedUser(null);
      setSelectedArticles([]);

      // Refresh current page
      handlePaginationChange(currentPage, pageSize);
    } catch (error) {
      console.error("Error assigning articles:", error);
      message.error({
        content: "Failed to assign some articles. Please try again.",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setAssignLoading(false);
    }
  };

  // Render status tags with improved styling
  const renderStatusTag = (status) => {
    let color;
    let icon;

    switch (status?.toLowerCase()) {
      case "verified":
        color = "success";
        icon = <CheckCircleOutlined />;
        break;
      case "in review":
        color = "processing";
        icon = <ClockCircleOutlined />; // Changed to a clock icon
        break;
      case "draft":
        color = "default";
        icon = <EditOutlined />; // Better icon for Draft
        break;
      case "unverified":
        color = "warning";
        icon = <InfoCircleOutlined />;
        break;
      default:
        color = "default";
        icon = <InfoCircleOutlined />;
    }

    return (
      <Tag
        color={color}
        icon={icon}
        style={{ fontWeight: "medium", padding: "2px 8px" }}
      >
        {status || "Unknown"}
      </Tag>
    );
  };

  // Function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Helper function to check if a reviewer is assigned
  const hasReviewer = (record) => {
    // First check in reviewer object (from API data structure)
    if (record.reviewer && record.reviewer.id) {
      return true;
    }

    // Then check in assigned_to object (fallback)
    if (record.assigned_to && record.assigned_to.id) {
      return true;
    }

    return false;
  };

  // Helper function to get reviewer info consistently
  const getReviewerInfo = (record) => {
    // console.log("record",record);

    // Prioritize reviewer object (from API data structure)
    if (record.reviewer && record.reviewer.id) {
      return record.reviewer;
    }

    // Fallback to assigned_to (old structure)
    if (record.assigned_to && record.assigned_to.id) {
      return record.assigned_to;
    }

    return null;
  };

  // Get the count of verified articles for a reviewer
  const getReviewerVerifiedCount = (reviewerId) => {
    const user = users.find((u) => u.id === reviewerId);
    return user ? user.verified_count || 0 : 0;
  };

  // Get the count of assigned articles for a reviewer
  const getReviewerAssignedCount = (reviewerId) => {
    const user = users.find((u) => u.id === reviewerId);
    return user ? user.assigned_count || 0 : 0;
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
    },
    {
      title: "MHID",
      dataIndex: "mhid",
      key: "mhid",
      ...getColumnSearchProps("mhid"),
    },
    {
      title: "Title",
      key: "title",
      render: (record) => {
        // Get title from the nested structure
        let title = "";
        if (
          record.publicData &&
          record.publicData.title &&
          record.publicData.title.name
        ) {
          title = record.publicData.title.name;
        }

        return (
          <Tooltip title={title} placement="topLeft">
            <div
              style={{
                maxWidth: 300,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title || "No Title"}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
      filters: [
        { text: "Verified", value: "Verified" },
        { text: "In Review", value: "In Review" },
        { text: "Draft", value: "Draft" },
        { text: "Unverified", value: "Unverified" },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "DOI",
      key: "doi",
      render: (record) => {
        let doi = "N/A";
        if (
          record.publicData &&
          record.publicData.doi &&
          record.publicData.doi.name
        ) {
          doi = record.publicData.doi.name;
        } else if (record.doi) {
          doi = record.doi;
        }
        return doi;
      },
    },
    {
      title: "Year",
      key: "year",
      render: (record) => {
        let year = "N/A";
        if (
          record.publicData &&
          record.publicData.year &&
          record.publicData.year.name
        ) {
          year = record.publicData.year.name;
        }
        return year;
      },
      sorter: (a, b) => {
        const yearA = a.publicData?.year?.name || 0;
        const yearB = b.publicData?.year?.name || 0;
        return yearA - yearB;
      },
      sortOrder: sortedInfo.columnKey === "year" && sortedInfo.order,
      filters: [
        { text: "2023", value: 2023 },
        { text: "2022", value: 2022 },
        { text: "2021", value: 2021 },
        { text: "2020", value: 2020 },
        { text: "Older", value: "older" },
      ],
      filteredValue: filteredInfo.year || null,
      onFilter: (value, record) => {
        const year = record.publicData?.year?.name;
        if (value === "older") {
          return year && year < 2020;
        }
        return year === value;
      },
    },
    {
      title: "Current Reviewer",
      key: "reviewer",
      filters: users.map((user) => ({
        text: (
          <span>
            {user.name} ({user.email})
            <Tag color="blue" style={{ marginLeft: 8 }}>{user.verified_count || 0} Verified</Tag>
            <Tag color="green" style={{ marginLeft: 4 }}>{user.assigned_count || 0} Assigned</Tag>
          </span>
        ),
        value: user.id,
      })),
      filteredValue: filteredInfo.reviewer || null,
      render: (record) => {
        const reviewer = getReviewerInfo(record);
        if (reviewer) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ marginRight: 8, backgroundColor: "#1890ff" }}
              />
              <span>{reviewer.name}</span>
            </div>
          );
        } else {
          return <Text type="secondary">Not assigned</Text>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 240, // Increased width to accommodate the new button
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<UserSwitchOutlined />}
            onClick={() => showAssignModal(record)}
            size="small"
          >
            Assign
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewArticleDetails(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => handleViewFullArticle(record.mhid)}
            size="small"
          >
            Full
          </Button>
        </Space>
      ),
    },
  ];

  // Custom Timeline component
  const Timeline = ({ children }) => (
    <ul
      className="ant-timeline"
      style={{ margin: 0, padding: 0, listStyle: "none" }}
    >
      {children}
    </ul>
  );

  Timeline.Item = ({ children }) => (
    <li
      className="ant-timeline-item"
      style={{
        position: "relative",
        margin: "0 0 20px 20px",
        paddingLeft: "20px",
      }}
    >
      <div
        className="ant-timeline-item-tail"
        style={{
          position: "absolute",
          left: 0,
          height: "100%",
          borderLeft: "2px solid #e8e8e8",
        }}
      ></div>
      <div
        className="ant-timeline-item-head"
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#1890ff",
          left: "-4px",
        }}
      ></div>
      <div
        className="ant-timeline-item-content"
        style={{ marginBottom: "10px" }}
      >
        {children}
      </div>
    </li>
  );

  // Custom Statistic component
  const Statistic = ({ title, value, suffix }) => (
    <div>
      <div style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.45)" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "24px",
          color: "rgba(0, 0, 0, 0.85)",
          marginTop: "4px",
        }}
      >
        {value}
        {suffix && (
          <span
            style={{
              fontSize: "16px",
              color: "rgba(0, 0, 0, 0.45)",
              marginLeft: "4px",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  // Count assigned articles based on either reviewer or assigned_to fields
  const countAssignedArticles = () => {
    if (!articles || !Array.isArray(articles)) return 0;

    return articles.filter((article) => hasReviewer(article)).length;
  };

  return (
    <div className="assignment-container" style={{ padding: "24px" }}>
      <Card className="dashboard-card" bordered={false}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Title level={4}>
            <FileTextOutlined /> Article Assignment Management
          </Title>
          <Space>
            <Button onClick={clearFilters} icon={<FilterOutlined />}>
              Clear Filters
            </Button>
            <Button
              type="primary"
              onClick={handleFetchArticles}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </div>

        {/* Reviewer Filter Dropdown */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Assignment Status Filter */}
          <Select
            style={{ width: 150 }}
            value={assignmentStatus}
            onChange={setAssignmentStatus}
          >
            <Option value="all">All</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="unassigned">Unassigned</Option>
          </Select>
          {/* Reviewer Filter Dropdown - only show for 'all' or 'assigned' */}
          {(assignmentStatus === 'all' || assignmentStatus === 'assigned') && (
            <Select
              mode="multiple"
              allowClear
              showSearch
              style={{ width: 600 }}
              placeholder="Filter by Reviewer"
              value={selectedReviewerIds}
              onChange={value => setSelectedReviewerIds(value)}
              optionFilterProp="children"
              filterOption={(input, option) => {
                const user = users.find(u => u.id === option.value);
                if (!user) return false;
                const name = user.name?.toLowerCase() || "";
                const email = user.email?.toLowerCase() || "";
                return (
                  name.includes(input.toLowerCase()) ||
                  email.includes(input.toLowerCase())
                );
              }}
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                  <Tag color="blue" style={{ marginLeft: 8 }}>{getReviewerVerifiedCount(user.id)} Verified</Tag>
                  <Tag color="green" style={{ marginLeft: 4 }}>{getReviewerAssignedCount(user.id)} Assigned</Tag>
                </Option>
              ))}
            </Select>
          )}
          {/* Searchbar for articles */}
          <Input.Search
            placeholder="Search by Title or MHID"
            allowClear
            enterButton
            size="large"
            style={{ maxWidth: 400 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={handleBackendSearch}
          />
        </div>

        {/* Selection Info and Bulk Actions */}
        {selectedArticles.length > 0 && (
          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <Badge count={selectedArticles.length} style={{ backgroundColor: '#1890ff' }} />
                  <span style={{ marginLeft: 8 }}>
                    {selectedArticles.length} article{selectedArticles.length > 1 ? 's' : ''} selected
                  </span>
                </span>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<CheckSquareOutlined />}
                    onClick={showBulkAssignModal}
                  >
                    Bulk Assign
                  </Button>
                  <Button onClick={clearSelection}>
                    Clear Selection
                  </Button>
                </Space>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <div
          className="stats-row"
          style={{ display: "flex", marginBottom: 20 }}
        >
        <Card
            style={{ flex: 1, marginRight: 12, cursor: "pointer" }}
            size="small"
            hoverable
            onClick={() => navigate("/articles")}
          >
            <Statistic title="Total Articles" value={globalStats.totalArticles} />
          </Card>
          <Card
            style={{ flex: 1, marginRight: 12, cursor: 'pointer' }}
            size="small"
            hoverable
            onClick={() => setAssignmentStatus('assigned')}
          >
            <Statistic
              title="Assigned Articles"
              value={globalStats.assignedArticles}
              suffix={`/ ${globalStats.totalArticles}`}
            />
          </Card>
            <Card
              style={{ flex: 1, marginRight: 12, cursor: 'pointer' }}
              size="small"
              hoverable
              onClick={() => {
                setAssignmentStatus("assigned");
                setSelectedReviewerIds([]); 
              }}
            >
              <Statistic
                title="Available Reviewers"
                value={users?.length || 0}
            />
            </Card>
          <Card style={{ flex: 1 }} size="small">
            <Statistic
              title="Verified Articles"
              value={globalStats.verifiedArticles}
              suffix={`/ ${globalStats.totalArticles}`}
            />
          </Card>
          {/* Reviewer stats tiles (match style, support multiple) */}
          {selectedReviewerIds.length > 0 && (
            selectedReviewerIds.slice(0, 3).map((reviewer_id, idx) => {
              const reviewer = users.find(u => u.id === reviewer_id);
              if (!reviewer) return null;
              return (
                <Card key={reviewer_id} style={{ flex: 1, marginLeft: 12 }} size="small">
                  <Statistic
                    title={<span>Reviewer: {reviewer.name}</span>}
                    value={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 16 }}><b>Verified:</b> {reviewer.verified_count || 0}</span>
                        <span style={{ fontSize: 16 }}><b>Assigned:</b> {reviewer.assigned_count || 0}</span>
                      </div>
                    }
                  />
                </Card>
              );
            })
          )}
          {/* If more than 3 reviewers, show a summary tile */}
          {selectedReviewerIds.length > 3 && (
            <Card style={{ flex: 1, marginLeft: 12 }} size="small">
              <Statistic
                title="Multiple Reviewers Selected"
                value={<span style={{ fontSize: 16 }}>{selectedReviewerIds.length} reviewers</span>}
                suffix={<span style={{ fontSize: 14, color: '#888' }}>showing first 3</span>}
              />
            </Card>
          )}
          {/* Reviewer cumulative stats tile (single tile for all selected reviewers) */}
          {selectedReviewerIds.length > 0 && (() => {
            const selectedReviewers = users.filter(u => selectedReviewerIds.includes(u.id));
            const totalVerified = selectedReviewers.reduce((sum, u) => sum + (u.verified_count || 0), 0);
            const totalAssigned = selectedReviewers.reduce((sum, u) => sum + (u.assigned_count || 0), 0);
            return (
              <Card style={{ flex: 1, marginLeft: 12 }} size="small">
                <Statistic
                  title={
                    selectedReviewerIds.length === 1
                      ? `Reviewer: ${selectedReviewers[0]?.name}`
                      : `Selected Reviewers (${selectedReviewerIds.length})`
                  }
                  value={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 16 }}><b>Verified:</b> {totalVerified}</span>
                      <span style={{ fontSize: 16 }}><b>Assigned:</b> {totalAssigned}</span>
                    </div>
                  }
                />
              </Card>
            );
          })()}
        </div>

        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          rowSelection={{
            ...rowSelection,
            type: 'checkbox',
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalArticles,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            // Use the direct function for both onChange and onShowSizeChange
            onChange: (page, pageSize) =>
              handlePaginationChange(page, pageSize),
            onShowSizeChange: (current, size) =>
              handlePaginationChange(current, size),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          size="middle"
          scroll={{ x: 1200 }}
          rowClassName={(record) =>
            record.id === selectedArticle?.id ? "ant-table-row-selected" : ""
          }
          style={{ minHeight: "500px" }}
        />
      </Card>

      {/* View Article Modal */}
      <Modal
        title={
          <div>
            <FileTextOutlined /> Article Details
            {articleDetail && (
              <div style={{ marginTop: 8 }}>
                <Text strong>{articleDetail?.mhid}</Text>
              </div>
            )}
          </div>
        }
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={[
          <Button
            key="fullArticle"
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleViewFullArticle(articleDetail?.mhid);
            }}
          >
            View Full Article
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              showAssignModal(articleDetail);
            }}
          >
            Assign Reviewer
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {articleDetail && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Assignment Details" key="1">
              <div className="assignment-details">
                <Card title="Current Assignment" bordered={false}>
                  {hasReviewer(articleDetail) ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1890ff", marginRight: 16 }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {getReviewerInfo(articleDetail).name}
                        </Title>
                        <Text type="secondary">
                          {getReviewerInfo(articleDetail).email}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Tag
                            color={
                              getReviewerInfo(articleDetail).role_id === 1
                                ? "red"
                                : "green"
                            }
                          >
                            {getReviewerInfo(articleDetail).role?.name}
                          </Tag>
                          <Tag color="blue">
                            Assigned on:{" "}
                            {formatDate(
                              articleDetail.assigned_at || new Date()
                            )}
                          </Tag>
                          <Tag
                            color={
                              getReviewerInfo(articleDetail).status === "Active"
                                ? "green"
                                : "default"
                            }
                          >
                            {getReviewerInfo(articleDetail).status}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Empty description="Not currently assigned to any reviewer" />
                  )}
                </Card>
              </div>
            </TabPane>

            <TabPane tab="Status History" key="2">
              <div className="status-history-section">
                <div style={{ marginBottom: 20 }}>
                  <Title level={5}>Article Status Timeline</Title>
                  <Timeline>
                    <Timeline.Item>
                      Created article - {formatDate(articleDetail.created_at)}
                    </Timeline.Item>
                    <Timeline.Item>
                      Updated article - {formatDate(articleDetail.updated_at)}
                    </Timeline.Item>
                    <Timeline.Item>
                      Current status: {renderStatusTag(articleDetail.status)}
                    </Timeline.Item>
                    {hasReviewer(articleDetail) && (
                      <Timeline.Item>
                        Assigned to {getReviewerInfo(articleDetail).name} -{" "}
                        {formatDate(articleDetail.assigned_at || new Date())}
                      </Timeline.Item>
                    )}
                  </Timeline>
                </div>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Single Assign Article Modal */}
      <Modal
        title={
          <div>
            <UserSwitchOutlined /> Assign Article to Reviewer
            {selectedArticle && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Article: </Text>
                <Text strong>{selectedArticle?.mhid}</Text>
                <div style={{ marginTop: 8 }}>
                  <Title
                    level={5}
                    ellipsis={{ rows: 1 }}
                    style={{ maxWidth: "100%" }}
                  >
                    {selectedArticle?.publicData?.title?.name || "No Title"}
                  </Title>
                </div>
              </div>
            )}
          </div>
        }
        visible={assignModalVisible}
        onCancel={closeAssignModal}
        width={600}
        footer={[
          <Button key="cancel" onClick={closeAssignModal}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={assignArticle}
            loading={assignLoading}
            disabled={!selectedUser}
          >
            Assign
          </Button>,
        ]}
      >
        {selectedArticle && (
          <>
            <Card className="article-info" style={{ marginBottom: 16 }}>
              <div className="article-details">
                <p>
                  <strong>MHID:</strong> {selectedArticle.mhid}
                </p>
                <p>
                  <strong>DOI:</strong>{" "}
                  {selectedArticle.publicData?.doi?.name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {renderStatusTag(selectedArticle.status)}
                </p>
                <p>
                  <strong>Current Reviewer:</strong>{" "}
                  {hasReviewer(selectedArticle) ? (
                    <Tag color="blue" icon={<UserOutlined />}>
                      {getReviewerInfo(selectedArticle).name}
                    </Tag>
                  ) : (
                    <Tag color="default">Not assigned</Tag>
                  )}
                </p>
              </div>
              {hasReviewer(selectedArticle) && (
                <div
                  className="warning-box"
                  style={{
                    backgroundColor: "#fffbe6",
                    padding: 12,
                    borderRadius: 4,
                    marginTop: 10,
                  }}
                >
                  <Text type="warning">
                    <InfoCircleOutlined /> Note: This article is already
                    assigned to a reviewer. Reassigning will remove the current
                    assignment.
                  </Text>
                </div>
              )}
            </Card>

            <div className="select-reviewer-section">
              <Title level={5}>
                <TeamOutlined /> Select Reviewer
              </Title>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a reviewer"
                optionFilterProp="children"
                onChange={(value) => {
                  const user = users.find((u) => u.id === value);
                  setSelectedUser(user);
                }}
                filterOption={(input, option) => {
                  if (
                    !option ||
                    !option.children ||
                    !option.children.props ||
                    !option.children.props.children
                  ) {
                    return false;
                  }
                  const childText =
                    option.children.props.children[1].props.children[0];
                  return childText.toLowerCase().includes(input.toLowerCase());
                }}
                size="large"
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ marginRight: 8, backgroundColor: "#1890ff" }}
                      />
                      <span>
                        {user.name} ({user.email})
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            {selectedUser && (
              <Card className="selected-user-card" style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff", marginRight: 16 }}
                  />
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {selectedUser.name}
                    </Title>
                    <Text type="secondary">{selectedUser.email}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag
                        color={selectedUser.role_id === 1 ? "red" : "green"}
                      >
                        {selectedUser.role?.name}
                      </Tag>
                      <Tag
                        color={
                          selectedUser.status === "Active" ? "blue" : "default"
                        }
                      >
                        {selectedUser.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </Modal>

      {/* Bulk Assign Modal */}
      <Modal
        title={
          <div>
            <CheckSquareOutlined /> Bulk Assign Articles to Reviewer
            <div style={{ marginTop: 8 }}>
              <Badge count={selectedArticles.length} style={{ backgroundColor: '#1890ff' }} />
              <span style={{ marginLeft: 8 }}>
                {selectedArticles.length} article{selectedArticles.length > 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        }
        visible={bulkAssignModalVisible}
        onCancel={closeBulkAssignModal}
        width={700}
        footer={[
          <Button key="cancel" onClick={closeBulkAssignModal}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={assignMultipleArticles}
            loading={assignLoading}
            disabled={!selectedUser}
          >
            Assign All Selected Articles
          </Button>,
        ]}
      >
        {/* Selected Articles List */}
        <Card title="Selected Articles" style={{ marginBottom: 16 }} size="small">
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {selectedArticles.map((article, index) => (
              <div key={article.id} style={{ 
                padding: '8px 0', 
                borderBottom: index < selectedArticles.length - 1 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <Text strong>{article.mhid}</Text>
                  <br />
                  <Text type="secondary" ellipsis style={{ maxWidth: 300 }}>
                    {article.publicData?.title?.name || "No Title"}
                  </Text>
                </div>
                <div>
                  {renderStatusTag(article.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviewer Selection */}
        <div className="select-reviewer-section">
          <Title level={5}>
            <TeamOutlined /> Select Reviewer
          </Title>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a reviewer for all selected articles"
            optionFilterProp="children"
            onChange={(value) => {
              const user = users.find((u) => u.id === value);
              setSelectedUser(user);
            }}
            filterOption={(input, option) => {
              if (
                !option ||
                !option.children ||
                !option.children.props ||
                !option.children.props.children
              ) {
                return false;
              }
              const childText =
                option.children.props.children[1].props.children[0];
              return childText.toLowerCase().includes(input.toLowerCase());
            }}
            size="large"
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ marginRight: 8, backgroundColor: "#1890ff" }}
                  />
                  <span>
                    {user.name} ({user.email})
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {selectedUser && (
          <Card className="selected-user-card" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff", marginRight: 16 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {selectedUser.name}
                </Title>
                <Text type="secondary">{selectedUser.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={selectedUser.role === "Admin" ? "red" : "green"}
                  >
                    {selectedUser.role}
                  </Tag>
                  <Tag
                    color={
                      selectedUser.status === "Active" ? "blue" : "default"
                    }
                  >
                    {selectedUser.status}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default AssignArticleScreen;