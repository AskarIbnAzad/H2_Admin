// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import BackButton from "../../../Component/BackBtn/BackButton";
// import { add_roles_service_auth, delete_roles_service_auth, edit_roles_service_auth, get_roles_service_auth } from "../../../Services/SpecieService";


// const RolesTable = () => {
//     const dispatch = useDispatch();
//     const { get_roles_data } = useSelector((state) => state.species);

//     const [filteredRoles, setFilteredRoles] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingRole, setEditingRole] = useState(null);
//     const [form] = Form.useForm();


//     console.log("get_roles_data", get_roles_data);

//     useEffect(() => {
//         // Fetch roles on component mount
//         dispatch(get_roles_service_auth());
//     }, [dispatch]);

//     useEffect(() => {
//         // Update filtered roles whenever data is fetched
//         if (get_roles_data?.roles) {
//             setFilteredRoles(get_roles_data.roles);
//         }
//     }, [get_roles_data]);

//     // Search functionality
//     const handleSearch = (value) => {
//         setSearchValue(value);
//         const filtered = get_roles_data?.roles.filter((role) =>
//             role.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredRoles(filtered);
//     };

//     // Add or Edit role
//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingRole) {
//                 // Edit role
//                 await dispatch(
//                     edit_roles_service_auth({ id: editingRole.id, data: values })
//                 ).unwrap();
//                 notification.success({ message: "Role updated successfully!" });
//             } else {
//                 // Add role
//                 const obj = { name: values.name };
//                 await dispatch(add_roles_service_auth(obj)).unwrap();
//             }
//             dispatch(get_roles_service_auth());
//             setIsModalVisible(false);
//             setEditingRole(null);
//             form.resetFields();
//         } catch (error) {
//             console.error("Error while adding/editing role:", error);
//             notification.error({ message: "Failed to add or update role." });
//         }
//     };

//     // Show modal for adding or editing
//     const handleAddEdit = (role = null) => {
//         setEditingRole(role);
//         setIsModalVisible(true);
//         if (role) {
//             form.setFieldsValue({ name: role.name });
//         } else {
//             form.resetFields();
//         }
//     };

//     // Delete role
//     const handleDelete = async (id) => {
//         try {
//             await dispatch(delete_roles_service_auth(id)).unwrap();
//             notification.success({ message: "Role deleted successfully!" });
//             dispatch(get_roles_service_auth());
//         } catch (error) {
//             console.error("Error while deleting role:", error);
//             notification.error({ message: "Failed to delete role." });
//         }
//     };

//     // Table columns
//     const columns = [
//         {
//             title: "Role Name",
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
//                 <h1 className="text-2xl font-bold">Role Management</h1>
//             </div>
//             <div className="flex justify-between items-center mb-3">
//                 <Input.Search
//                     placeholder="Search roles"
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
//                     Add Role
//                 </Button>
//             </div>
//             <Table
//                 columns={columns}
//                 dataSource={filteredRoles}
//                 rowKey="id"
//                 pagination={{ pageSize: 15 }}
//             />

//             {/* Modal for Adding/Editing */}
//             <Modal
//                 title={editingRole ? "Edit Role" : "Add Role"}
//                 visible={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     setEditingRole(null);
//                     form.resetFields();
//                 }}
//                 okText={editingRole ? "Update" : "Add"}
//                 okButtonProps={{
//                     style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//                 }}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Role Name"
//                         name="name"
//                         rules={[{ required: true, message: "Please enter role name" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default RolesTable;


import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../../Component/BackBtn/BackButton";
import { add_roles_service_auth, delete_roles_service_auth, edit_roles_service_auth, get_roles_service_auth } from "../../../Services/SpecieService";


const RolesTable = () => {
    const dispatch = useDispatch();
    const { get_roles_data } = useSelector((state) => state.species);

    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();


    console.log("get_roles_data", get_roles_data);

    useEffect(() => {
        // Fetch roles on component mount
        setLoading(true);
        dispatch(get_roles_service_auth()).finally(() => {
            setLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        // Update filtered roles whenever data is fetched
        if (get_roles_data?.roles) {
            setFilteredRoles(get_roles_data.roles);
        }
    }, [get_roles_data]);

    // Search functionality
    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_roles_data?.roles.filter((role) =>
            role.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRoles(filtered);
    };

    // Add or Edit role
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingRole) {
                // Edit role
                await dispatch(
                    edit_roles_service_auth({ id: editingRole.id, data: values })
                ).unwrap();
                notification.success({ message: "Role updated successfully!" });
            } else {
                // Add role
                const obj = { name: values.name };
                await dispatch(add_roles_service_auth(obj)).unwrap();
            }
            dispatch(get_roles_service_auth());
            setIsModalVisible(false);
            setEditingRole(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing role:", error);
            notification.error({ message: "Failed to add or update role." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (role = null) => {
        setEditingRole(role);
        setIsModalVisible(true);
        if (role) {
            form.setFieldsValue({ name: role.name });
        } else {
            form.resetFields();
        }
    };

    // Delete role
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await dispatch(delete_roles_service_auth(id)).unwrap();
            notification.success({ message: "Role deleted successfully!" });
            dispatch(get_roles_service_auth());
        } catch (error) {
            console.error("Error while deleting role:", error);
            notification.error({ message: "Failed to delete role." });
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: "Role Name",
            dataIndex: "name",
            key: "name",
        },
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <div style={{ display: "flex", gap: "10px" }}>
        //             <Button
        //                 style={{
        //                     backgroundColor: "#004c78",
        //                     color: "white",
        //                 }}
        //                 icon={<EditOutlined />}
        //                 onClick={() => handleAddEdit(record)}
        //             >
        //                 Edit
        //             </Button>
        //             <Button
        //                 style={{
        //                     backgroundColor: "#fff1f0",
        //                     color: "#cf1322",
        //                     borderColor: "#ffa39e",
        //                 }}
        //                 icon={<DeleteOutlined />}
        //                 onClick={() => handleDelete(record.id)}
        //             >
        //                 Delete
        //             </Button>
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex space-x-5 items-center mb-6">
                <BackButton path={"/DataManager"} />{" "}
                <h1 className="text-2xl font-bold">Role Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search roles"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: "300px" }}
                />
                {/*<Button*/}
                {/*    style={{*/}
                {/*        marginTop: "10px",*/}
                {/*        backgroundColor: "#004c78",*/}
                {/*        color: "white",*/}
                {/*    }}*/}
                {/*    icon={<PlusOutlined />}*/}
                {/*    onClick={() => handleAddEdit()}*/}
                {/*>*/}
                {/*    Add Role*/}
                {/*</Button>*/}
            </div>
            <Table
                columns={columns}
                dataSource={filteredRoles}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingRole ? "Edit Role" : "Add Role"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingRole(null);
                    form.resetFields();
                }}
                okText={editingRole ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter role name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RolesTable;