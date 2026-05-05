import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Badge, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { get_organs_service_auth, add_organs_service_auth } from "../../../Services/SpecieService";
import OrganDiseaseAssignmentModal from '../../../Component/OrganDiseaseAssignmentModal/OrganDiseaseAssignmentModal';
import { get_disease_service_auth } from "../../../Services/DiseaseService";

const { TextArea } = Input;

const OrgansTable = () => {
    const dispatch = useDispatch();
    const { get_organs_data } = useSelector((state) => state.organs);

    const { get_disease_data } = useSelector((state) => state.diseases);
    const allDiseases = get_disease_data?.diseases || [];

    useEffect(() => {
        dispatch(get_disease_service_auth());
    }, [dispatch]);
    const [isDiseaseOrganModalVisible, setIsDiseaseOrganModalVisible] = useState(false);
    const [selectedOrganForDisease, setSelectedOrganForDisease] = useState(null);


    const [filteredOrgans, setFilteredOrgans] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrgan, setEditingOrgan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null); // store the selected file

    useEffect(() => {
        setLoading(true);
        dispatch(get_organs_service_auth()).finally(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (get_organs_data?.organs) {
            setFilteredOrgans(get_organs_data.organs);
        }
    }, [get_organs_data]);

    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_organs_data?.organs.filter((organ) =>
            organ.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOrgans(filtered);
    };

    const fetchAssignmentCounts = async () => {
        try {
            const response = await apiHandle.get('/organ-assignment-counts');
            setAssignmentCounts(response.data?.counts || {});
        } catch (error) {
            console.error("Error fetching assignment counts:", error);
        }
    };

    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('name', values.name);
            if (values.short_description) formData.append('short_description', values.short_description);
            if (values.description) formData.append('description', values.description);

            // Handle image file
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (editingOrgan && editingOrgan.image) {
                // If editing and no new file selected, we don't send 'image' field at all
                // This will keep the existing image on the server side
                // We can also send a flag like 'keep_image' but the controller will ignore missing image field
            }

            if (editingOrgan) {
                // Laravel expects POST for edit route (we use POST)
                await apiHandle.post(`/edit-organs/${editingOrgan.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                notification.success({ message: "Organ/Tissue updated successfully!" });
            } else {
                await apiHandle.post('/add-organs', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                notification.success({ message: "Organ/Tissue added successfully!" });
            }

            dispatch(get_organs_service_auth());
            setIsModalVisible(false);
            setEditingOrgan(null);
            setImageFile(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing organ/tissue:", error);
            notification.error({ message: "Failed to add or update organ/tissue." });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEdit = (organ = null) => {
        setEditingOrgan(organ);
        setImageFile(null);
        setIsModalVisible(true);
        if (organ) {
            form.setFieldsValue({
                name: organ.name,
                short_description: organ.short_description || '',
                description: organ.description || '',
            });
        } else {
            form.resetFields();
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-organs/${id}`);
            notification.success({ message: "Organ/Tissue deleted successfully!" });
            dispatch(get_organs_service_auth());
        } catch (error) {
            console.error("Error while deleting organ/tissue:", error);
            notification.error({ message: "Failed to delete organ/tissue." });
        } finally {
            setLoading(false);
        }
    };

    const handleManageArticles = (organ) => {
        setSelectedOrgan(organ);
        setIsAssignModalVisible(true);
    };

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
                        style={{ backgroundColor: "#004c78", color: "white" }}
                        icon={<EditOutlined />}
                        onClick={() => handleAddEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        style={{ backgroundColor: "#1890ff", color: "white", borderColor: "#1890ff" }}
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
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            setSelectedOrganForDisease(record);
                            setIsDiseaseOrganModalVisible(true);
                        }}
                    >
                        Manage Diseases
                    </Button>
                    <Button
                        style={{ backgroundColor: "#fff1f0", color: "#cf1322", borderColor: "#ffa39e" }}
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
                    style={{ marginTop: "10px", backgroundColor: "#004c78", color: "white" }}
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
                open={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingOrgan(null);
                    setImageFile(null);
                    form.resetFields();
                }}
                okText={editingOrgan ? "Update" : "Add"}
                okButtonProps={{ style: { backgroundColor: "#004c78", borderColor: "#004c78" } }}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Organ/Tissue Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter organ/tissue name" }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Image Upload Field */}
                    <Form.Item label="Organ Image" name="image">
                        <Upload
                            beforeUpload={(file) => {
                                setImageFile(file);
                                return false; // prevent auto upload
                            }}
                            onRemove={() => setImageFile(null)}
                            listType="picture"
                            maxCount={1}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                        {editingOrgan?.image && !imageFile && (
                            <div style={{ marginTop: 8 }}>
                                <span style={{ color: "#888" }}>Current image: </span>
                                <a href={editingOrgan.image} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item label="Short Description" name="short_description">
                        <TextArea rows={3} placeholder="Brief summary of the organ/tissue" />
                    </Form.Item>

                    <Form.Item label="Description (HTML allowed)" name="description">
                        <TextArea rows={6} placeholder="Detailed description – you can use HTML tags" />
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
            <OrganDiseaseAssignmentModal
                visible={isDiseaseOrganModalVisible}
                onCancel={() => {
                    setIsDiseaseOrganModalVisible(false);
                    setSelectedOrganForDisease(null);
                }}
                sourceItem={selectedOrganForDisease}
                sourceType="organ"
                allItems={allDiseases}
                onAssignmentChange={() => dispatch(get_organs_service_auth())} // refresh organ data
            />
        </div>
    );
};

export default OrgansTable;
