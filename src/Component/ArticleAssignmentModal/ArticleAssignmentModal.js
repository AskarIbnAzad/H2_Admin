import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Checkbox,
  Space,
  Typography,
  Tag,
  notification,
} from "antd";
import { FileTextOutlined, SearchOutlined } from "@ant-design/icons";
import { apiHandle } from "../../Config/ApiHandle/apiHandle";

const { Text } = Typography;

const ArticleAssignmentModal = ({
  visible,
  onCancel,
  selectedItem,
  assignmentType, // 'research-topic', 'article-type', 'disease', 'species', 'organ-tissue', 'physiological-system', 'method-administration'
  itemNameField = "id",
  onAssignmentChange,
}) => {

  console.log("Assignment Type:", assignmentType);
  console.log("Selected Item:", selectedItem);
  // Article assignment states
  const [allArticles, setAllArticles] = useState([]);
  const [assignedArticles, setAssignedArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [selectedAssignedIds, setSelectedAssignedIds] = useState([]);
  const [articleSearchValue, setArticleSearchValue] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Infinite scroll states for assigned articles
  const [assignedPage, setAssignedPage] = useState(1);
  const [assignedHasMore, setAssignedHasMore] = useState(true);

  // Infinite scroll states for available articles
  const [availablePage, setAvailablePage] = useState(1);
  const [availableHasMore, setAvailableHasMore] = useState(true);

  // Total counts from API
  const [totalAssignedCount, setTotalAssignedCount] = useState(0);
  const [totalAvailableCount, setTotalAvailableCount] = useState(0);

  useEffect(() => {
    if (visible && selectedItem) {
      initializeModal();
    }
  }, [visible, selectedItem]);

  const initializeModal = () => {
    // Reset states
    setAssignedArticles([]);
    setAvailableArticles([]);
    setFilteredArticles([]);
    setAllArticles([]);
    setAssignedPage(1);
    setAssignedHasMore(true);
    setAvailablePage(1);
    setAvailableHasMore(true);
    setSelectedArticleIds([]);
    setSelectedAssignedIds([]);
    setArticleSearchValue("");
    setTotalAssignedCount(0);
    setTotalAvailableCount(0);

    // Fetch articles using the unified API
    fetchArticlesWithFilter();
  };

  // Fetch articles using the unified compare-articles-by-filter API
  const fetchArticlesWithFilter = async () => {
    setLoadingArticles(true);
    try {
      const filterParam = getFilterParam();
      
      console.log("Assignment type:", assignmentType);
      console.log("Selected item:", selectedItem);
      console.log("Item name field:", itemNameField);
      console.log("Filter param:", filterParam);
      
      // For keywords, use the ID instead of the keyword name
      const filterValue = assignmentType === 'keyword' ? selectedItem.id : selectedItem[itemNameField];
      
      console.log("Filter value:", filterValue);
      
      const body = {
        per_page: 100, // Get more articles since we're making one call
        page: 1,
        reqType: "admin",
        orderBy: "DESC",
        [filterParam]: [filterValue],
      };

      console.log("Unified API request body:", body);
      
      const res = await apiHandle.post("/compare-articles-by-filter", body);
      
      console.log("Full API response:", res);
      console.log("API response data:", res.data);
      
      if (res.data && res.data.data) {
        // Set assigned articles (including)
        const assignedArticlesList = res.data.data.including || [];
        console.log("Including articles:", assignedArticlesList);
        setAssignedArticles(assignedArticlesList);
        setTotalAssignedCount(res.data.data.counts?.with_filter || assignedArticlesList.length);

        // Set available articles (excluding)
        const availableArticlesList = res.data.data.excluding || [];
        console.log("Excluding articles:", availableArticlesList);
        setAvailableArticles(availableArticlesList);
        setFilteredArticles(availableArticlesList);
        setTotalAvailableCount(res.data.data.counts?.without_filter || availableArticlesList.length);

        // Combine all articles for reference
        setAllArticles([...assignedArticlesList, ...availableArticlesList]);

        console.log("Assigned articles count:", assignedArticlesList.length);
        console.log("Available articles count:", availableArticlesList.length);
        console.log("Filter applied:", res.data.data.filter_applied);
        console.log("Counts:", res.data.data.counts);
      } else {
        console.log("No data in response");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      notification.error({ message: "Failed to fetch articles." });
    } finally {
      setLoadingArticles(false);
    }
  };

  // Get filter parameter name based on assignment type
  const getFilterParam = () => {
    const paramMap = {
      "research-topic": "researchTopics",
      "article-type": "studyTypes",
      disease: "diseases",
      species: "species",
      "organ-tissue": "organs",
      "physiological-system": "systems",
      "method-administration": "administrationMethods",
      keyword: "keywords",
      author: "authors",
      biomarker: "biomarkers",
      countries: "countries",
      organs: "organs",
      systems: "systems",
      administrationMethods: "administrationMethods",
    };
    return paramMap[assignmentType] || assignmentType;
  };

  // For now, we'll disable infinite scroll since we're using unified API
  // If needed, we can implement pagination later by calling fetchArticlesWithFilter with page parameter
  const handleAssignedScroll = (e) => {
    // Disabled - using unified API
  };

  // For now, we'll disable infinite scroll since we're using unified API
  // If needed, we can implement pagination later by calling fetchArticlesWithFilter with page parameter
  const handleAvailableScroll = (e) => {
    // Disabled - using unified API
  };

  // Search functionality for articles
  const handleArticleSearch = (value) => {
    setArticleSearchValue(value);
    if (!value.trim()) {
      setFilteredArticles(availableArticles);
    } else {
      const filtered = availableArticles.filter(
        (article) =>
          article.title?.toLowerCase().includes(value.toLowerCase()) ||
          article.mhid?.toLowerCase().includes(value.toLowerCase()) ||
          article.doi?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  // Handle article selection
  const handleArticleSelection = (articleId, checked) => {
    if (checked) {
      setSelectedArticleIds([...selectedArticleIds, articleId]);
    } else {
      setSelectedArticleIds(
        selectedArticleIds.filter((id) => id !== articleId)
      );
    }
  };

  // Handle select all articles
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedArticleIds(filteredArticles.map((article) => article.id));
    } else {
      setSelectedArticleIds([]);
    }
  };

  // Handle assigned article selection for removal
  const handleAssignedArticleSelection = (articleId, checked) => {
    if (checked) {
      setSelectedAssignedIds([...selectedAssignedIds, articleId]);
    } else {
      setSelectedAssignedIds(
        selectedAssignedIds.filter((id) => id !== articleId)
      );
    }
  };

  // Handle select all assigned articles
  const handleSelectAllAssigned = (checked) => {
    if (checked) {
      setSelectedAssignedIds(assignedArticles.map((article) => article.id));
    } else {
      setSelectedAssignedIds([]);
    }
  };

  // Get field name for API based on assignment type
  const getFieldName = () => {
    const fieldMap = {
      "research-topic": "researchTopics",
      "article-type": "studyTypes",
      disease: "diseases",
      species: "species",
      "organ-tissue": "organ_tissue",
      "physiological-system": "physiological_system",
      "method-administration": "method_administration",
      keyword: "keywords",
      author: "authors",
      biomarker: "biomarkers", 
      country: "countries",
      organs: "organs",
      systems: "systems",
      administrationMethods: "administrationMethods",
    };
    return fieldMap[assignmentType] || assignmentType;
  };

  // Assign selected articles
  const handleAssignArticles = async () => {
    if (selectedArticleIds.length === 0) {
      notification.warning({
        message: "Please select at least one article to assign.",
      });
      return;
    }

    try {
      const fieldName = getFieldName();
      // For keywords, use the ID instead of the keyword name for the identifier
      const identifier = assignmentType === 'keyword' ? selectedItem.id : selectedItem[itemNameField];
      
      await apiHandle.post("/articles/data/add", {
        article_id: selectedArticleIds,
        field: fieldName,
        identifier: identifier,
      });

      notification.success({
        message: `Successfully assigned ${selectedArticleIds.length} article(s) to ${selectedItem[itemNameField]}`,
      });

      // Refresh data using the unified API
      fetchArticlesWithFilter();
      
      if (onAssignmentChange) {
        onAssignmentChange();
      }
      setSelectedArticleIds([]);
    } catch (error) {
      console.error("Error assigning articles:", error);
      notification.error({ message: "Failed to assign articles." });
    }
  };

  // Remove selected articles from assignment
  const handleRemoveSelectedArticles = async () => {
    if (selectedAssignedIds.length === 0) {
      notification.warning({
        message: "Please select at least one article to remove.",
      });
      return;
    }

    try {
      const fieldName = getFieldName();
      // For keywords, use the ID instead of the keyword name for the identifier
      const identifier = assignmentType === 'keyword' ? selectedItem.id : selectedItem[itemNameField];
      
      await apiHandle.delete("/articles/data/remove", {
        article_id: selectedAssignedIds,
        field: fieldName,
        data: {
          article_id: selectedAssignedIds,
          field: fieldName,
          identifier: identifier,
        },
      });

      notification.success({
        message: `Successfully removed ${selectedAssignedIds.length} article(s)`,
      });

      // Clear selection
      setSelectedAssignedIds([]);

      // Refresh data using the unified API
      fetchArticlesWithFilter();

      if (onAssignmentChange) {
        onAssignmentChange();
      }
    } catch (error) {
      console.error("Error removing articles:", error);
      notification.error({ message: "Failed to remove articles." });
    }
  };

  return (
    <Modal
      title={
        <div>
          <FileTextOutlined /> Manage Articles for "
          {selectedItem?.[itemNameField]}"
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
        <Button
          key="assign"
          type="primary"
          onClick={handleAssignArticles}
          disabled={selectedArticleIds.length === 0}
          style={{ backgroundColor: "#004c78", borderColor: "#004c78" }}
        >
          Assign Selected Articles ({selectedArticleIds.length})
        </Button>,
      ]}
    >
      <div style={{ display: "flex", gap: "24px", maxHeight: "70vh" }}>
        {/* Currently Assigned Articles */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ color: "#004c78", margin: 0 }}>
              Currently Assigned Articles ({totalAssignedCount})
            </h3>
            <Space>
              <Checkbox
                checked={
                  selectedAssignedIds.length === assignedArticles.length &&
                  assignedArticles.length > 0
                }
                indeterminate={
                  selectedAssignedIds.length > 0 &&
                  selectedAssignedIds.length < assignedArticles.length
                }
                onChange={(e) => handleSelectAllAssigned(e.target.checked)}
              >
                Select All
              </Checkbox>
              <Button
                size="small"
                danger
                onClick={handleRemoveSelectedArticles}
                disabled={selectedAssignedIds.length === 0}
              >
                Remove Selected ({selectedAssignedIds.length})
              </Button>
            </Space>
          </div>
          <div
            style={{
              maxHeight: "50vh",
              overflowY: "auto",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "12px",
            }}
            onScroll={handleAssignedScroll}
          >
            {assignedArticles.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                }}
              >
                No articles currently assigned
              </div>
            ) : (
              assignedArticles.map((article) => (
                <div
                  key={article.id}
                  style={{
                    padding: "12px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "6px",
                    marginBottom: "8px",
                    backgroundColor: selectedAssignedIds.includes(article.id)
                      ? "#ffe6e6"
                      : "#f9f9f9",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleAssignedArticleSelection(
                      article.id,
                      !selectedAssignedIds.includes(article.id)
                    )
                  }
                >
                  <div style={{ display: "flex", alignItems: "start" }}>
                    <Checkbox
                      checked={selectedAssignedIds.includes(article.id)}
                      onChange={(e) =>
                        handleAssignedArticleSelection(
                          article.id,
                          e.target.checked
                        )
                      }
                      style={{ marginRight: "12px", marginTop: "2px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: "#004c78" }}>
                        {article.title || "No Title"}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        MHID: {article.mhid} | DOI:{" "}
                        {article.doi || "N/A"}
                      </Text>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Articles for Assignment */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ color: "#004c78", margin: 0 }}>
              Available Articles ({totalAvailableCount})
            </h3>
            <Space>
              <Checkbox
                checked={
                  selectedArticleIds.length === filteredArticles.length &&
                  filteredArticles.length > 0
                }
                indeterminate={
                  selectedArticleIds.length > 0 &&
                  selectedArticleIds.length < filteredArticles.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                Select All
              </Checkbox>
            </Space>
          </div>

          <Input
            placeholder="Search available articles by title, MHID, or DOI"
            prefix={<SearchOutlined />}
            value={articleSearchValue}
            onChange={(e) => handleArticleSearch(e.target.value)}
            style={{ marginBottom: "12px" }}
          />

          <div
            style={{
              maxHeight: "45vh",
              overflowY: "auto",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "12px",
            }}
            onScroll={handleAvailableScroll}
          >
            {filteredArticles.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                }}
              >
                {articleSearchValue
                  ? "No articles found matching your search"
                  : "No articles available for assignment"}
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  style={{
                    padding: "12px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "6px",
                    marginBottom: "8px",
                    backgroundColor: selectedArticleIds.includes(article.id)
                      ? "#e6f7ff"
                      : "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleArticleSelection(
                      article.id,
                      !selectedArticleIds.includes(article.id)
                    )
                  }
                >
                  <div style={{ display: "flex", alignItems: "start" }}>
                    <Checkbox
                      checked={selectedArticleIds.includes(article.id)}
                      onChange={(e) =>
                        handleArticleSelection(article.id, e.target.checked)
                      }
                      style={{ marginRight: "12px", marginTop: "2px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: "#004c78" }}>
                        {article.title || "No Title"}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        MHID: {article.mhid} | DOI:{" "}
                        {article.doi || "N/A"}
                      </Text>
                      <br />
                      <Tag color="blue" style={{ marginTop: "4px" }}>
                        {article.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArticleAssignmentModal;
