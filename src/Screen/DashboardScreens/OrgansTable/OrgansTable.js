// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
// import BackButton from "../../../Component/BackBtn/BackButton";
// import { get_organs_service_auth, add_organs_service_auth } from "../../../Services/SpecieService";

// const OrgansTable = () => {
//     const dispatch = useDispatch();
//     const { get_organs_data } = useSelector((state) => state.organs);

//     const [filteredOrgans, setFilteredOrgans] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingOrgan, setEditingOrgan] = useState(null);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         // Fetch organs/tissues on component mount
//         dispatch(get_organs_service_auth());
//     }, [dispatch]);

//     useEffect(() => {
//         // Update filtered organs whenever data is fetched
//         if (get_organs_data?.organs) {
//             setFilteredOrgans(get_organs_data.organs);
//         }
//     }, [get_organs_data]);

//     // Search functionality
//     const handleSearch = (value) => {
//         setSearchValue(value);
//         const filtered = get_organs_data?.organs.filter((organ) =>
//             organ.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredOrgans(filtered);
//     };

//     // Add or Edit organ/tissue
//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingOrgan) {
//                 // Edit logic
//                 await apiHandle.post(`/edit-organs/${editingOrgan.id}`, {
//                     name: values.name,
//                 });
//                 notification.success({ message: "Organ/Tissue updated successfully!" });
//             } else {
//                 // Add organ/tissue
//                 const obj = { name: values.name };
//                 await dispatch(add_organs_service_auth(obj)).unwrap();
//             }
//             dispatch(get_organs_service_auth()); // Refresh the list
//             setIsModalVisible(false);
//             setEditingOrgan(null);
//             form.resetFields();
//         } catch (error) {
//             console.error("Error while adding/editing organ/tissue:", error);
//             notification.error({ message: "Failed to add or update organ/tissue." });
//         }
//     };

//     // Show modal for adding or editing
//     const handleAddEdit = (organ = null) => {
//         setEditingOrgan(organ);
//         setIsModalVisible(true);
//         if (organ) {
//             form.setFieldsValue({ name: organ.name });
//         } else {
//             form.resetFields();
//         }
//     };

//     // Delete organ/tissue
//     const handleDelete = async (id) => {
//         try {
//             await apiHandle.post(`/delete-organs/${id}`);
//             notification.success({ message: "Organ/Tissue deleted successfully!" });
//             dispatch(get_organs_service_auth()); // Refresh the list
//         } catch (error) {
//             console.error("Error while deleting organ/tissue:", error);
//             notification.error({ message: "Failed to delete organ/tissue." });
//         }
//     };

//     // Table columns
//     const columns = [
//         {
//             title: "Organ/Tissue Name",
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
//                 <h1 className="text-2xl font-bold">Organ/Tissue Management</h1>
//             </div>
//             <div className="flex justify-between items-center mb-3">
//                 <Input.Search
//                     placeholder="Search organs/tissues"
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
//                     Add Organ/Tissue
//                 </Button>
//             </div>
//             <Table
//                 columns={columns}
//                 dataSource={filteredOrgans}
//                 rowKey="id"
//                 pagination={{ pageSize: 15 }}
//             />

//             {/* Modal for Adding/Editing */}
//             <Modal
//                 title={editingOrgan ? "Edit Organ/Tissue" : "Add Organ/Tissue"}
//                 visible={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     setEditingOrgan(null);
//                     form.resetFields();
//                 }}
//                 okText={editingOrgan ? "Update" : "Add"}
//                 okButtonProps={{
//                     style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//                 }}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Organ/Tissue Name"
//                         name="name"
//                         rules={[{ required: true, message: "Please enter organ/tissue name" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default OrgansTable;



import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { get_organs_service_auth, add_organs_service_auth } from "../../../Services/SpecieService";

const OrgansTable = () => {
    const dispatch = useDispatch();
    const { get_organs_data } = useSelector((state) => state.organs);

    const [filteredOrgans, setFilteredOrgans] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrgan, setEditingOrgan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch organs/tissues on component mount
        setLoading(true);
        dispatch(get_organs_service_auth()).finally(() => {
            setLoading(false);
        });
        //
    }, [dispatch]);

    useEffect(() => {
        // Update filtered organs whenever data is fetched
        if (get_organs_data?.organs) {
            setFilteredOrgans(get_organs_data.organs);
        }
    }, [get_organs_data]);

    // Search functionality
    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_organs_data?.organs.filter((organ) =>
            organ.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOrgans(filtered);
    };

    // Fetch assignment counts for all organs
    const fetchAssignmentCounts = async () => {
        try {
            const response = await apiHandle.get('/organ-assignment-counts');
            setAssignmentCounts(response.data?.counts || {});
        } catch (error) {
            console.error("Error fetching assignment counts:", error);
        }
    };

    // Add or Edit organ/tissue
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingOrgan) {
                // Edit logic
                await apiHandle.post(`/edit-organs/${editingOrgan.id}`, {
                    name: values.name,
                });
                notification.success({ message: "Organ/Tissue updated successfully!" });
            } else {
                // Add organ/tissue
                const obj = { name: values.name };
                await dispatch(add_organs_service_auth(obj)).unwrap();
            }
            dispatch(get_organs_service_auth()); // Refresh the list
            //
            setIsModalVisible(false);
            setEditingOrgan(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing organ/tissue:", error);
            notification.error({ message: "Failed to add or update organ/tissue." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (organ = null) => {
        setEditingOrgan(organ);
        setIsModalVisible(true);
        if (organ) {
            form.setFieldsValue({ name: organ.name });
        } else {
            form.resetFields();
        }
    };

    // Delete organ/tissue
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-organs/${id}`);
            notification.success({ message: "Organ/Tissue deleted successfully!" });
            dispatch(get_organs_service_auth()); // Refresh the list
            //
        } catch (error) {
            console.error("Error while deleting organ/tissue:", error);
            notification.error({ message: "Failed to delete organ/tissue." });
        } finally {
            setLoading(false);
        }
    };

    // Handle article assignment modal
    const handleManageArticles = (organ) => {
        setSelectedOrgan(organ);
        setIsAssignModalVisible(true);
    };

    // Table columns
    const columns = [
        {
            title: "Organ/Tissue Name",
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
                            count={record.articles_count|| 0} 
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
                <h1 className="text-2xl font-bold">Organ/Tissue Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search organs/tissues"
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
                    Add Organ/Tissue
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrgans}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingOrgan ? "Edit Organ/Tissue" : "Add Organ/Tissue"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingOrgan(null);
                    form.resetFields();
                }}
                okText={editingOrgan ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Organ/Tissue Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter organ/tissue name" }]}
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
                    setSelectedOrgan(null);
                }}
                selectedItem={selectedOrgan}
                assignmentType="organs"
                onAssignmentChange={() => {
                    dispatch(get_organs_service_auth());
                }}
            />
        </div>
    );
};

export default OrgansTable;