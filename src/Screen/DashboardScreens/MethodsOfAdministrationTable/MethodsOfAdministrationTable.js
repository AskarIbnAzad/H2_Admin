// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
// import BackButton from "../../../Component/BackBtn/BackButton";
// import { add_methods_service_auth, get_methods_service_auth } from "../../../Services/SpecieService";

// const MethodsOfAdministrationTable = () => {
//     const dispatch = useDispatch();
//     const { get_method_data } = useSelector((state) => state.method);

//     const [filteredMethods, setFilteredMethods] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingMethod, setEditingMethod] = useState(null);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         // Fetch methods of administration on component mount
//         dispatch(get_methods_service_auth());
//     }, [dispatch]);

//     useEffect(() => {
//         // Update filtered methods whenever data is fetched
//         if (get_method_data?.methods) {
//             setFilteredMethods(get_method_data.methods);
//         }
//     }, [get_method_data]);

//     // Search functionality
//     const handleSearch = (value) => {
//         setSearchValue(value);
//         const filtered = get_method_data?.methods.filter((method) =>
//             method.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredMethods(filtered);
//     };

//     // Add or Edit method
//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingMethod) {
//                 // Edit logic
//                 await apiHandle.post(`/edit-methods/${editingMethod.id}`, {
//                     name: values.name,
//                 });
//                 notification.success({ message: "Method updated successfully!" });

//                 // Update the state directly for real-time table update
//                 setFilteredMethods((prev) =>
//                     prev.map((method) =>
//                         method.id === editingMethod.id ? { ...method, name: values.name } : method
//                     )
//                 );
//             } else {
//                 // Add method
//                 const obj = { name: values.name };
//                 const response = await dispatch(add_methods_service_auth(obj));

//                 if (response?.payload?.id) {
//                     // Update the state directly with the new method for real-time table update
//                     setFilteredMethods((prev) => [...prev, { id: response.payload.id, name: obj.name }]);
//                     //   notification.success({ message: "Method added successfully!" });
//                 }
//             }
//             dispatch(get_methods_service_auth());
//             setIsModalVisible(false);
//             setEditingMethod(null);
//             form.resetFields();
//         } catch (error) {
//             console.error("Error while adding/editing method:", error);
//             notification.error({ message: "Failed to add or update method." });
//         }
//     };




//     // Show modal for adding or editing
//     const handleAddEdit = (method = null) => {
//         setEditingMethod(method);
//         setIsModalVisible(true);
//         if (method) {
//             form.setFieldsValue({ name: method.name });
//         } else {
//             form.resetFields();
//         }
//     };

//     // Delete method
//     const handleDelete = async (id) => {
//         try {
//             await apiHandle.post(`/delete-methods/${id}`);
//             notification.success({ message: "Method deleted successfully!" });
//             dispatch(get_methods_service_auth()); // Refresh the list
//         } catch (error) {
//             console.error("Error while deleting method:", error);
//             notification.error({ message: "Failed to delete method." });
//         }
//     };

//     // Table columns
//     const columns = [
//         {
//             title: "Method Name",
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
//                 <h1 className="text-2xl font-bold">Methods of Administration Management</h1>
//             </div>
//             <div className="flex justify-between items-center mb-3">
//                 <Input.Search
//                     placeholder="Search methods"
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
//                     Add Method
//                 </Button>
//             </div>
//             <Table
//                 columns={columns}
//                 dataSource={filteredMethods}
//                 rowKey="id"
//                 pagination={{ pageSize: 15 }}
//             />

//             {/* Modal for Adding/Editing */}
//             <Modal
//                 title={editingMethod ? "Edit Method" : "Add Method"}
//                 visible={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     setEditingMethod(null);
//                     form.resetFields();
//                 }}
//                 okText={editingMethod ? "Update" : "Add"}
//                 okButtonProps={{
//                     style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//                 }}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Method Name"
//                         name="name"
//                         rules={[{ required: true, message: "Please enter method name" }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default MethodsOfAdministrationTable;



import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import { add_methods_service_auth, get_methods_service_auth } from "../../../Services/SpecieService";

const MethodsOfAdministrationTable = () => {
    const dispatch = useDispatch();
    const { get_method_data } = useSelector((state) => state.method);

    const [filteredMethods, setFilteredMethods] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch methods of administration on component mount
        setLoading(true);
        dispatch(get_methods_service_auth()).finally(() => {
            setLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        // Update filtered methods whenever data is fetched
        if (get_method_data?.methods) {
            setFilteredMethods(get_method_data.methods);
        }
    }, [get_method_data]);

    // Search functionality
    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_method_data?.methods.filter((method) =>
            method.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredMethods(filtered);
    };

    // Add or Edit method
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingMethod) {
                // Edit logic
                await apiHandle.post(`/edit-methods/${editingMethod.id}`, {
                    name: values.name,
                });
                notification.success({ message: "Method updated successfully!" });

                // Update the state directly for real-time table update
                setFilteredMethods((prev) =>
                    prev.map((method) =>
                        method.id === editingMethod.id ? { ...method, name: values.name } : method
                    )
                );
            } else {
                // Add method
                const obj = { name: values.name };
                const response = await dispatch(add_methods_service_auth(obj));

                if (response?.payload?.id) {
                    // Update the state directly with the new method for real-time table update
                    setFilteredMethods((prev) => [...prev, { id: response.payload.id, name: obj.name }]);
                    //   notification.success({ message: "Method added successfully!" });
                }
            }
            dispatch(get_methods_service_auth());
            setIsModalVisible(false);
            setEditingMethod(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing method:", error);
            notification.error({ message: "Failed to add or update method." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (method = null) => {
        setEditingMethod(method);
        setIsModalVisible(true);
        if (method) {
            form.setFieldsValue({ name: method.name });
        } else {
            form.resetFields();
        }
    };

    // Delete method
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-methods/${id}`);
            notification.success({ message: "Method deleted successfully!" });
            dispatch(get_methods_service_auth()); // Refresh the list
        } catch (error) {
            console.error("Error while deleting method:", error);
            notification.error({ message: "Failed to delete method." });
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: "Method Name",
            dataIndex: "name",
            key: "name",
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
                <h1 className="text-2xl font-bold">Methods of Administration Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search methods"
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
                    Add Method
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredMethods}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingMethod ? "Edit Method" : "Add Method"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingMethod(null);
                    form.resetFields();
                }}
                okText={editingMethod ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Method Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter method name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MethodsOfAdministrationTable;