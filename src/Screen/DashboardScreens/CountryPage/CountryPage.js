

import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, Select, notification, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { add_country_service_auth, get_countries_service_auth } from "../../../Services/SpecieService";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import BackButton from "../../../Component/BackBtn/BackButton";
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";

const { Option } = Select;

const CountryTable = () => {
    const dispatch = useDispatch();
    const { get_country_data } = useSelector((state) => state.species);

    console.log("Country Data from Redux:", get_country_data);

    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentCounts, setAssignmentCounts] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        dispatch(get_countries_service_auth()).finally(() => {
            setLoading(false);
        });
        //
    }, [dispatch]);

    useEffect(() => {
        if (get_country_data?.countries) {
            setFilteredCountries(get_country_data.countries);
        }
    }, [get_country_data]);

    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = get_country_data.countries.filter((country) =>
            country.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCountries(filtered);
    };

    // Fetch assignment counts for all countries
    const fetchAssignmentCounts = async () => {
        try {
            const response = await apiHandle.get('/country-assignment-counts');
            setAssignmentCounts(response.data?.counts || {});
        } catch (error) {
            console.error("Error fetching assignment counts:", error);
        }
    };

    // Add or Edit country
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (editingCountry) {
                await apiHandle.post(`/edit-country/${editingCountry.id}`, {
                    name: values.name,
                    status: values.status,
                    parent_id: values.parent_id || null
                });

                // Update UI immediately (Optimistic Update)
                setFilteredCountries((prev) =>
                    prev.map((country) =>
                        country.id === editingCountry.id
                            ? { ...country, name: values.name, status: values.status, parent_id: values.parent_id || null }
                            : country
                    )
                );
                dispatch(get_countries_service_auth());
                notification.success({ message: "Country updated successfully!" });
            } else {
                const obj = { 
                    name: values.name, 
                    status: values.status || "Pending",
                    parent_id: values.parent_id || null
                };
                const response = await dispatch(add_country_service_auth(obj));

                // Add new country in state instantly
                setFilteredCountries((prev) => [...prev, response.payload]);

                dispatch(get_countries_service_auth());
                notification.success({ message: "Country added successfully!" });
            }

            setIsModalVisible(false);
            setEditingCountry(null);
            form.resetFields();
            //
        } catch (error) {
            console.error("Error while adding/editing country:", error);
            notification.error({ message: "Failed to add or update country." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for adding or editing
    const handleAddEdit = (country = null) => {
        setEditingCountry(country);
        setIsModalVisible(true);
        if (country) {
            form.setFieldsValue({ 
                name: country.name, 
                status: country.status,
                parent_id: country.parent_id || undefined
            });
        } else {
            form.resetFields();
        }
    };

    // Delete country
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await apiHandle.post(`/delete-country/${id}`);
            notification.success({ message: "Country deleted successfully!" });
            dispatch(get_countries_service_auth());
            //
        } catch (error) {
            console.error("Error while deleting country:", error);
            notification.error({ message: error?.response?.data?.message || "Failed to delete country." });
        } finally {
            setLoading(false);
        }
    };

    // Handle article assignment modal
    const handleManageArticles = (country) => {
        setSelectedCountry(country);
        setIsAssignModalVisible(true);
    };

    // Approve or Reject country
    const handleStatusChange = async (record, newStatus) => {
        try {
            setLoading(true);
            await apiHandle.post(`/edit-country/${record?.id}`, { 
                name: record?.name, 
                status: newStatus,
                parent_id: record?.parent_id || null
            });
            notification.success({ message: `Country ${newStatus.toLowerCase()} successfully!` });
            dispatch(get_countries_service_auth());
            //
        } catch (error) {
            console.error("Error while updating country status:", error);
            notification.error({ message: "Failed to update country status." });
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: "Country Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Parent Country",
            dataIndex: "parent_id",
            key: "parent_id",
            render: (parent_id) => {
                if (!parent_id) return "None";
                const parentCountry = get_country_data?.countries?.find(country => country.id === parent_id);
                return parentCountry ? parentCountry.name : "Unknown";
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    style={{
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color: "#fff",
                        backgroundColor:
                            status === "Approved"
                                ? "#52c41a"
                                : status === "Rejected"
                                    ? "#cf1322"
                                    : "#faad14",
                    }}
                >
                    {status}
                </span>
            ),
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
                                    backgroundColor: "#1890ff",
                                    color: "white",
                                    borderColor: "#1890ff",
                                }}
                                icon={<FileTextOutlined />}
                                onClick={() => handleManageArticles(record)}
                            >
                                Articles
                                <Badge 
                                    count={record.publication_count || 0} 
                                    style={{ backgroundColor: '#ff4d4f', marginLeft: 4 }}
                                />
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#fff1f0",
                                    color: "#cf1322",
                                    borderColor: "#ffa39e"
                                }}
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                    {record.status === "Pending" && (
                        <>
                            <Button
                                style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    borderColor: "#28a745",
                                }}
                                onClick={() => handleStatusChange(record, "Approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    borderColor: "#dc3545",
                                }}
                                onClick={() => handleStatusChange(record, "Rejected")}
                            >
                                Reject
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
                <BackButton path={"/DataManager"} />
                <h1 className="text-2xl font-bold">Country Management</h1>
            </div>
            <div className="flex justify-between items-center mb-3">
                <Input.Search
                    placeholder="Search countries"
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
                    Add Country
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredCountries}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                loading={loading}
            />

            {/* Modal for Adding/Editing */}
            <Modal
                title={editingCountry ? "Edit Country" : "Add Country"}
                visible={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingCountry(null);
                    form.resetFields();
                }}
                okText={editingCountry ? "Update" : "Add"}
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Country Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter country name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Parent Country"
                        name="parent_id"
                    >
                        <Select
                            placeholder="Select parent country (optional)"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {get_country_data?.countries
                                ?.filter(country => 
                                    country.status === "Approved" && 
                                    (!editingCountry || country.id !== editingCountry.id)
                                )
                                ?.map(country => (
                                    <Option key={country.id} value={country.id}>
                                        {country.name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select status" }]}
                    >
                        <Select>
                            <Option value="Pending">Pending</Option>
                            <Option value="Approved">Approved</Option>
                            <Option value="Rejected">Rejected</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Article Assignment Modal */}
            <ArticleAssignmentModal
                visible={isAssignModalVisible}
                onCancel={() => {
                    setIsAssignModalVisible(false);
                    setSelectedCountry(null);
                }}
                selectedItem={selectedCountry}
                assignmentType="countries"
                onAssignmentChange={
                    () => {
                        dispatch(get_countries_service_auth());
                    }
                }
            />
        </div>
    );
};

export default CountryTable;