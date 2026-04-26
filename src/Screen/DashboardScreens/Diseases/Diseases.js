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
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import {
  get_disease_service_auth,
  add_disease_service_auth,
  edit_disease_service_auth,
  delete_disease_service_auth,
} from "../../../Services/DiseaseService";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";



const DiseaseScreen = () => {
  const dispatch = useDispatch();
  const { get_disease_data } = useSelector((state) => state.diseases);

  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [parents, setParents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewChildrenModalVisible, setIsViewChildrenModalVisible] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [childDiseases, setChildDiseases] = useState([]);
  const [editingDisease, setEditingDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [form] = Form.useForm();

  const sortDiseasesAlphabetically = (diseaseArray) => {
    if (!diseaseArray || !Array.isArray(diseaseArray)) return [];
    return [...diseaseArray].sort((a, b) => (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()));
  };

  useEffect(() => {
    setLoading(true);
    dispatch(get_disease_service_auth()).finally(() => setLoading(false));
    //
  }, [dispatch]);

  useEffect(() => {
    if (get_disease_data?.diseases) {
      const sortedDiseases = sortDiseasesAlphabetically(get_disease_data.diseases);
      setFilteredDiseases(sortedDiseases);
      setParents(sortedDiseases.filter((d) => !d.parent_id));
    }
  }, [get_disease_data]);

  // Fetch assignment counts for all diseases
  const fetchAssignmentCounts = async () => {
    try {
      const response = await apiHandle.get('/disease-assignment-counts');
      setAssignmentCounts(response.data?.counts || {});
    } catch (error) {
      console.error("Error fetching assignment counts:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = get_disease_data?.diseases.filter((disease) =>
      disease.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDiseases(sortDiseasesAlphabetically(filtered));
    setParents(filtered.filter((d) => !d.parent_id));
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const diseaseData = {
        name: values.name,
        parent_id: values.parent_id || null,
        short_description: values.short_description || null,
        description: values.description || null,
      };

      if (editingDisease && editingDisease.id) {
        await dispatch(edit_disease_service_auth({ id: editingDisease.id, data: diseaseData }));
        notification.success({ message: "Disease/Disorder updated successfully!" });
      } else if (editingDisease && !editingDisease.id) {
        notification.error({ message: "Error: Disease ID is missing. Cannot update." });
        return;
      } else {
        const response = await dispatch(add_disease_service_auth(diseaseData));
        if (response?.payload?.id) {
          notification.success({ message: "Disease/Disorder added successfully!" });
        }
      }
      dispatch(get_disease_service_auth());
      //
      setIsModalVisible(false);
      setEditingDisease(null);
      form.resetFields();
    } catch (error) {
      notification.error({ message: "Failed to add or update disease/disorder." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = (disease = null) => {
    setEditingDisease(disease);
    setIsModalVisible(true);
    if (disease) {
      form.setFieldsValue({
        name: disease.name,
        parent_id: disease.parent_id || null,
        short_description: disease.short_description || '',
        description: disease.description || '',
      });
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await dispatch(delete_disease_service_auth(id));
      notification.success({ message: "Disease/Disorder deleted successfully!" });
      dispatch(get_disease_service_auth());
      //
    } catch (error) {
      notification.error({ message: "Failed to delete disease." });
    } finally {
      setLoading(false);
    }
  };

  const handleViewChildren = (parent) => {
    setCurrentParent(parent);
    const children = filteredDiseases.filter((disease) => disease.parent_id === parent.id);
    setChildDiseases(children);
    setIsViewChildrenModalVisible(true);
  };

  // Handle article assignment modal
  const handleManageArticles = (disease) => {
    setSelectedDisease(disease);
    setIsAssignModalVisible(true);
  };

  const getChildCount = (parentId) => {
    return filteredDiseases.filter((disease) => disease.parent_id === parentId).length;
  };

  const columns = [
    {
      title: "Disease/Disorder Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <span>
          {text}
          {record.parent_id && (
            <Tooltip title={`Parent: ${filteredDiseases.find((d) => d.id === record.parent_id)?.name || "Unknown"}`}>
              <span className="ml-2 text-gray-500 text-sm italic">
                (Child of {filteredDiseases.find((d) => d.id === record.parent_id)?.name || "Unknown"})
              </span>
            </Tooltip>
          )}
        </span>
      ),
    },
    {
      title: "Parent Disease",
      key: "parent",
      sorter: (a, b) => {
        const parentA = a.parent_id ? (filteredDiseases.find((d) => d.id === a.parent_id)?.name || "") : "";
        const parentB = b.parent_id ? (filteredDiseases.find((d) => d.id === b.parent_id)?.name || "") : "";
        return parentA.localeCompare(parentB);
      },
      render: (_, record) =>
        record.parent_id ? (filteredDiseases.find((d) => d.id === record.parent_id)?.name || "Unknown") : "None",
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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button
            style={{ backgroundColor: "#004c78", color: "white" }}
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
              count={record?.articles_count || 0} 
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

  const childColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Disease/Disorder Name",
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
        <h1 className="text-2xl font-bold">Diseases/Disorders Management</h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <Input.Search
          placeholder="Search diseases/disorders"
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
          Add Disease/Disorder
        </Button>
      </div>

      {/* Parent Disease/Disorder Filter */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Parent Disease/Disorder List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {parents.map((parent) => (
            <Tooltip
              key={parent.id}
              title={`${getChildCount(parent.id)} child diseases/disorders`}
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
        dataSource={filteredDiseases}
        rowKey="id"
        pagination={{ pageSize: 15 }}
        loading={loading}
      />

      {/* Modal for Adding/Editing */}
      <Modal
        title={editingDisease ? "Edit Disease" : "Add Disease"}
        open={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={loading}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDisease(null);
          form.resetFields();
        }}
        okText={editingDisease ? "Update" : "Add"}
        okButtonProps={{
          style: { backgroundColor: "#004c78", borderColor: "#004c78" },
        }}
      >
        <Form form={form} layout="vertical">
        <Form.Item
          label="Disease/Disorder Name"
          name="name"
          rules={[{ required: true, message: "Please enter disease/disorder name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Parent Disease/Disorder" name="parent_id">
          <Select
            allowClear
            placeholder="Select a parent disease/disorder"
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
          <Form.Item label="Short Description" name="short_description">
            <Input.TextArea rows={3} placeholder="Enter short details about the disease/disorder" />
          </Form.Item>
          <Form.Item label="Description (HTML Allowed)" name="description">
            <Input.TextArea rows={5} placeholder="Enter additional details about the disease/disorder" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing Children */}
      <Modal
        title={`Child Diseases/Disorders of ${currentParent?.name || ""}`}
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
            Total: {childDiseases.length} child diseases
          </h3>
        </div>
        <Table
          columns={childColumns}
          dataSource={childDiseases}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* Article Assignment Modal */}
      <ArticleAssignmentModal
        visible={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedDisease(null);
        }}
        selectedItem={selectedDisease}
        assignmentType="disease"
        onAssignmentChange={
          () => {
            dispatch(get_disease_service_auth());
          }
        }
      />
    </div>
  );
};

export default DiseaseScreen;

