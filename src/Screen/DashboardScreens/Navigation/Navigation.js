import React, { useEffect, useMemo, useState } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Card,
    Modal,
    Form,
    Select,
    Typography,
    Tag,
    message,
    Row,
    Col,
    Switch,
    Spin,
    Popconfirm,
} from "antd";
import {
    EditOutlined,
    SearchOutlined,
    LinkOutlined,
    MenuOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BackButton from "../../../Component/BackBtn/BackButton";
import { colorTheme } from "../../../Utils/colortheme";

const { Title, Text } = Typography;
const { Option } = Select;

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TYPE_LABELS = {
    nav_item: {
        label: "Nav Item",
        color: "blue",
    },
    featured: {
        label: "Featured",
        color: "purple",
    },
    section: {
        label: "Section",
        color: "orange",
    },
    section_item: {
        label: "Section Item",
        color: "green",
    },
};

const HeaderManager = () => {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [selectedType, setSelectedType] = useState("nav_item");

    const [form] = Form.useForm();

    const loadItems = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${BASE_URL}/navigation`);

            const flat = [];

            (res.data.data || []).forEach((navItem) => {
                flat.push({
                    ...navItem,
                    type: "nav_item",
                    parent_name: null,
                });

                if (navItem.featured) {
                    flat.push({
                        ...navItem.featured,
                        type: "featured",
                        parent_name: navItem.name,
                    });
                }

                (navItem.sections || []).forEach((section) => {
                    flat.push({
                        ...section,
                        type: "section",
                        parent_name: navItem.name,
                    });

                    (section.section_items || []).forEach((item) => {
                        flat.push({
                            ...item,
                            type: "section_item",
                            parent_name: section.name,
                        });
                    });
                });
            });

            setAllItems(flat);
        } catch (error) {
            message.error("Failed to load navigation items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const navItems = useMemo(() => {
        return allItems.filter((item) => item.type === "nav_item");
    }, [allItems]);

    const sections = useMemo(() => {
        return allItems.filter((item) => item.type === "section");
    }, [allItems]);

    const getParentOptions = () => {
        if (selectedType === "featured" || selectedType === "section") {
            return navItems;
        }

        if (selectedType === "section_item") {
            return sections;
        }

        return [];
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setSelectedType("nav_item");

        form.resetFields();
        form.setFieldsValue({
            type: "nav_item",
            parent_id: null,
            name: "",
            path: "",
            description: "",
            image: "",
            has_mega_menu: false,
            is_active: true,
            sort_order: 0,
        });

        setModalVisible(true);
    };

    const openEditModal = (record) => {
        setEditingItem(record);
        setSelectedType(record.type);

        form.setFieldsValue({
            parent_id: record.parent_id || null,
            type: record.type,
            name: record.name,
            path: record.path,
            description: record.description,
            image: record.image,
            has_mega_menu: Boolean(record.has_mega_menu),
            is_active: Boolean(record.is_active),
            sort_order: record.sort_order,
        });

        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingItem(null);
        setSelectedType("nav_item");
        form.resetFields();
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);

        form.setFieldsValue({
            parent_id: null,
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                ...values,
                parent_id: values.type === "nav_item" ? null : values.parent_id,
                has_mega_menu: Boolean(values.has_mega_menu),
                is_active: Boolean(values.is_active),
                sort_order: Number(values.sort_order || 0),
            };

            setModalLoading(true);

            if (editingItem) {
                await axios.put(`${BASE_URL}/navigation/${editingItem.id}`, payload);
                message.success("Item updated successfully.");
            } else {
                await axios.post(`${BASE_URL}/navigation`, payload);
                message.success("Item created successfully.");
            }

            closeModal();
            loadItems();
        } catch (err) {
            if (err?.response?.data?.errors) {
                message.error(Object.values(err.response.data.errors).flat().join(", "));
            } else if (err?.errorFields) {
                return;
            } else {
                message.error("Something went wrong.");
            }
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (record) => {
        setDeleteLoadingId(record.id);

        try {
            await axios.delete(`${BASE_URL}/navigation/${record.id}`);
            message.success("Item deleted successfully.");
            loadItems();
        } catch (error) {
            message.error("Failed to delete item.");
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const filtered = allItems.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.parent_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    const columns = [
        {
            title: "#",
            key: "index",
            width: 55,
            render: (_, __, i) => indexOfFirst + i + 1,
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 130,
            render: (type) => {
                const cfg = TYPE_LABELS[type] || {};
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <Space>
                    {record.type === "nav_item" && (
                        <MenuOutlined style={{ color: colorTheme.primary }} />
                    )}

                    {record.type === "featured" && (
                        <AppstoreOutlined style={{ color: "#722ed1" }} />
                    )}

                    {record.type === "section" && (
                        <UnorderedListOutlined style={{ color: "#fa8c16" }} />
                    )}

                    {record.type === "section_item" && (
                        <LinkOutlined style={{ color: "#52c41a" }} />
                    )}

                    <span>{text || "-"}</span>
                </Space>
            ),
        },
        {
            title: "Path",
            dataIndex: "path",
            render: (text) => (
                <Text style={{ fontSize: 12 }} type="secondary">
                    {text || "-"}
                </Text>
            ),
        },
        {
            title: "Parent",
            dataIndex: "parent_name",
            width: 150,
            render: (text) => text || "-",
        },
        {
            title: "Order",
            dataIndex: "sort_order",
            width: 80,
            align: "center",
        },
        {
            title: "Active",
            dataIndex: "is_active",
            width: 90,
            align: "center",
            render: (val) =>
                val ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 130,
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEditModal(record)}
                        style={{ backgroundColor: colorTheme.primary }}
                    />

                    <Popconfirm
                        title="Delete this item?"
                        description={
                            record.type === "nav_item"
                                ? "Deleting a nav item will also delete its child items."
                                : "This item will be deleted."
                        }
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            loading={deleteLoadingId === record.id}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <Row className="mb-6 gap-x-3" align="middle">
                <Col>
                    <BackButton path={"/DataManager"} />
                </Col>

                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        Header Navigation Manager
                    </Title>
                </Col>
            </Row>

            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center">
                        <Text>Show</Text>

                        <Select
                            value={entriesPerPage}
                            onChange={(val) => {
                                setEntriesPerPage(val);
                                setCurrentPage(1);
                            }}
                            style={{ width: 80, margin: "0 8px" }}
                        >
                            <Option value={10}>10</Option>
                            <Option value={20}>20</Option>
                            <Option value={50}>50</Option>
                        </Select>

                        <Text>entries per page</Text>
                    </div>

                    <Space>
                        <Input
                            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                            placeholder="Search by name, path, type..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ width: 280 }}
                            allowClear
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateModal}
                            style={{ backgroundColor: colorTheme.primary }}
                        >
                            Add Item
                        </Button>
                    </Space>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <Table
                            columns={columns}
                            dataSource={currentItems}
                            rowKey="id"
                            pagination={false}
                            className="mb-4"
                        />

                        <div className="flex justify-between items-center mt-4">
                            <span>
                                Showing {filtered.length > 0 ? indexOfFirst + 1 : 0} to{" "}
                                {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
                            </span>

                            <div className="flex gap-2">
                                {Array.from(
                                    { length: Math.ceil(filtered.length / entriesPerPage) },
                                    (_, i) => (
                                        <Button
                                            key={i}
                                            size="small"
                                            onClick={() => setCurrentPage(i + 1)}
                                            type={currentPage === i + 1 ? "primary" : "default"}
                                            style={{
                                                backgroundColor:
                                                    currentPage === i + 1
                                                        ? colorTheme.primary
                                                        : "white",
                                            }}
                                        >
                                            {i + 1}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Card>

            <Modal
                title={
                    <div className="text-xl font-bold">
                        {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
                    </div>
                }
                open={modalVisible}
                onCancel={closeModal}
                destroyOnClose
                footer={[
                    <Button key="cancel" onClick={closeModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={modalLoading}
                        onClick={handleSubmit}
                        style={{ backgroundColor: colorTheme.primary }}
                    >
                        {editingItem ? "Save" : "Create"}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: "Type is required." }]}
                    >
                        <Select onChange={handleTypeChange} disabled={!!editingItem}>
                            <Option value="nav_item">Nav Item</Option>
                            <Option value="featured">Featured / Promotion</Option>
                            <Option value="section">Section</Option>
                            <Option value="section_item">Section Item</Option>
                        </Select>
                    </Form.Item>

                    {selectedType !== "nav_item" && (
                        <Form.Item
                            name="parent_id"
                            label={
                                selectedType === "section_item"
                                    ? "Parent Section"
                                    : "Parent Nav Item"
                            }
                            rules={[
                                {
                                    required: true,
                                    message:
                                        selectedType === "section_item"
                                            ? "Parent section is required."
                                            : "Parent nav item is required.",
                                },
                            ]}
                        >
                            <Select
                                placeholder={
                                    selectedType === "section_item"
                                        ? "Select section"
                                        : "Select nav item"
                                }
                                showSearch
                                optionFilterProp="children"
                            >
                                {getParentOptions().map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="name"
                        label={
                            selectedType === "featured"
                                ? "Title"
                                : "Name"
                        }
                        rules={[{ required: true, message: "Name is required." }]}
                    >
                        <Input placeholder="Name / Title" />
                    </Form.Item>

                    {(selectedType === "nav_item" || selectedType === "section_item") && (
                        <Form.Item name="path" label="Path">
                            <Input prefix={<LinkOutlined />} placeholder="/path or https://..." />
                        </Form.Item>
                    )}

                    {(selectedType === "featured" || selectedType === "section_item") && (
                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={2} placeholder="Description" />
                        </Form.Item>
                    )}

                    {selectedType === "featured" && (
                        <Form.Item name="image" label="Image URL">
                            <Input placeholder="https://..." />
                        </Form.Item>
                    )}

                    {selectedType === "nav_item" && (
                        <Form.Item
                            name="has_mega_menu"
                            label="Has Mega Menu"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="sort_order" label="Sort Order">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="is_active"
                                label="Active"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default HeaderManager;
