// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
// import BackButton from "../../../Component/BackBtn/BackButton";
// import { add_systems_service_auth, get_systems_service_auth } from "../../../Services/SpecieService";

// const PhysiologicalSystemsTable = () => {
//     const dispatch = useDispatch();
//     const { get_systems_data } = useSelector((state) => state.systems);

//     const [filteredSystems, setFilteredSystems] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingSystem, setEditingSystem] = useState(null);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         // Fetch systems on component mount
//         dispatch(get_systems_service_auth());
//     }, [dispatch]);

//     useEffect(() => {
//         // Update filtered systems whenever data is fetched
//         if (get_systems_data?.system) {
//             setFilteredSystems(get_systems_data.system);
//         }
//     }, [get_systems_data]);

//     // Search functionality
//     const handleSearch = (value) => {
//         setSearchValue(value);
//         const filtered = get_systems_data?.system.filter((system) =>
//             system.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredSystems(filtered);
//     };

//     // Add or Edit system
//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingSystem) {
//                 // Edit logic
//                 await apiHandle.post(`/edit-systems/${editingSystem.id}`, {
//                     name: values.name,
//                 });
//                 notification.success({ message: "System updated successfully!" });
//             } else {
//                 // Add system
//                 const obj = { name: values.name };
//                 await dispatch(add_systems_service_auth(obj)).unwrap(); // Wait for successful addition
//                 // notification.success({ message: "System added successfully!" });
//             }
//             dispatch(get_systems_service_auth()); // Refresh the list
//             setIsModalVisible(false);
//             setEditingSystem(null);
//             form.resetFields();
//         } catch (error) {
//             console.error("Error while adding/editing system:", error);
//             notification.error({ message: "Failed to add or update system." });
//         }
//     };

//     // Show modal for adding or editing
//     const handleAddEdit = (system = null) => {
//         setEditingSystem(system);
//         setIsModalVisible(true);
//         if (system) {
//             form.setFieldsValue({ name: system.name });
//         } else {
//             form.resetFields();
//         }
//     };

//     // Delete system
//     const handleDelete = async (id) => {
//         try {
//             await apiHandle.post(`/delete-systems/${id}`);
//             notification.success({ message: "System deleted successfully!" });
//             dispatch(get_systems_service_auth()); // Refresh the list
//         } catch (error) {
//             console.error("Error while deleting system:", error);
//             notification.error({ message: "Failed to delete system." });
//         }
//     };

//     // Table columns
//     const columns = [
//         {
//             title: "System Name",
//             dataIndex: "name",
//             key: "name",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <div style={{ display: "flex", gap: "10px" }}>
//                     <Button
//                         style={{
//                             backgroundColor: "#004c78",
//                             color: "white",
//                         }}
//                         icon={<EditOutlined />}
//                         onClick={() => handleAddEdit(record)}
//                     >
//                         Edit
//                     </Button>
//                     <Button
//                         style={{
//                             backgroundColor: "#fff1f0",
//                             color: "#cf1322",
//                             borderColor: "#ffa39e",
//                         }}
//                         icon={<DeleteOutlined />}
//                         onClick={() => handleDelete(record.id)}
//                     >
//                         Delete
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="container mx-auto p-6">
//             <div className="flex space-x-5 items-center mb-6">
//                 <BackButton path={"/DataManager"} />{" "}
//                 <h1 className="text-2xl font-bold">Physiological Systems Management</h1>
//             </div>
//             <div className="flex justify-between items-center mb-3">
//                 <Input.Search
//                     placeholder="Search systems"
//                     value={searchValue}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     style={{ width: "300px" }}
//                 />
//                 <Button
//                     style={{
//                         marginTop: "10px",
//                         backgroundColor: "#004c78",
//                         color: "white",
//                     }}
//                     icon={<PlusOutlined />}
//                     onClick={() => handleAddEdit()}
//                 >
//                     Add System
//                 </Button>
//             </div>
//             <Table
//                 columns={columns}
//                 dataSource={filteredSystems}
//                 rowKey="id"
//                 pagination={{ pageSize: 15 }}
//             />

//             {/* Modal for Adding/Editing */}
//             <Modal
//                 title={editingSystem ? "Edit System" : "Add System"}
//                 visible={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     setEditingSystem(null);
//                     form.resetFields();
//                 }}
//                 okText={editingSystem ? "Update" : "Add"}
//                 okButtonProps={{
//                     style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//                 }}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="System Name"
//                         name="name"
//                         rules={[{ required: true, message: "Please enter system name" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default PhysiologicalSystemsTable;




import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { add_systems_service_auth, get_systems_service_auth } from "../../../Services/SpecieService";

const PhysiologicalSystemsTable = () => {
    const dispatch = useDispatch();
    const { get_systems_data } = useSelector((state) => state.systems);

    const [filteredSystems, setFilteredSystems] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSystem, setEditingSystem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch systems on component mount
        setLoading(true);
        dispatch(get_systems_service_auth()).finally(() => {
            setLoading(false);
        });
        //
    }, [dispatch]);

    useEffect(() => {
        // Update filtered systems whenever data is fetched
        if (get_systems_data?.systems) {
            setFilteredSystems(get_systems_data.systems);
        }
    }, [get_systems_data]);

    // Search functionality
    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_systems_data?.systems.filter((system) =>
            system.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSystems(filtered);
    };

  

    // Add or Edit system
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingSystem) {
                // Edit logic
                await apiHandle.post(`/edit-systems/${editingSystem.id}`, {
                    name: values.name,
                });
                notification.success({ message: "System updated successfully!" });
            } else {
                // Add system
                const obj = { name: values.name };
                await dispatch(add_systems_service_auth(obj)).unwrap(); // Wait for successful addition
                // notification.success({ message: "System added successfully!" });
            }
            dispatch(get_systems_service_auth()); // Refresh the list
            //
            setIsModalVisible(false);
            setEditingSystem(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing system:", error);
            notification.error({ message: "Failed to add or update system." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (system = null) => {
        setEditingSystem(system);
        setIsModalVisible(true);
        if (system) {
            form.setFieldsValue({ name: system.name });
        } else {
            form.resetFields();
        }
    };

    // Delete system
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-systems/${id}`);
            notification.success({ message: "System deleted successfully!" });
            dispatch(get_systems_service_auth()); // Refresh the list
            //
        } catch (error) {
            console.error("Error while deleting system:", error);
            notification.error({ message: "Failed to delete system." });
        } finally {
            setLoading(false);
        }
    };

    // Handle article assignment modal
    const handleManageArticles = (system) => {
        setSelectedSystem(system);
        setIsAssignModalVisible(true);
    };

    // Table columns
    const columns = [
        {
            title: "System Name",
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
                <h1 className="text-2xl font-bold">Physiological Systems Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search systems"
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
                    Add System
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredSystems}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingSystem ? "Edit System" : "Add System"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingSystem(null);
                    form.resetFields();
                }}
                okText={editingSystem ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="System Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter system name" }]}
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
                    setSelectedSystem(null);
                }}
                selectedItem={selectedSystem}
                assignmentType="systems"
                onAssignmentChange={
                    () => {
                        dispatch(get_systems_service_auth());
                    }
                }
            />
        </div>
    );
};

export default PhysiologicalSystemsTable;