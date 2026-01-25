import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Tooltip,
  message,
  Typography,
  Card,
  Avatar,
  Tabs,
  Empty,
  Divider,
  Badge,
  Statistic,
  Progress,
  Select,
} from "antd";

// Icons
import {
  SearchOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";


// React Router
import { useNavigate } from "react-router-dom";

// Custom dependencies
import Highlighter from "react-highlight-words";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import { useDispatch, useSelector } from "react-redux";
import { clearLog, setShowLogModal } from "../../../Store/slices/bulk_upload_log_slice";
import { resetBulkProgress, setBulkProgress, setShowBulkProgress } from "../../../Store/slices/bulk_upload_slice";
import { bulkUploadFilesThunk } from "../../../Store/slices/bulk_upload_thunks";
import BulkUploadModal from "../../../Component/Modal/BulkUploadModal";
import GlobalBulkUploadProgress from "../../../Component/GlobalBulkUploadProgress";
import { colorTheme } from "../../../Utils/colortheme";


const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ResearcherArticlesScreen = () => {
  const navigate = useNavigate();

  // State for article data and pagination
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);

  // State for researcher's own articles
  const [ownArticles, setOwnArticles] = useState([]);
  const [ownLoading, setOwnLoading] = useState(false);
  const [ownCurrentPage, setOwnCurrentPage] = useState(1);
  const [ownPageSize, setOwnPageSize] = useState(10);
  const [totalOwnArticles, setTotalOwnArticles] = useState(0);

  // Active tab state
  const [activeTab, setActiveTab] = useState("own");


  // Bulk upload state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const showBulkProgress = useSelector(state => state.bulkUpload.showBulkProgress);
  const bulkProgress = useSelector(state => state.bulkUpload.bulkProgress);
  const [bulkError, setBulkError] = useState(null);
  const dispatch = useDispatch();

  const handleBulkFileChange = (e) => {
    setBulkError(null);
    let files = Array.from(e.target.files);
    // Only allow PDFs
    const nonPdf = files.find(f => f.type !== 'application/pdf');
    if (nonPdf) {
      setBulkError('Only PDF files are allowed.');
      return;
    }
    // Limit to 20 files
    if (files.length > 20) {
      setBulkError('You can upload a maximum of 20 PDF files at a time.');
      files = files.slice(0, 20);
    }
    setBulkFiles(files);
  };

  const handleRemoveBulkFile = (idx) => {
    setBulkFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBulkUpload = async () => {
    if (!bulkFiles.length) return;
    setBulkUploading(true);
    setBulkError(null);
    dispatch(clearLog());
    dispatch(setShowBulkProgress(true));
    dispatch(setBulkProgress(0));
    setBulkModalOpen(false);
    try {
      await dispatch(bulkUploadFilesThunk({
        files: bulkFiles,
        onError: (msg) => setBulkError(msg),
        onComplete: () => {
          setBulkFiles([]);
          fetchArticles();
          setBulkUploading(false);
          setTimeout(() => {
            dispatch(resetBulkProgress());
            window.__bulkProgress = 0;
            dispatch(setShowLogModal(true));
          }, 1000);
        }
      }));
    } catch (err) {
      setBulkUploading(false);
      setBulkError('Bulk upload failed.');
    }
  };
  // State for search and filtering
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // State for modals
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [articleDetail, setArticleDetail] = useState(null);
  const [statsVisible, setStatsVisible] = useState(true);

  // Stats
  const [completedArticles, setCompletedArticles] = useState(0);
  const [inProgressArticles, setInProgressArticles] = useState(0);
  const [unverifiedArticles, setUnverifiedArticles] = useState(0);

  // Load data on mount
  useEffect(() => {
    if (activeTab === "assigned") {
      fetchArticles();
    } else if (activeTab === "own") {
      fetchOwnArticles();
    }
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Create request body with pagination parameters
      const requestBody = {
        per_page: pageSize,
        page: currentPage,
      };

      // Using the researcher's assigned articles endpoint
      const response = await apiHandle.post(
        "get-researcher-articles",
        requestBody
      );
      console.log("API Response:", response.data);

      if (response.data) {
        // Handle various response structures
        if (response.data.data && Array.isArray(response.data.data.articles)) {
          setArticles(response.data.data.articles);
          setTotalArticles(
            response.data.data.total || response.data.data.articles.length
          );

          // Update stats
          updateArticleStats(response.data.data.articles);
        } else if (Array.isArray(response.data.articles)) {
          setArticles(response.data.articles);
          setTotalArticles(
            response.data.total || response.data.articles.length
          );

          // Update stats
          updateArticleStats(response.data.articles);
        } else if (Array.isArray(response.data)) {
          setArticles(response.data);
          setTotalArticles(response.data.length);

          // Update stats
          updateArticleStats(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setArticles([]);
        }
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Failed to load your assigned articles. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch researcher's own articles
  const fetchOwnArticles = async () => {
    setOwnLoading(true);
    try {
      const requestBody = {
        per_page: ownPageSize,
        page: ownCurrentPage,
      };

      const response = await apiHandle.post("researcher-articles", requestBody);
      console.log("Own Articles API Response:", response.data);

      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data.articles)) {
          setOwnArticles(response.data.data.articles);
          setTotalOwnArticles(
            response.data.data.total || response.data.data.articles.length
          );
        } else if (Array.isArray(response.data.articles)) {
          setOwnArticles(response.data.articles);
          setTotalOwnArticles(
            response.data.total || response.data.articles.length
          );
        } else if (Array.isArray(response.data)) {
          setOwnArticles(response.data);
          setTotalOwnArticles(response.data.length);
        } else {
          console.error("Unexpected API response format:", response.data);
          setOwnArticles([]);
        }
      } else {
        setOwnArticles([]);
      }
    } catch (error) {
      console.error("Error fetching own articles:", error);
      message.error("Failed to load your submitted articles. Please try again.");
      setOwnArticles([]);
    } finally {
      setOwnLoading(false);
    }
  };

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
        icon = <ClockCircleOutlined />;
        break;
      case "draft":
        color = "default";
        icon = <EditOutlined />;
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

  const updateArticleStats = (articles) => {
    if (!articles || !Array.isArray(articles)) return;

    const completed = articles.filter((a) => a.status === "Verified").length;
    const inProgress = articles.filter((a) => a.status === "In Review").length;
    const unverified = articles.filter((a) => a.status === "Unverified").length;

    setCompletedArticles(completed);
    setInProgressArticles(inProgress);
    setUnverifiedArticles(unverified);
  };

  const handlePaginationChange = (page, pageSizeValue) => {
    if (activeTab === "assigned") {
      setCurrentPage(page);
      setPageSize(pageSizeValue);

      // Create request body with pagination parameters
      const requestBody = {
        per_page: pageSizeValue,
        page: page,
      };

      setLoading(true);
      apiHandle
        .post("get-researcher-articles", requestBody)
        .then((response) => {
          if (response.data) {
            if (
              response.data.data &&
              Array.isArray(response.data.data.articles)
            ) {
              setArticles(response.data.data.articles);
              setTotalArticles(
                response.data.data.total || response.data.data.articles.length
              );
            } else if (Array.isArray(response.data.articles)) {
              setArticles(response.data.articles);
              setTotalArticles(
                response.data.total || response.data.articles.length
              );
            } else if (Array.isArray(response.data)) {
              setArticles(response.data);
              setTotalArticles(response.data.length);
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
    } else if (activeTab === "own") {
      setOwnCurrentPage(page);
      setOwnPageSize(pageSizeValue);

      const requestBody = {
        per_page: pageSizeValue,
        page: page,
      };

      setOwnLoading(true);
      apiHandle
        .post("researcher-articles", requestBody)
        .then((response) => {
          if (response.data) {
            if (
              response.data.data &&
              Array.isArray(response.data.data.articles)
            ) {
              setOwnArticles(response.data.data.articles);
              setTotalOwnArticles(
                response.data.data.total || response.data.data.articles.length
              );
            } else if (Array.isArray(response.data.articles)) {
              setOwnArticles(response.data.articles);
              setTotalOwnArticles(
                response.data.total || response.data.articles.length
              );
            } else if (Array.isArray(response.data)) {
              setOwnArticles(response.data);
              setTotalOwnArticles(response.data.length);
            } else {
              console.error("Unexpected API response format:", response.data);
              setOwnArticles([]);
            }
          } else {
            setOwnArticles([]);
          }
          setOwnLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching own articles:", error);
          message.error("Failed to load your articles. Please try again.");
          setOwnArticles([]);
          setOwnLoading(false);
        });
    }
  };

  // View article details
  const handleViewArticleDetails = (record) => {
    setArticleDetail(record);
    setViewModalVisible(true);
  };

  // Navigate to article review page
  const handleReviewArticle = (mhid) => {
    navigate(`/researcher/review-article/${mhid}`);
  };

  // Navigate to article preview
  const handleViewFullArticle = (mhid) => {
    navigate(`/article-preview/${mhid}`);
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
    setFilteredInfo(filters);
    setSortedInfo(sorter);

    if (extra.action === "paginate") {
      handlePaginationChange(pagination.current, pagination.pageSize);
    }

    if (extra.action === "filter" || extra.action === "sort") {
      // Reset to page 1 when filtering or sorting
      handlePaginationChange(1, pagination.pageSize);
    }
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSortedInfo({});
    if (activeTab === "assigned") {
      setCurrentPage(1);
      fetchArticles();
    } else if (activeTab === "own") {
      setOwnCurrentPage(1);
      fetchOwnArticles();
    }
  };

  // Status dropdown component
  const StatusDropdown = ({ record, handleStatusChange }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "verified":
          return { bg: "#f6ffed", text: "#52c41a", border: "#b7eb8f" };
        case "in review":
          return { bg: "#e6f7ff", text: "#1890ff", border: "#91d5ff" };
        case "unverified":
          return { bg: "#fff7e6", text: "#fa8c16", border: "#ffd591" };
        case "draft":
          return { bg: "#f5f5f5", text: "#595959", border: "#d9d9d9" };
        default:
          return { bg: "#f5f5f5", text: "#595959", border: "#d9d9d9" };
      }
    };

    const colors = getStatusColor(record.status);

    return (
      <div
        className="status-select-wrapper"
        style={{ position: "relative", minWidth: "120px" }}
      >
        <div
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: colors.bg,
            color: colors.text,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() =>
            document.getElementById(`status-select-${record.id}`)?.focus()
          }
        >
          <span>{record.status}</span>
          <DownOutlined style={{ fontSize: "12px", marginLeft: "5px" }} />
        </div>

        <Select
          id={`status-select-${record.id}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
          value={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
            {['Unverified', 'In Review', 'Flagged for Review', 'Review Complete', 'Draft'].map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log("Updating status for article ID:", id, "to:", newStatus);
      await apiHandle.post(`update-status/${id}`, { status: newStatus });
      message.success("Status updated successfully");
      if (activeTab === "assigned") {
        fetchArticles();
      } else if (activeTab === "own") {
        fetchOwnArticles();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      message.error("Failed to update status. Please try again.");
    }
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
      title: "Status",
      key: "status",
      render: (_, record) => {
        // For own articles tab, show status as read-only tag
        if (activeTab === "own") {
          return renderStatusTag(record.status);
        }
        // For assigned articles tab, show status dropdown
        return (
          <StatusDropdown
            record={record}
            handleStatusChange={handleStatusChange}
          />
        );
      },
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
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div>
          <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => handleViewFullArticle(record.mhid)}
            size="small"
          >
            View Full Article
          </Button>
           <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => 
              // https://h2research.org/ArticleDetails/MHID-1852071
              window.open(`https://h2research.org/ArticleDetails/${record.mhid}`, "_blank")
            }
            size="small"
          >
            View On Public Site
          </Button>
            <Button
            type="default"
            icon={<FileSearchOutlined />}
            onClick={() => 
              console.log('Viewing PDF', record.publicData?.pdf_url[0]?.name) ||
              navigate("/pdf-viewer", { state: { pdfUrl: record.publicData?.pdf_url[0]?.name } })
            }
            size="small"
          >
            View PDF
          </Button>
          <Button
          style={{marginTop:'5px'}}
            type="default"
            icon={<EditOutlined />}
            onClick={() =>   navigate("/main-form", { state: { articleToEdit: record } })}
            size="small"
          >
            Edit Article
          </Button>

          {/* Only show Verify Article button for assigned articles, not own articles */}
          {activeTab === "assigned" && (
            <Button 
              style={{marginTop:'5px'}}
              type="default"
              icon={<EyeOutlined />}
              onClick={() =>  navigate("/main-form", { state: { articleToEdit: record, isSpecialAction: true } })}
              size="small"
            >
              Verify Article
            </Button>
          )}
        </div>
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

  return (
    <div className="researcher-articles-container" style={{ padding: "24px" }}>
      {/* Bulk Upload Modal and Progress */}
      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        bulkFiles={bulkFiles}
        bulkError={bulkError}
        bulkUploading={bulkUploading || showBulkProgress}
        onFileChange={handleBulkFileChange}
        onRemoveFile={handleRemoveBulkFile}
        onUpload={handleBulkUpload}
      />  
      <GlobalBulkUploadProgress />
      
      <Card className="dashboard-card" bordered={false}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Title level={4}>
            <FileTextOutlined /> Article Management
          </Title>
          <Space>
            <Button onClick={clearFilters} icon={<FilterOutlined />}>
              Clear Filters
            </Button>
            <Button  style={{
              backgroundColor : colorTheme.primary,
              
            }}
              type="primary" 
              onClick={() => {
                if (activeTab === "assigned") {
                  fetchArticles();
                } else if (activeTab === "own") {
                  fetchOwnArticles();
                }
              }} 
              loading={activeTab === "assigned" ? loading : ownLoading}
            >
              Refresh
            </Button>
            <Button style={{
              backgroundColor : colorTheme.primary,

            }} type="primary" onClick={() => navigate("/main-form")} icon={<PlusOutlined />}>
              Add New Article
            </Button>
            <Button
              type="primary"
              style={{ background: '#22c55e', borderColor: '#22c55e', color: 'white' }}
              onClick={() => { if (!showBulkProgress) setBulkModalOpen(true); }}
              disabled={showBulkProgress}
            >
              Bulk Upload
            </Button>
          </Space>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: 20 }}
        >
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Assigned Articles
                <Badge 
                  count={totalArticles} 
                  style={{ marginLeft: 8, backgroundColor: '#1890ff' }} 
                />
              </span>
            } 
            key="assigned"
          >
            {/* Stats Cards Section for Assigned Articles */}
            {activeTab === "assigned" && statsVisible && (
              <>
                <div
                  className="stats-row"
                  style={{ display: "flex", marginBottom: 20 }}
                >
                  <Card style={{ flex: 1, marginRight: 12 }} size="small">
                    <Statistic
                      title="Total Assigned"
                      value={totalArticles}
                      prefix={<FileTextOutlined />}
                    />
                  </Card>
                  <Card style={{ flex: 1, marginRight: 12 }} size="small">
                    <Statistic
                      title="Completed"
                      value={completedArticles}
                      prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    />
                  </Card>
                  <Card style={{ flex: 1, marginRight: 12 }} size="small">
                    <Statistic
                      title="In Progress"
                      value={inProgressArticles}
                      prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
                    />
                  </Card>
                  <Card style={{ flex: 1 }} size="small">
                    <Statistic
                      title="Unverified"
                      value={unverifiedArticles}
                      prefix={
                        <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                      }
                    />
                  </Card>
                </div>

                <Card style={{ marginBottom: 20 }} size="small">
                  <Title level={5}>Review Progress</Title>
                  <Progress
                    percent={Math.round(
                      (completedArticles / (totalArticles || 1)) * 100
                    )}
                    status="active"
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Card>
              </>
            )}

            <Table
              columns={columns}
              dataSource={articles || []}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalArticles,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page, pageSize) =>
                  handlePaginationChange(page, pageSize),
                onShowSizeChange: (current, size) =>
                  handlePaginationChange(current, size),
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="middle"
              scroll={{ x: 1200 }}
              style={{ minHeight: "500px" }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>No articles are currently assigned to you.</span>
                    }
                  />
                ),
              }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <PlusOutlined />
                My Submitted Articles
                <Badge 
                  count={totalOwnArticles} 
                  style={{ marginLeft: 8, backgroundColor: '#52c41a' }} 
                />
              </span>
            } 
            key="own"
          >
            <Table
              columns={columns}
              dataSource={ownArticles || []}
              rowKey="id"
              loading={ownLoading}
              onChange={handleTableChange}
              pagination={{
                current: ownCurrentPage,
                pageSize: ownPageSize,
                total: totalOwnArticles,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page, pageSize) =>
                  handlePaginationChange(page, pageSize),
                onShowSizeChange: (current, size) =>
                  handlePaginationChange(current, size),
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="middle"
              scroll={{ x: 1200 }}
              style={{ minHeight: "500px" }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>You haven't submitted any articles yet.</span>
                    }
                  />
                ),
              }}
            />
          </TabPane>
        </Tabs>
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
            key="review"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleReviewArticle(articleDetail?.mhid);
            }}
          >
            Review Article
          </Button>,
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
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {articleDetail && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Article Information" key="1">
              <div className="article-info-section">
                <Card title="Basic Information" style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <Text type="secondary">Title:</Text>
                      <br />
                      <Text strong>
                        {articleDetail.publicData?.title?.name || "No Title"}
                      </Text>
                    </div>

                    <div>
                      <Text type="secondary">Status:</Text>
                      <br />
                      {renderStatusTag(articleDetail.status)}
                    </div>

                    <div style={{ display: "flex", gap: "24px" }}>
                      <div>
                        <Text type="secondary">DOI:</Text>
                        <br />
                        <Text>
                          {articleDetail.publicData?.doi?.name ||
                            articleDetail.doi ||
                            "N/A"}
                        </Text>
                      </div>

                      <div>
                        <Text type="secondary">Year:</Text>
                        <br />
                        <Text>
                          {articleDetail.publicData?.year?.name || "N/A"}
                        </Text>
                      </div>

                      <div>
                        <Text type="secondary">Journal :</Text>
                        <br />
                        <Text>
                          {articleDetail.publicData?.journal?.name || "N/A"}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text type="secondary">Authors:</Text>
                      <br />
                      <Space size={[0, 8]} wrap>
                        {articleDetail.publicData?.authors?.map(
                          (author, index) => (
                            <Tag key={index}>{author.name}</Tag>
                          )
                        ) || "No authors listed"}
                      </Space>
                    </div>
                  </div>
                </Card>

                <Card title="Abstract" style={{ marginBottom: 16 }}>
                  <Paragraph>
                    {articleDetail.publicData?.abstract?.name ||
                      "No abstract available"}
                  </Paragraph>
                </Card>

                <Card title="Assignment Details">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <Text type="secondary">Assigned Date:</Text>
                      <br />
                      <Text>
                        {formatDate(articleDetail.assigned_at || new Date())}
                      </Text>
                    </div>

                    <div>
                      <Text type="secondary">Last Updated:</Text>
                      <br />
                      <Text>{formatDate(articleDetail.updated_at)}</Text>
                    </div>

                    <div>
                      <Text type="secondary">Expected Completion:</Text>
                      <br />
                      <Text>
                        {formatDate(
                          new Date(
                            new Date(
                              articleDetail.assigned_at || new Date()
                            ).getTime() +
                              7 * 24 * 60 * 60 * 1000
                          )
                        )}
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>
            </TabPane>

            <TabPane tab="Research Information" key="2">
              {articleDetail.articleGeneralData?.studyType?.length > 0 && (
                <Card title="Study Type" style={{ marginBottom: 16 }}>
                  <Space size={[0, 8]} wrap>
                    {articleDetail.articleGeneralData.studyType.map(
                      (type, index) => (
                        <Tag key={index} color="blue">
                          {type.name}
                        </Tag>
                      )
                    )}
                  </Space>
                </Card>
              )}

              {articleDetail.articleGeneralData?.species?.length > 0 && (
                <Card title="Species" style={{ marginBottom: 16 }}>
                  <Space size={[0, 8]} wrap>
                    {articleDetail.articleGeneralData.species.map(
                      (species, index) => (
                        <Tag key={index} color="green">
                          {species.name}
                        </Tag>
                      )
                    )}
                  </Space>
                </Card>
              )}

              {articleDetail.articleGeneralData?.outcome && (
                <Card title="Outcome" style={{ marginBottom: 16 }}>
                  <Paragraph>
                    {articleDetail.articleGeneralData.outcome.name}
                  </Paragraph>
                </Card>
              )}

              {articleDetail.articleGeneralData?.researchtopic?.length > 0 && (
                <Card title="Research Topics">
                  <Space size={[0, 8]} wrap>
                    {articleDetail.articleGeneralData.researchtopic.map(
                      (topic, index) => (
                        <Tag key={index} color="purple">
                          {topic.name}
                        </Tag>
                      )
                    )}
                  </Space>
                </Card>
              )}
            </TabPane>

            <TabPane tab="Timeline" key="3">
              <div className="status-history-section">
                <Card title="Article Status Timeline">
                  <Timeline>
                    <Timeline.Item>
                      <div>
                        <Text strong>Created article</Text>
                        <div>{formatDate(articleDetail.created_at)}</div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item>
                      <div>
                        <Text strong>Article assigned to you</Text>
                        <div>
                          {formatDate(articleDetail.assigned_at || new Date())}
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item>
                      <div>
                        <Text strong>Last updated</Text>
                        <div>{formatDate(articleDetail.updated_at)}</div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item>
                      <div>
                        <Text strong>Current status</Text>
                        <div style={{ marginTop: "8px" }}>
                          <StatusDropdown
                            record={articleDetail}
                            handleStatusChange={handleStatusChange}
                          />
                        </div>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default ResearcherArticlesScreen;
