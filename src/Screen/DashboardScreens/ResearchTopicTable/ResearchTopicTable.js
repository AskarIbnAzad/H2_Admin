import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { add_research_topic_service_auth, get_research_topic_service_auth } from "../../../Services/SpecieService";

const ResearchTopicTable = () => {
    const dispatch = useDispatch();
    const { get_research_type_data } = useSelector((state) => state.ResearchType);

    const [filteredResearchTopics, setFilteredResearchTopics] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [editingResearchTopic, setEditingResearchTopic] = useState(null);
    const [selectedResearchTopic, setSelectedResearchTopic] = useState(null);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(get_research_topic_service_auth());
        // //
    }, [dispatch]);

    useEffect(() => {
        if (get_research_type_data?.researchTopics) {
            setFilteredResearchTopics(get_research_type_data.researchTopics);
        }
    }, [get_research_type_data]);

    // Fetch assignment counts for all research topics
 

    // Search functionality for research topics
    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_research_type_data?.researchTopics.filter((topic) =>
            topic.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredResearchTopics(filtered);
    };

    // Handle article assignment modal
    const handleManageArticles = (researchTopic) => {
        setSelectedResearchTopic(researchTopic);
        setIsAssignModalVisible(true);
    };

    // Add or Edit research topic
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingResearchTopic) {
                await apiHandle.post(`/edit-research-topic/${editingResearchTopic.id}`, {
                    name: values.name,
                });
                notification.success({ message: "Research Topic updated successfully!" });
            } else {
                const obj = { name: values.name };
                await dispatch(add_research_topic_service_auth(obj)).unwrap();
            }
            dispatch(get_research_topic_service_auth());
            // //
            setIsModalVisible(false);
            setEditingResearchTopic(null);
            form.resetFields();
        } catch (error) {
            console.error("Error while adding/editing research topic:", error);
            notification.error({ message: "Failed to add or update research topic." });
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (researchTopic = null) => {
        setEditingResearchTopic(researchTopic);
        setIsModalVisible(true);
        if (researchTopic) {
            form.setFieldsValue({ name: researchTopic.name });
        } else {
            form.resetFields();
        }
    };

    // Delete research topic
    const handleDelete = async (id) => {
        try {
            await apiHandle.post(`/delete-research-topic/${id}`);
            notification.success({ message: "Research Topic deleted successfully!" });
            dispatch(get_research_topic_service_auth());
            // //
        } catch (error) {
            console.error("Error while deleting research topic:", error);
            notification.error({ message: "Failed to delete research topic." });
        }
    };

    // Table columns
    const columns = [
        {
            title: "Research Topic",
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
                        loading={selectedResearchTopic?.id === record.id}
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
                <BackButton path={"/DataManager"} />
                <h1 className="text-2xl font-bold">Research Topic Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search research topics"
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
                    Add Research Topic
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredResearchTopics}
                rowKey="id"
                pagination={{ pageSize: 15 }}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingResearchTopic ? "Edit Research Topic" : "Add Research Topic"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingResearchTopic(null);
                    form.resetFields();
                }}
                okText={editingResearchTopic ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Research Topic Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter research topic name" }]}
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
                    setSelectedResearchTopic(null);
                }}
                selectedItem={selectedResearchTopic}
                assignmentType="research-topic"
                onSuccess={() => {
                   dispatch(get_research_topic_service_auth());
                }}
            />
        </div>
    );
};

export default ResearchTopicTable;