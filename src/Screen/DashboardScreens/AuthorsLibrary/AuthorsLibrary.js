import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, notification, Tag, Tooltip, Badge } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import { colorTheme } from "../../../Utils/colortheme";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";

const AuthorsLibrary = () => {
  const [authors, setAuthors] = useState([]); // Authors list from API
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility for adding parent authors
  const [isChildModalVisible, setIsChildModalVisible] = useState(false); // Modal visibility for managing child authors
  const [newParentAuthor, setNewParentAuthor] = useState(""); // Input for new parent author
  const [childAuthors, setChildAuthors] = useState([]); // Child authors for the selected parent
  const [selectedParentId, setSelectedParentId] = useState(null); // Selected parent ID for managing child authors
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedParent, setSelectedParent] = useState(null); // Selected parent for viewing child authors
  const [searchFilter, setSearchFilter] = useState(""); // New state for the search filter
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Fetch authors from API
  const fetchAuthors = async () => {
    try {
      const response = await apiHandle.get(
        "get-auth-children"
      );
      const formattedAuthors = Object.keys(response.data.authors).map((key) => ({
        id: key,
        name: response.data.authors[key].name,
        children: response.data.authors[key].childrens,
      }));
      setAuthors(formattedAuthors);
    } catch (error) {
      console.error("Error fetching authors:", error);
      notification.error({ message: "Failed to fetch authors." });
    }
  };

  useEffect(() => {
    fetchAuthors();
    //
  }, []);

  const handleSearch = (value) => {
    setSearchFilter(value);
  };

  const filteredAurthors = authors.filter((author) => {
    if (!searchFilter) return true;
    return (
      author.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  // Fetch assignment counts for all authors
  const fetchAssignmentCounts = async () => {
    try {
      const response = await apiHandle.get('/author-assignment-counts');
      setAssignmentCounts(response.data?.counts || {});
    } catch (error) {
      console.error("Error fetching assignment counts:", error);
    }
  };

  // Handle article assignment modal
  const handleManageArticles = (author) => {
    setSelectedAuthor(author);
    setIsAssignModalVisible(true);
  };

  // Add a new parent author
  const handleAddParentAuthor = async () => {
    if (!newParentAuthor.trim()) {
      notification.warning({ message: "Author name cannot be empty." });
      return;
    }

    setLoading(true);
    try {
      const payload = { name: newParentAuthor.trim() };
      await apiHandle.post("add-author", payload);
      notification.success({ message: "Parent author added successfully!" });
      setNewParentAuthor("");
      setIsModalVisible(false);
      fetchAuthors();
    } catch (error) {
      console.error("Error adding parent author:", error);
      notification.error({ message: "Failed to add parent author." });
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of child authors per page

  // Function to handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  }
  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Child Authors",
      key: "children",
      render: (_, record) => (
        <>
          {record?.children?.length > 0 ? (
            <Tooltip
              title={
                <ul>
                  {record.children.map((child, index) => (
                    <li key={index}>{child}</li>
                  ))}
                </ul>
              }
            >
              <Tag color="blue">{record.children.length} Child Authors</Tag>
            </Tooltip>
          ) : (
            <Tag color="red">No Child Authors</Tag>
          )}
        </>
      ),
    },
    {
      title: "Assigned Articles",
      key: "assignedCount",
      render: (_, record) => (
        <Badge 
          count={assignmentCounts[record.id] || 0} 
          style={{ backgroundColor: '#004c78' }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            style={{ backgroundColor: colorTheme.primary, color: "white" }}
            onClick={() => {
              setSelectedParent(record);
              setIsChildModalVisible(true);
            }}
          >
            View Child Authors
          </Button>
          <Button
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              borderColor: "#1890ff",
            }}
            icon={<FileTextOutlined />}
            onClick={() => handleManageArticles(record)}
          >
            Articles
            <Badge
              count={record.articles_count || 0}
              style={{ backgroundColor: '#ff4d4f', marginLeft: 4 }}
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex space-x-5 items-center mb-6">
        <BackButton path={"/DataManager"} />  <h1 className="text-2xl font-bold">Authors Library</h1>
      </div>
      <div className="flex justify-between items-center ">
        <Input.Search
          placeholder="Search by Author Name"
          value={searchFilter}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "20px", width: "300px" }}
        />
        <Button
          style={{ backgroundColor: colorTheme.primary, color: "white" }}
          onClick={() => setIsModalVisible(true)}
          className="mb-4"
        >
          Add Parent Author
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredAurthors} rowKey="id" pagination={{ pageSize: 20 }} />

      {/* Modal for adding parent authors */}
      <Modal
        title="Add New Parent Author"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddParentAuthor}
        confirmLoading={loading}
        okButtonProps={{
          style: { backgroundColor: "#004c78", borderColor: "#004c78" },
        }}
      >
        <Input
          placeholder="Enter parent author name"
          value={newParentAuthor}
          onChange={(e) => setNewParentAuthor(e.target.value)}
        />
      </Modal>

      <Modal
        title={`Child Authors for ${selectedParent?.name}`}
        visible={isChildModalVisible}
        onCancel={() => setIsChildModalVisible(false)}
        footer={null} // No footer for read-only view
        style={{ maxHeight: "400px", overflowY: "auto" }} // Limit height and add scroll
      >
        {selectedParent?.children.length > 0 ? (
          <>
            {/* Table for better readability */}
            <Table
              dataSource={selectedParent.children.map((child, index) => ({
                key: index,
                name: child,
              }))}
              columns={[{ title: "Child Author", dataIndex: "name", key: "name" }]}
              pagination={{
                current: currentPage,
                pageSize,
                total: selectedParent.children.length,
                onChange: handlePageChange,
              }}
              showHeader={false} // No header for simple listing
              size="small" // Compact table
            />
          </>
        ) : (
          <p>No child authors available for this parent.</p>
        )}
      </Modal>

      {/* Article Assignment Modal */}
      <ArticleAssignmentModal
        visible={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedAuthor(null);
        }}
        selectedItem={selectedAuthor}
        assignmentType="author"
        onAssignmentChange={fetchAssignmentCounts}
      />
    </div>
  );
};

export default AuthorsLibrary;

// ================================

// im