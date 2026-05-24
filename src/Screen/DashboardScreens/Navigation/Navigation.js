import React, { useEffect, useState } from "react";
import {
    Table, Input, Button, Space, Card, Modal, Form,
    Select, Typography, Tag, message, Row, Col, Switch, Spin,
} from "antd";
import {
    EditOutlined, SearchOutlined, LinkOutlined,
    MenuOutlined, AppstoreOutlined, UnorderedListOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BackButton from "../../../Component/BackBtn/BackButton";
import {colorTheme} from "../../../Utils/colortheme";

const { Title, Text } = Typography;
const { Option } = Select;

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TYPE_LABELS = {
    nav_item:     { label: "Nav Item",     color: "blue" },
    featured:     { label: "Featured",     color: "purple" },
    section:      { label: "Section",      color: "orange" },
    section_item: { label: "Section Item", color: "green" },
};

const HeaderManager = () => {
    const [allItems, setAllItems]         = useState([]);
    const [loading, setLoading]           = useState(false);
    const [searchTerm, setSearchTerm]     = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem]   = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentPage, setCurrentPage]   = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [form] = Form.useForm();

    // ── GET ──────────────────────────────────────────────────────────────────

    const loadItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/navigation`);
            const flat = [];
            (res.data.data || []).forEach((navItem) => {
                flat.push({ ...navItem, type: "nav_item" });
                if (navItem.featured) {
                    flat.push({ ...navItem.featured, type: "featured", parent_name: navItem.name });
                }
                (navItem.sections || []).forEach((section) => {
                    flat.push({ ...section, type: "section", parent_name: navItem.name });
                    (section.section_items || []).forEach((item) => {
                        flat.push({ ...item, type: "section_item", parent_name: section.name });
                    });
                });
            });
            setAllItems(flat);
        } catch {
            message.error("Failed to load navigation items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadItems(); }, []);

    // ── PUT ───────────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setModalLoading(true);
            await axios.put(`${BASE_URL}/navigation/${editingItem.id}`, values);
            message.success("Item updated successfully.");
            closeModal();
            loadItems();
        } catch (err) {
            if (err?.response?.data?.errors) {
                message.error(Object.values(err.response.data.errors).flat().join(", "));
            }
        } finally {
            setModalLoading(false);
        }
    };

    // ── Modal ─────────────────────────────────────────────────────────────────

    const openEditModal = (record) => {
        setEditingItem(record);
        form.setFieldsValue({
            name:          record.name,
            path:          record.path,
            description:   record.description,
            image:         record.image,
            has_mega_menu: record.has_mega_menu,
            is_active:     record.is_active,
            sort_order:    record.sort_order,
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    // ── Filter & Paginate ─────────────────────────────────────────────────────

    const filtered = allItems.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast  = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    // ── Columns ───────────────────────────────────────────────────────────────

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
            width: 120,
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
                    {record.type === "nav_item"     && <MenuOutlined style={{ color: colorTheme.primary }} />}
                    {record.type === "featured"     && <AppstoreOutlined style={{ color: "#722ed1" }} />}
                    {record.type === "section"      && <UnorderedListOutlined style={{ color: "#fa8c16" }} />}
                    {record.type === "section_item" && <LinkOutlined style={{ color: "#52c41a" }} />}
                    <span>{text || "-"}</span>
                </Space>
            ),
        },
        {
            title: "Path",
            dataIndex: "path",
            render: (text) => <Text style={{ fontSize: 12 }} type="secondary">{text || "-"}</Text>,
        },
        {
            title: "Parent",
            dataIndex: "parent_name",
            render: (text) => text || "-",
        },
        {
            title: "Order",
            dataIndex: "sort_order",
            width: 70,
            align: "center",
        },
        {
            title: "Active",
            dataIndex: "is_active",
            width: 80,
            align: "center",
            render: (val) => val ? <Tag color="success">Yes</Tag> : <Tag color="error">No</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openEditModal(record)}
                    style={{ backgroundColor: colorTheme.primary }}
                />
            ),
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="container mx-auto p-6">
            <Row className="mb-6 gap-x-3" align="middle">
                <Col><BackButton path={"/DataManager"} /></Col>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Header Navigation Manager</Title>
                </Col>
            </Row>

            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center">
                        <Text>Show</Text>
                        <Select
                            value={entriesPerPage}
                            onChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
                            style={{ width: 80, margin: "0 8px" }}
                        >
                            <Option value={10}>10</Option>
                            <Option value={20}>20</Option>
                            <Option value={50}>50</Option>
                        </Select>
                        <Text>entries per page</Text>
                    </div>
                    <Input
                        prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Search by name, path, type..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ width: 280 }}
                        allowClear
                    />
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
                                                backgroundColor: currentPage === i + 1 ? colorTheme.primary : "white",
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

            {/* Edit Modal */}
            <Modal
                title={<div className="text-xl font-bold">Edit Navigation Item</div>}
                open={modalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal}>Cancel</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={modalLoading}
                        onClick={handleSubmit}
                        style={{ backgroundColor: colorTheme.primary }}
                    >
                        Save
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item name="path" label="Path">
                        <Input prefix={<LinkOutlined />} placeholder="/path or https://..." />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    {editingItem?.type === "featured" && (
                        <Form.Item name="image" label="Image URL">
                            <Input placeholder="https://..." />
                        </Form.Item>
                    )}
                    {editingItem?.type === "nav_item" && (
                        <Form.Item name="has_mega_menu" label="Has Mega Menu" valuePropName="checked">
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
                            <Form.Item name="is_active" label="Active" valuePropName="checked">
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
