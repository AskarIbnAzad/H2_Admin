// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
// import BackButton from "../../../Component/BackBtn/BackButton";
// import { get_study_type_service_auth, add_study_type_service_auth } from "../../../Services/SpecieService";

// const ArticleTypeTable = () => {
//   const dispatch = useDispatch();
//   const { get_study_type_data } = useSelector((state) => state.StudyType);

//   const [filteredStudyTypes, setFilteredStudyTypes] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingStudyType, setEditingStudyType] = useState(null);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     // Fetch study types on component mount
//     dispatch(get_study_type_service_auth());
//   }, [dispatch]);

//   useEffect(() => {
//     // Update filtered study types whenever study types are fetched
//     if (get_study_type_data?.study_type) {
//       setFilteredStudyTypes(get_study_type_data.study_type);
//     }
//   }, [get_study_type_data]);

//   // Search functionality
//   const handleSearch = (value) => {
//     setSearchValue(value);
//     const filtered = get_study_type_data?.study_type.filter((type) =>
//       type.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredStudyTypes(filtered);
//   };

//   // Add or Edit study type
//   const handleModalOk = async () => {
//     try {
//       const values = await form.validateFields();
//       if (editingStudyType) {
//         // Edit logic
//         await apiHandle.post(`/edit-study-type/${editingStudyType.id}`, {
//           name: values.name,
//         });
//         notification.success({ message: "Study Type updated successfully!" });

//         // Update state for real-time table update
//         setFilteredStudyTypes((prev) =>
//           prev.map((type) =>
//             type.id === editingStudyType.id ? { ...type, name: values.name } : type
//           )
//         );
//       } else {
//         // Add study type
//         const obj = { name: values.name };
//         const response = await dispatch(add_study_type_service_auth(obj));

//         if (response?.payload?.id) {
//           // Add the new study type to the local state for real-time update
//           setFilteredStudyTypes((prev) => [
//             ...prev,
//             { id: response.payload.id, name: obj.name },
//           ]);
//           notification.success({ message: "Study Type added successfully!" });
//         }
//       }
//       dispatch(get_study_type_service_auth());
//       setIsModalVisible(false);
//       setEditingStudyType(null);
//       form.resetFields();
//     } catch (error) {
//       console.error("Error while adding/editing study type:", error);
//       notification.error({ message: "Failed to add or update study type." });
//     }
//   };


//   // Show modal for adding or editing
//   const handleAddEdit = (studyType = null) => {
//     setEditingStudyType(studyType);
//     setIsModalVisible(true);
//     if (studyType) {
//       form.setFieldsValue({ name: studyType.name });
//     } else {
//       form.resetFields();
//     }
//   };

//   // Delete study type
//   const handleDelete = async (id) => {
//     try {
//       await apiHandle.post(`/delete-study-type/${id}`);
//       notification.success({ message: "Study Type deleted successfully!" });
//       dispatch(get_study_type_service_auth()); // Refresh the list
//     } catch (error) {
//       console.error("Error while deleting study type:", error);
//       notification.error({ message: "Failed to delete study type." });
//     }
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "Study Type",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <div style={{ display: "flex", gap: "10px" }}>
//           <Button
//             style={{
//               backgroundColor: "#004c78",
//               color: "white",
//             }}
//             icon={<EditOutlined />}
//             onClick={() => handleAddEdit(record)}
//           >
//             Edit
//           </Button>
//           <Button
//             style={{
//               backgroundColor: "#fff1f0",
//               color: "#cf1322",
//               borderColor: "#ffa39e",
//             }}
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(record.id)}
//           >
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex space-x-5 items-center mb-6">
//         <BackButton path={"/DataManager"} />{" "}
//         <h1 className="text-2xl font-bold">Article Type Management</h1>
//       </div>
//       <div className="flex justify-between items-center mb-3">
//         <Input.Search
//           placeholder="Search study types"
//           value={searchValue}
//           onChange={(e) => handleSearch(e.target.value)}
//           style={{ width: "300px" }}
//         />
//         <Button
//           style={{
//             marginTop: "10px",
//             backgroundColor: "#004c78",
//             color: "white",
//           }}
//           icon={<PlusOutlined />}
//           onClick={() => handleAddEdit()}
//         >
//           Add Study Type
//         </Button>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={filteredStudyTypes}
//         rowKey="id"
//         pagination={{ pageSize: 15 }}
//       />

//       {/* Modal for Adding/Editing */}
//       <Modal
//         title={editingStudyType ? "Edit Study Type" : "Add Study Type"}
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setEditingStudyType(null);
//           form.resetFields();
//         }}
//         okText={editingStudyType ? "Update" : "Add"}
//         okButtonProps={{
//           style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//         }}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Study Type Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter study type name" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ArticleTypeTable;



import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { get_study_type_service_auth, add_study_type_service_auth } from "../../../Services/SpecieService";
// import * as console from "node:console";

const ArticleTypeTable = () => {
  const dispatch = useDispatch();
  const { get_study_type_data } = useSelector((state) => state.StudyType);

  const [filteredStudyTypes, setFilteredStudyTypes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudyType, setEditingStudyType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedStudyType, setSelectedStudyType] = useState(null);
  const [form] = Form.useForm();


    // useEffect(() => {
    //     if (get_study_type_data?.studyTypes) {
    //
    //         const allTypes = get_study_type_data.studyTypes;
    //
    //         // Keep only main parent items
    //         const parentTypes = allTypes.filter(type => type.parent_id === null);
    //
    //         setFilteredStudyTypes(parentTypes);
    //     }
    // }, [get_study_type_data]);


    useEffect(() => {
    // Fetch study types on component mount
    setLoading(true);
    dispatch(get_study_type_service_auth()).finally(() => {
      setLoading(false);
    });
    //
  }, [dispatch]);

    useEffect(() => {

        const list = get_study_type_data?.studyTypes || [];

        // keep only parents (parent_id is null)
        const parentsOnly = list.filter((item) => item.parent_id == null);

        setFilteredStudyTypes(parentsOnly);
    }, [get_study_type_data]);

  // Search functionality
  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = get_study_type_data?.study_type.filter((type) =>
      type.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudyTypes(filtered);
  };

  // Add or Edit study type
  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (editingStudyType) {
        // Edit logic
        await apiHandle.post(`/edit-study-type/${editingStudyType.id}`, {
          name: values.name,
        });
        notification.success({ message: "Study Type updated successfully!" });

        // Update state for real-time table update
        setFilteredStudyTypes((prev) =>
          prev.map((type) =>
            type.id === editingStudyType.id ? { ...type, name: values.name } : type
          )
        );
      } else {
        // Add study type
        const obj = { name: values.name };
        const response = await dispatch(add_study_type_service_auth(obj));

        if (response?.payload?.id) {
          // Add the new study type to the local state for real-time update
          setFilteredStudyTypes((prev) => [
            ...prev,
            { id: response.payload.id, name: obj.name },
          ]);
          notification.success({ message: "Study Type added successfully!" });
        }
      }
      dispatch(get_study_type_service_auth());
      //
      setIsModalVisible(false);
      setEditingStudyType(null);
      form.resetFields();
    } catch (error) {
      console.error("Error while adding/editing study type:", error);
      notification.error({ message: "Failed to add or update study type." });
    } finally {
      setLoading(false);
    }
  };

  // Show modal for adding or editing
  const handleAddEdit = (studyType = null) => {
    setEditingStudyType(studyType);
    setIsModalVisible(true);
    if (studyType) {
      form.setFieldsValue({ name: studyType.name });
    } else {
      form.resetFields();
    }
  };

  // Delete study type
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiHandle.post(`/delete-study-type/${id}`);
      notification.success({ message: "Study Type deleted successfully!" });
      dispatch(get_study_type_service_auth()); // Refresh the list
      //
    } catch (error) {
      console.error("Error while deleting study type:", error);
      notification.error({ message: error?.response?.data?.message || "Failed to delete study type." });
    } finally {
      setLoading(false);
    }
  };

  // Handle article assignment modal
  const handleManageArticles = (studyType) => {
    setSelectedStudyType(studyType);
    setIsAssignModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Study Type",
      dataIndex: "name",
      key: "name",
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
        //add console
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex space-x-5 items-center mb-6">
        <BackButton path={"/DataManager"} />{" "}
        <h1 className="text-2xl font-bold">Article Type Management</h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <Input.Search
          placeholder="Search study types"
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
          Add Study Type
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredStudyTypes}
        rowKey="id"
        pagination={{ pageSize: 15 }}
        loading={loading}
      />

      {/* Modal for Adding/Editing */}
      <Modal
        title={editingStudyType ? "Edit Study Type" : "Add Study Type"}
        visible={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={loading}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingStudyType(null);
          form.resetFields();
        }}
        okText={editingStudyType ? "Update" : "Add"}
        okButtonProps={{
          style: { backgroundColor: "#004c78", borderColor: "#004c78" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Study Type Name"
            name="name"
            rules={[{ required: true, message: "Please enter study type name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Article Assignment Modal */}
      <ArticleAssignmentModal
        visible={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedStudyType(null);
        }}
        selectedItem={selectedStudyType}
        assignmentType="article-type"
        onAssignmentChange={
          //refetch study types to update counts
          () => dispatch(get_study_type_service_auth())
        }
      />
    </div>
  );
};

export default ArticleTypeTable;