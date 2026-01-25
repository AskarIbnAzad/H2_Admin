

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  notification,
  Select,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import {
  get_specie_service_auth,
  add_specie_service_auth,
} from "../../../Services/SpecieService";

const Species = () => {
  const dispatch = useDispatch();
  const { get_specie_data } = useSelector((state) => state.species);

  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const [parents, setParents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewChildrenModalVisible, setIsViewChildrenModalVisible] =
    useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [childSpecies, setChildSpecies] = useState([]);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [form] = Form.useForm();

  const sortSpeciesAlphabetically = (speciesArray) => {
    if (!speciesArray || !Array.isArray(speciesArray)) {
      return [];
    }

    return [...speciesArray].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
  };

  useEffect(() => {
    // Fetch species on component mount
    setLoading(true);
    dispatch(get_specie_service_auth()).finally(() => {
      setLoading(false);
    });
    // //
  }, [dispatch]);

  useEffect(() => {
    // Update filtered species whenever species data is fetched
    if (get_specie_data?.species) {
      // Create a copy of the array and then sort it alphabetically
      const sortedSpecies = [...get_specie_data.species].sort((a, b) => {
        // Handle case where name might be undefined or null
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setFilteredSpecies(sortedSpecies);

      // Extract parents from the species data - species that don't have a parent_id
      const parentSpecies = get_specie_data.species.filter(species => !species.parent_id);
      const sortedParents = [...parentSpecies].sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setParents(sortedParents);
    }
  }, [get_specie_data]);



  // Updated search functionality to maintain alphabetical order
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = get_specie_data?.species.filter((species) =>
      species.name.toLowerCase().includes(value.toLowerCase())
    );
    // Sort the filtered results alphabetically
    const sortedFiltered = sortSpeciesAlphabetically(filtered);
    setFilteredSpecies(sortedFiltered);
  };

  // Add or Edit species
  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // If parent_id is undefined, null, empty string, or 0, set to null
      let parentId = values.parent_id;
      if (typeof parentId === 'undefined' || parentId === null || parentId === '' || parentId === 0) {
        parentId = null;
      }
      const speciesData = {
        name: values.name,
        parent_id: parentId,
      };

      if (editingSpecies) {
        // Edit logic
        await apiHandle.post(`/edit-specie/${editingSpecies.id}`, speciesData);
        notification.success({ message: "Species updated successfully!" });
      } else {
        // Add species
        const response = await dispatch(add_specie_service_auth(speciesData));
        if (response?.payload?.id) {
          notification.success({ message: "Species added successfully!" });
        }
      }
      dispatch(get_specie_service_auth());
      // //
      setIsModalVisible(false);
      setEditingSpecies(null);
      form.resetFields();
    } catch (error) {
      console.error("Error while adding/editing species:", error);
      notification.error({ message: "Failed to add or update species." });
    } finally {
      setLoading(false);
    }
  };

  // Show modal for adding or editing
  const handleAddEdit = (species = null) => {
    setEditingSpecies(species);
    setIsModalVisible(true);
    if (species) {
      // Set form values for editing
      form.setFieldsValue({
        name: species.name,
        parent_id: species.parent_id || undefined,
      });
    } else {
      form.resetFields();
    }
  };

  // Delete species
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiHandle.post(`/delete-species/${id}`);
      notification.success({ message: "Species deleted successfully!" });

      // Update local state for real-time updates
      setFilteredSpecies((prev) => prev.filter((species) => species.id !== id));
      dispatch(get_specie_service_auth());
      // //
    } catch (error) {
      console.error("Error while deleting species:", error);
      notification.error({ message: error?.response?.data?.message || "Failed to delete species." });
    } finally {
      setLoading(false);
    }
  };

  // View children of a parent species
  const handleViewChildren = (parent) => {
    setCurrentParent(parent);
    // Filter all species that have this parent
    const children = filteredSpecies.filter(
      (species) => species.parent_id === parent.id
    );
    setChildSpecies(children);
    setIsViewChildrenModalVisible(true);
  };

  // Handle article assignment modal
  const handleManageArticles = (species) => {
    setSelectedSpecies(species);
    setIsAssignModalVisible(true);
  };

  // Get count of child species for a parent

  // Count children for each parent
  const getChildCount = (parentId) => {
    return filteredSpecies.filter(
      (species) => species.parent_id === parentId
    ).length;
  };

  // Table columns for main species list

  // Table columns for main species list
  const columns = [
    {
      title: "Species Name",
      dataIndex: "name",
      key: "name",
      // Add sorting functionality to the column
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend", // Default to A-Z sorting
      render: (text, record) => {
        const parentSpecies = record.parent_id ? parents.find(p => p.id === record.parent_id) : null;
        return (
          <span>
            {text}
            {parentSpecies && (
              <Tooltip title={`Parent: ${parentSpecies.name}`}>
                <span className="ml-2 text-gray-500 text-sm italic">
                  (Child of {parentSpecies.name})
                </span>
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: "Parent Species",
      key: "parent",
      // Add sorting for parent species too
      sorter: (a, b) => {
        const parentA = a.parent_id ? parents.find(p => p.id === a.parent_id)?.name || "" : "";
        const parentB = b.parent_id ? parents.find(p => p.id === b.parent_id)?.name || "" : "";
        return parentA.localeCompare(parentB);
      },
      render: (_, record) => {
        const parentSpecies = record.parent_id ? parents.find(p => p.id === record.parent_id) : null;
        return parentSpecies ? parentSpecies.name : "None";
      },
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
          <Button
            style={{
              backgroundColor: "#fff1f0",
              color: "#cf1322",
              borderColor: "#ffa39e",
            }}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
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

  // Table columns for child species modal
  const childColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Species Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      key: "created_at",
      render: (_, record) => new Date(record.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex space-x-5 items-center mb-6">
        <BackButton path={"/DataManager"} />
        <h1 className="text-2xl font-bold">Species Management</h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <Input.Search
          placeholder="Search species"
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
          Add Species
        </Button>
      </div>

      {/* Parent Species Filter */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Parent Species List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {parents.map((parent) => (
            <Tooltip
              key={parent.id}
              title={`${getChildCount(parent.id)} child species`}
            >
              <Button
                icon={<TeamOutlined />}
                onClick={() => handleViewChildren(parent)}
                style={{
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {parent.name}{" "}
                <Badge
                  count={getChildCount(parent.id)}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSpecies}
        rowKey="id"
        pagination={{ pageSize: 15 }}
        loading={loading}
      />

      {/* Modal for Adding/Editing */}
      <Modal
        title={editingSpecies ? "Edit Species" : "Add Species"}
        open={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={loading}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSpecies(null);
          form.resetFields();
        }}
        okText={editingSpecies ? "Update" : "Add"}
        okButtonProps={{
          style: { backgroundColor: "#004c78", borderColor: "#004c78" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Species Name"
            name="name"
            rules={[{ required: true, message: "Please enter species name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Parent Species (Optional)" name="parent_id">
            <Select
              allowClear
              placeholder="Select a parent species"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {parents.map((parent) => (
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
        title={`Child Species of ${currentParent?.name || ""}`}
        open={isViewChildrenModalVisible}
        onCancel={() => setIsViewChildrenModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsViewChildrenModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        <div className="mb-3">
          <h3 className="text-base font-medium">
            Total: {childSpecies.length} child species
          </h3>
        </div>
        <Table
          columns={childColumns}
          dataSource={childSpecies}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
        {/* Article Assignment Modal */}
      <ArticleAssignmentModal
        visible={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedSpecies(null);
        }}
        selectedItem={selectedSpecies}
        assignmentType="species"
        assignEndpoint="/assign-articles-to-species"
        removeEndpoint="/remove-article-from-species"
        onAssignmentChange={
          () => {
            dispatch(get_specie_service_auth());
          }
        }
      />
    </div>
  );
};

export default Species;
