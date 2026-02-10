import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Select, Badge, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, EyeOutlined, StarOutlined, StarFilled, FileTextOutlined } from "@ant-design/icons";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";

const AuthorsHandling = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [parents, setParents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewChildrenModalVisible, setIsViewChildrenModalVisible] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [childAuthors, setChildAuthors] = useState([]);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [featuring, setFeaturing] = useState({}); // { [authorId]: boolean }
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  // Feature or unfeature author
  const handleFeature = async (author, feature = true) => {
    setFeaturing(prev => ({ ...prev, [author.id]: true }));
    try {
     const resp =  await apiHandle.post(`authors/${author.id}/featured/${feature ? 'true' : 'false'}`);
     if (resp?.data?.status) {
       notification.success({ message: `${author.name} is now ${feature ? 'featured' : 'unfeatured'}!` });
       await fetchAuthors(searchValue);
       // Always re-apply search filter after fetching
       handleSearch(searchValue);
     } else {
       notification.error({ message: resp?.data?.message || `Failed to ${feature ? 'feature' : 'unfeature'} ${author.name}` });
     }
    } catch (error) {
      notification.error({ message: `Failed to ${feature ? 'feature' : 'unfeature'} ${author.name}` });
    } finally {
      setFeaturing(prev => ({ ...prev, [author.id]: false }));
    }
  };

  // Fetch authors on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Fetch authors from API
const fetchAuthors = async (search = "") => {
  try {
    setLoading(true);
    const response = await apiHandle.get("get-authors");
    
    if (response?.data?.status && response?.data?.authors) {
      // Sort authors alphabetically by name (assuming authors have a 'name' property)
      const sortedAuthors = response.data.authors.sort((a, b) => {
        // Handle case where name might be undefined or null
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setAuthors(sortedAuthors);
      // Always apply filter after fetching
      if (search) {
        const filtered = sortedAuthors.filter((author) =>
          author.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredAuthors(filtered);
      } else {
        setFilteredAuthors(sortedAuthors);
      }
      
      // Handle parents - it might be an object or array
      if (response?.data?.authors) {
        let authorsArray = [];
        if (Array.isArray(response.data.authors)) {
          // If it's already an array, sort it too
          authorsArray = response.data.authors.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
        } else if (typeof response.data.authors === 'object') {
          // If it's an object, convert to array and sort
          authorsArray = Object.values(response.data.authors).sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
        }
        setParents(authorsArray);
      } else {
        setParents([]);
      }
    } else {
      setAuthors([]);
      setFilteredAuthors([]);
      setParents([]);
    }
  } catch (error) {
    setAuthors([]);
    setFilteredAuthors([]);
    setParents([]);
    notification.error({ message: "Failed to fetch authors." });
  } finally {
    setLoading(false);
  }
};

  // Search functionality
  const handleSearch = (value) => {
    setSearchValue(value);
    fetchAuthors(value);
  };

  // Add or Edit author
  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const authorData = {
        name: values.name.trim(),
        parent_id: values.parent_id || null
      };

      if (editingAuthor) {
        // Edit logic
        await apiHandle.post(`edit-author/${editingAuthor.id}`, authorData);
        notification.success({ message: "Author updated successfully!" });
      } else {
        // Add author
        await apiHandle.post("add-author", authorData);
        notification.success({ message: "Author added successfully!" });
      }
      
      // Refresh the authors list
      await fetchAuthors();
      setIsModalVisible(false);
      setEditingAuthor(null);
      form.resetFields();
    } catch (error) {
      console.error("Error while adding/editing author:", error);
      notification.error({ message: "Failed to add or update author." });
    } finally {
      setLoading(false);
    }
  };

  // Show modal for adding or editing
  const handleAddEdit = (author = null) => {
    setEditingAuthor(author);
    setIsModalVisible(true);
    if (author) {
      // Set form values for editing
      form.setFieldsValue({ 
        name: author.name,
        parent_id: author.parent_id && typeof author.parent_id === 'object' 
          ? author.parent_id.id 
          : author.parent_id
      });
    } else {
      form.resetFields();
    }
  };

  // Delete author
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiHandle.post(`delete-author/${id}`);
      notification.success({ message: "Author deleted successfully!" });

      // Update local state for real-time updates
      setFilteredAuthors((prev) => prev.filter((author) => author.id !== id));
      await fetchAuthors();
    } catch (error) {
      console.error("Error while deleting author:", error);
      notification.error({ message: "Failed to delete author." });
    } finally {
      setLoading(false);
    }
  };

  // View children of a parent author
  const handleViewChildren = (parent) => {
    setCurrentParent(parent);
    // Filter all authors that have this parent
    if (!Array.isArray(filteredAuthors)) {
      setChildAuthors([]);
      setIsViewChildrenModalVisible(true);
      return;
    }
    
    const children = filteredAuthors.filter(
      author => author.parent_id && (
        typeof author.parent_id === 'object' 
          ? author.parent_id.id === parent.id 
          : author.parent_id === parent.id
      )
    );
    setChildAuthors(children);
    setIsViewChildrenModalVisible(true);
  };

  // Count children for each parent
  const getChildCount = (parentId) => {
    if (!Array.isArray(filteredAuthors)) return 0;
    return filteredAuthors.filter(author => 
      author.parent_id && (
        typeof author.parent_id === 'object' 
          ? author.parent_id.id === parentId 
          : author.parent_id === parentId
      )
    ).length;
  };

  // Table columns for main authors list
  const columns = [
    {
      title: "Author Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        let parentAuthor = null;
        if (record.parent_id) {
          if (typeof record.parent_id === 'object') {
            parentAuthor = record.parent_id;
          } else if (Array.isArray(parents)) {
            parentAuthor = parents.find(parent => parent.id === record.parent_id);
          }
        }
        
        return (
          <span>
            {text}
            {parentAuthor && (
              <Tooltip title={`Parent: ${parentAuthor.name}`}>
                <span className="ml-2 text-gray-500 text-sm italic">
                  (Child of {parentAuthor.name})
                </span>
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: "Parent Author",
      key: "parent",
      render: (_, record) => {
        let parentAuthor = null;
        if (record.parent_id) {
          if (typeof record.parent_id === 'object') {
            parentAuthor = record.parent_id;
          } else if (Array.isArray(parents)) {
            parentAuthor = parents.find(parent => parent.id === record.parent_id);
          }
        }
        return parentAuthor ? parentAuthor.name : "None";
      },
    },
    {
      title: "Created Date",
      key: "created_at",
      render: (_, record) => new Date(record.created_at).toLocaleDateString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            style={{
              backgroundColor: "#004c78",
              color: "white",
            }}
            icon={<EditOutlined />}
            onClick={() => handleAddEdit(record)}
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
            onClick={() => handleManageArticles(record)}
          >
            Manage Articles
            <Badge 
              count={record.articles_count || 0} 
              style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }}
            />
          </Button>
          {/* Feature/Unfeature Button */}
          {record.is_featured ? (
            <Button
              style={{
                backgroundColor: '#004c78',
                color: 'white',
                borderColor: '#004c78',
                fontWeight: 600,
              }}
              icon={<StarFilled />}
              loading={!!featuring[record.id]}
              onClick={() => handleFeature(record, false)}
              disabled={!!featuring[record.id]}
            >
              Unmark as Featured
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: '#004c78',
                color: 'white',
                borderColor: '#004c78',
                fontWeight: 600,
              }}
              icon={<StarOutlined />}
              loading={!!featuring[record.id]}
              onClick={() => handleFeature(record, true)}
              disabled={!!featuring[record.id]}
            >
              Feature
            </Button>
          )}

          {getChildCount(record.id) > 0 && (
            <Button
              style={{
                backgroundColor: "#f6ffed",
                color: "#52c41a",
                borderColor: "#b7eb8f",
              }}
              icon={<EyeOutlined />}
              onClick={() => handleViewChildren(record)}
            >
              View Children
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Table columns for child authors modal
  const childColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Author Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      key: "created_at",
      render: (_, record) => new Date(record.created_at).toLocaleDateString()
    },
  ];
// Handle article assignment modal
  const handleManageArticles = (author) => {
    setSelectedAuthor(author);
    setIsAssignModalVisible(true);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex space-x-5 items-center mb-6">
        <BackButton path={"/DataManager"} />
        <h1 className="text-2xl font-bold">Authors Management</h1>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <Input.Search
          placeholder="Search authors"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          style={{
            marginTop: "10px",
            backgroundColor: "#004c78",
            color: "white",
          }}
          icon={<PlusOutlined />}
          onClick={() => handleAddEdit()}
        >
          Add Author
        </Button>
      </div>
      
      {/* Parent Authors Filter */}
      {/* <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Parent Authors List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {parents.map(parent => (
            <Tooltip key={parent.id} title={`${getChildCount(parent.id)} child authors`}>
              <Button 
                icon={<TeamOutlined />}
                onClick={() => handleViewChildren(parent)}
                style={{textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis'}}
              >
                {parent.name} <Badge count={getChildCount(parent.id)} style={{ backgroundColor: '#52c41a' }} />
              </Button>
            </Tooltip>
          ))}
        </div>
      </div> */}

      <Table
        columns={columns}
        dataSource={filteredAuthors}
        rowKey="id"
        pagination={{ pageSize, showSizeChanger: true, pageSizeOptions: ['10', '15', '20', '50', '100'] }}
        loading={loading}
        onChange={(pagination) => {
          if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
          }
        }}
      />

      {/* Modal for Adding/Editing */}
      <Modal
        title={editingAuthor ? "Edit Author" : "Add Author"}
        open={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={loading}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAuthor(null);
          form.resetFields();
        }}
        okText={editingAuthor ? "Update" : "Add"}
        okButtonProps={{
          style: { backgroundColor: "#004c78", borderColor: "#004c78" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Author Name"
            name="name"
            rules={[
              { required: true, message: "Please enter author name" },
              { min: 2, message: "Author name must be at least 2 characters" }
            ]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item
            label="Parent Author (Optional)"
            name="parent_id"
          >
            <Select
              allowClear
              placeholder="Select a parent author"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Array.isArray(parents) && parents.map(parent => (
                <Select.Option key={parent.id} value={parent.id}>
                  {parent.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing Children */}
      <Modal
        title={`Child Authors of ${currentParent?.name || ""}`}
        open={isViewChildrenModalVisible}
        onCancel={() => setIsViewChildrenModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewChildrenModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        <div className="mb-3">
          <h3 className="text-base font-medium">
            Total: {childAuthors.length} child authors
          </h3>
        </div>
        <Table
          columns={childColumns}
          dataSource={childAuthors}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
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
        onSuccess={() => {
          fetchAuthors();
        }}
      />
    </div>
  );
};

export default AuthorsHandling;