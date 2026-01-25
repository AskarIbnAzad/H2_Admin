// import React, { useState, useEffect } from "react";
// import { Table, Input, Button, Modal, Form, notification } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     get_biomarker_service_auth,
// } from "../../../Services/BioMarkerService";
// import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
// import BackButton from "../../../Component/BackBtn/BackButton";


// const BiomarkerCategoryTable = () => {
//     const dispatch = useDispatch();
//     const { get_biomarker_data } = useSelector((state) => state.biomarker);

//     const [filteredCategories, setFilteredCategories] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         dispatch(get_biomarker_service_auth());
//     }, [dispatch]);

//     useEffect(() => {
//         if (get_biomarker_data?.category) {
//             setFilteredCategories(get_biomarker_data.category);
//         }
//     }, [get_biomarker_data]);

//     const handleSearch = (value) => {
//         setSearchValue(value);
//         const filtered = get_biomarker_data.category.filter((category) =>
//             category.name.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredCategories(filtered);
//     };

//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingCategory) {
//                 await apiHandle.post(`/edit-biomarker-category/${editingCategory.id}`, {
//                     name: values.name,
//                 });

//                 setFilteredCategories((prev) =>
//                     prev.map((category) =>
//                         category.id === editingCategory.id
//                             ? { ...category, ...values }
//                             : category
//                     )
//                 );
//                 notification.success({ message: "Category updated successfully!" });
//             } else {
//                 const response = await apiHandle.post("/add-biomarker-category", values)
//                 setFilteredCategories((prev) => [...prev, response?.data]);
//                 notification.success({ message: "Category added successfully!" });
//             }

//             dispatch(get_biomarker_service_auth());
//             setIsModalVisible(false);
//             setEditingCategory(null);
//             form.resetFields();
//         } catch (error) {
//             notification.error({ message: "Failed to process category" });
//         }
//     };

//     const handleAddEdit = (category = null) => {
//         setEditingCategory(category);
//         setIsModalVisible(true);
//         form.setFieldsValue(category || {});
//     };

//     const handleDelete = async (id) => {
//         try {
//             await apiHandle.post(`/delete-biomarker-category/${id}`);
//             notification.success({ message: "Category deleted successfully!" });
//             dispatch(get_biomarker_service_auth());
//         } catch (error) {
//             notification.error({ message: "Failed to delete category" });
//         }
//     };


//     const columns = [
//         {
//             title: "Category Name",
//             dataIndex: "name",
//             key: "name",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <div className="action-buttons">
//                     {record.status !== "Pending" && (
//                         <>
//                             <Button
//                                 style={{
//                                     backgroundColor: "#004c78",
//                                     color: "white",
//                                 }}
//                                 icon={<EditOutlined />}
//                                 onClick={() => handleAddEdit(record)}
//                             >
//                                 Edit
//                             </Button>
//                             <Button
//                                 style={{
//                                     backgroundColor: "#fff1f0",
//                                     color: "#cf1322",
//                                     borderColor: "#ffa39e",
//                                     marginLeft: 10
//                                 }}
//                                 icon={<DeleteOutlined />}
//                                 onClick={() => handleDelete(record.id)}
//                             >
//                                 Delete
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="container mx-auto p-6">
//             <div className="flex space-x-5 items-center mb-6">
//                 <BackButton path="/DataManager" />
//                 <h1 className="text-2xl font-bold">Biomarker Category Management</h1>
//             </div>

//             <div className="flex justify-between items-center mb-3">
//                 <Input.Search
//                     placeholder="Search categories"
//                     value={searchValue}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     style={{ width: 300 }}
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
//                     Add Category
//                 </Button>
//             </div>

//             <Table
//                 columns={columns}
//                 dataSource={filteredCategories}
//                 rowKey="id"
//                 pagination={{ pageSize: 15 }}
//             />

//             <Modal
//                 title={editingCategory ? "Edit Category" : "Add Category"}
//                 visible={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     form.resetFields();
//                 }}
//                 okText={editingCategory ? "Update" : "Add"}
//                 okButtonProps={{
//                     style: { backgroundColor: "#004c78", borderColor: "#004c78" },
//                 }}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Category Name"
//                         name="name"
//                         rules={[{ required: true }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default BiomarkerCategoryTable;



import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    get_biomarker_service_auth,
} from "../../../Services/BioMarkerService";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";


const BiomarkerCategoryTable = () => {
    const dispatch = useDispatch();
    const { get_biomarker_data } = useSelector((state) => state.biomarker);

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        dispatch(get_biomarker_service_auth()).finally(() => {
            setLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        if (get_biomarker_data?.category) {
            setFilteredCategories(get_biomarker_data.category);
        }
    }, [get_biomarker_data]);

    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_biomarker_data.category.filter((category) =>
            category.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingCategory) {
                await apiHandle.post(`/edit-biomarker-category/${editingCategory.id}`, {
                    name: values.name,
                });

                setFilteredCategories((prev) =>
                    prev.map((category) =>
                        category.id === editingCategory.id
                            ? { ...category, ...values }
                            : category
                    )
                );
                notification.success({ message: "Category updated successfully!" });
            } else {
                const response = await apiHandle.post("/add-biomarker-category", values)
                setFilteredCategories((prev) => [...prev, response?.data]);
                notification.success({ message: "Category added successfully!" });
            }

            dispatch(get_biomarker_service_auth());
            setIsModalVisible(false);
            setEditingCategory(null);
            form.resetFields();
        } catch (error) {
            notification.error({ message: "Failed to process category" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEdit = (category = null) => {
        setEditingCategory(category);
        setIsModalVisible(true);
        form.setFieldsValue(category || {});
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-biomarker-category/${id}`);
            notification.success({ message: "Category deleted successfully!" });
            dispatch(get_biomarker_service_auth());
        } catch (error) {
            notification.error({ message: "Failed to delete category" });
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            title: "Category Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-buttons">
                    {record.status !== "Pending" && (
                        <>
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
                                    marginLeft: 10
                                }}
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex space-x-5 items-center mb-6">
                <BackButton path="/DataManager" />
                <h1 className="text-2xl font-bold">Biomarker Category Management</h1>
            </div>

            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search categories"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
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
                    Add Category
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                okText={editingCategory ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BiomarkerCategoryTable;