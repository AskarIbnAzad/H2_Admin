import React, { useState, useEffect } from "react";
import { 
    Table, 
    Input, 
    Button, 
    Modal, 
    Form, 
    Select, 
    notification, 
    Tag, 
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Space,
    Avatar,
    Tooltip,
    Empty,
    Spin
} from "antd";
import { 
    EditOutlined, 
    DeleteOutlined, 
    EyeOutlined,
    UserOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    CalendarOutlined,
    MailOutlined
} from "@ant-design/icons";
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Claims = () => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [editingClaim, setEditingClaim] = useState(null);
    const [viewingClaim, setViewingClaim] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalClaims, setTotalClaims] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        'under review': 0
    });
    const [form] = Form.useForm();

    // Status configuration similar to feedback screen
    const statusConfig = {
        pending: {
            display: 'Pending',
            color: '#faad14',
            icon: <ExclamationCircleOutlined />
        },
        approved: {
            display: 'Approved',
            color: '#52c41a',
            icon: <CheckCircleOutlined />
        },
        rejected: {
            display: 'Rejected',
            color: '#cf1322',
            icon: <CloseCircleOutlined />
        },
        'under review': {
            display: 'Under Review',
            color: '#1890ff',
            icon: <ClockCircleOutlined />
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    // Remove automatic filtering since we're using server-side pagination
    // useEffect(() => {
    //     filterClaims();
    // }, [claims]);

    const fetchClaims = async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            const response = await apiHandle.get(`/claims?page=${page}&per_page=${size}`);
            const claimsData = response.data?.data || [];
            setClaims(claimsData);
            setFilteredClaims(claimsData);
            setTotalClaims(response.data?.total || claimsData.length);
            
            // Use status counts from API response
            const apiStatusCounts = response.data?.status_counts || {};
            const counts = {
                pending: apiStatusCounts.Pending || 0,
                approved: apiStatusCounts.Approved || 0,
                rejected: apiStatusCounts.Rejected || 0,
                'under review': 0
            };
            
            setStatusCounts(counts);
        } catch (error) {
            console.error("Error fetching claims:", error);
            notification.error({ message: "Failed to fetch ownership claims" });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        filterClaims(value, statusFilter);
    };

    const filterClaims = (searchText = searchValue, status = statusFilter) => {
        let filtered = claims;

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter((claim) =>
                claim.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                claim.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                claim.affiliation?.toLowerCase().includes(searchText.toLowerCase()) ||
                claim.status?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by status
        if (status) {
            filtered = filtered.filter((claim) => 
                claim.status?.toLowerCase() === status.toLowerCase()
            );
        }

        setFilteredClaims(filtered);
    };

    // Update status filter
    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        filterClaims(searchValue, value);
    };

    // Handle pagination changes
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        fetchClaims(page, size);
    };

    const handlePageSizeChange = (current, size) => {
        setCurrentPage(1);
        setPageSize(size);
        fetchClaims(1, size);
    };

    const navigate = useNavigate();
    // Edit claim (status and response only)
    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            await apiHandle.put(`/claims/${editingClaim.id}`, {
                status: values.status,
                admin_response: values.admin_response
            });
            notification.success({ message: "Ownership claim updated successfully!" });

            setIsModalVisible(false);
            setEditingClaim(null);
            form.resetFields();
            fetchClaims(currentPage, pageSize);
        } catch (error) {
            console.error("Error while updating claim:", error);
            notification.error({ message: "Failed to update ownership claim." });
        } finally {
            setLoading(false);
        }
    };

    // Show modal for editing
    const handleEdit = (claim) => {
        setEditingClaim(claim);
        setIsModalVisible(true);
        form.setFieldsValue({
            status: claim.status,
            admin_response: claim.admin_response || ''
        });
    };

    // View claim details
    const handleView = (claim) => {
        setViewingClaim(claim);
        setIsViewModalVisible(true);
    };

    // Delete claim
    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this ownership claim?",
            onOk: async () => {
                try {
                    setLoading(true);
                    await apiHandle.delete(`/claims/${id}`);
                    notification.success({ message: "Ownership claim deleted successfully!" });
                    fetchClaims(currentPage, pageSize);
                } catch (error) {
                    console.error("Error while deleting claim:", error);
                    notification.error({ message: "Failed to delete ownership claim." });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // Update status
    const handleStatusChange = async (record, newStatus) => {
        try {
            setLoading(true);
            await apiHandle.put(`/claims/status/${record.id}`, {
                status: newStatus
            });
            notification.success({ message: `Ownership claim ${newStatus.toLowerCase()} successfully!` });
            fetchClaims(currentPage, pageSize);
        } catch (error) {
            console.error("Error while updating claim status:", error);
            notification.error({ message: "Failed to update ownership claim status." });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusKey = status?.toLowerCase();
        return statusConfig[statusKey]?.color || 'default';
    };

    // Table columns
    const columns = [
        {
            title: 'Claimant Details',
            key: 'claimant',
            width: 280,
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        style={{
                            backgroundColor: '#004c78',
                            borderColor: '#004c78',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0
                        }}
                        size="large"
                        icon={<UserOutlined />}
                    >
                        {record?.full_name?.charAt(0)}
                    </Avatar>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <Text strong style={{ color: '#1f2937', fontSize: '14px', display: 'block' }}>
                            {record.full_name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                            {record.email}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                            {record.position_title}
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Institution',
            key: 'institution',
            width: 220,
            render: (_, record) => (
                <div style={{ minWidth: 0 }}>
                    <Text strong style={{ color: '#1f2937', fontSize: '14px', display: 'block', wordBreak: 'break-word' }}>
                        {record.affiliation}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        {record.position_title}
                    </Text>
                </div>
            )
        },
        {
            title: 'Article Reference',
            key: 'article',
            width: 320,
            render: (_, record) => (
                <div style={{ minWidth: 0 }}>
                    <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '13px', color: '#1f2937', display: 'block', wordBreak: 'break-word', lineHeight: '1.4' }}>
                            {record.article?.title || 'No Title Available'}
                        </Text>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <Tag color="blue" icon={<FileTextOutlined />} style={{ fontSize: '11px' }}>
                          <a
                                onClick={() => {
                                    navigate(`/article-preview/${record.article.mhid}`);
                                }}
                                style={{ textDecoration: 'none' }}
                            >
                            {record.article?.mhid || 'No MHID'}
                            </a>
                        </Tag>
                        {record.orcid_id && (
                             <a 
                                href={`https://orcid.org/${record.orcid_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                            >
                            <Tag color="cyan" style={{ fontSize: '11px' }}>
                                ORCID: {record.orcid_id}
                            </Tag>
                            </a>
                        )}
                        {record.article?.mhid && (
                           <div onClick={
                            () => {
                                navigate(`/article-preview/${record.article.mhid}`);
                            }
                            } className="cursor-pointer">
                                
                                <Tag color="green" icon={<EyeOutlined />} style={{ cursor: 'pointer', fontSize: '11px' }}>
                                    View
                                </Tag>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status) => {
                const statusKey = status?.toLowerCase();
                const config = statusConfig[statusKey];
                return (
                    <Tag 
                        color={config?.color} 
                        icon={config?.icon}
                        style={{ fontWeight: 'bold' }}
                    >
                        {config?.display || status}
                    </Tag>
                );
            },
        },
        {
            title: "Created Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 140,
            render: (date) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {moment(date).format('DD-MM-YYYY')}
                    </Text>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 220,
            render: (_, record) => (
                <Space size="small" wrap>
                    <Tooltip title="View Details">
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        >
                            View
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Claim">
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        >
                            Delete
                        </Button>
                    </Tooltip>
                    <Tooltip title={`Send Email to ${record.full_name}`}>
                        <Button
                            size="small"
                            icon={<MailOutlined />}
                            href={`mailto:${record.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    </Tooltip>
                    {record.status === "pending" && (
                        <>
                            <Button
                                size="small"
                                type="primary"
                                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                                onClick={() => handleStatusChange(record, "approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleStatusChange(record, "rejected")}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '16px', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
                    Ownership Claim Requests
                </h1>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Manage and review ownership claims for research articles
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={12} md={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Claims"
                            value={claims.length}
                            valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Pending"
                            value={statusCounts.pending}
                            valueStyle={{ color: '#faad14', fontSize: '20px' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Approved"
                            value={statusCounts.approved}
                            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Rejected"
                            value={statusCounts.rejected}
                            valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                            prefix={<CloseCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters Section */}
            <Card style={{ marginBottom: '16px', borderRadius: '8px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Input
                            placeholder="Search by name, email, affiliation..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                            style={{ borderRadius: '6px' }}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Select
                            placeholder="Filter by status"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            style={{ width: "100%", borderRadius: '6px' }}
                            allowClear
                        >
                            <Option value="">All Status</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="under review">Under Review</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Claims Table */}
            <Card style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        columns={columns}
                        dataSource={claims}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalClaims,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} claims`,
                            pageSizeOptions: ['5', '10', '15', '20', '50'],
                            onChange: handlePaginationChange,
                            onShowSizeChange: handlePageSizeChange,
                            responsive: true,
                        }}
                        scroll={{ x: 1300 }}
                        style={{ borderRadius: '8px' }}
                        size="small"
                    />
                </div>
            </Card>

            {/* Edit Modal */}
            <Modal
                title={
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <EditOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Edit Ownership Claim
                    </div>
                }
                open={isModalVisible}
                onOk={handleModalOk}
                confirmLoading={loading}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingClaim(null);
                    form.resetFields();
                }}
                okText="Update"
                cancelText="Cancel"
                okButtonProps={{
                    style: { backgroundColor: "#004c78", borderColor: "#004c78" },
                }}
                width={600}
                style={{ borderRadius: '8px' }}
            >
                <div style={{ padding: '16px 0' }}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label={<Text strong>Status</Text>}
                            name="status"
                            rules={[{ required: true, message: "Please select status" }]}
                            style={{ marginBottom: '24px' }}
                        >
                            <Select style={{ borderRadius: '6px' }} size="large">
                                <Option value="pending">
                                    <ClockCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                    Pending
                                </Option>
                                <Option value="under review">
                                    <EyeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                    Under Review
                                </Option>
                                <Option value="approved">
                                    <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                    Approved
                                </Option>
                                <Option value="rejected">
                                    <CloseCircleOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
                                    Rejected
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<Text strong>Admin Response</Text>}
                            name="admin_response"
                            style={{ marginBottom: '16px' }}
                        >
                            <TextArea 
                                rows={4} 
                                placeholder="Admin response (optional)" 
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal
                title={
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Ownership Claim Details
                    </div>
                }
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={900}
                style={{ borderRadius: '8px' }}
            >
                {viewingClaim && (
                    <div style={{ padding: '16px 0' }}>
                        <Row gutter={[24, 16]}>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Full Name:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>{viewingClaim.full_name}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Email:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>{viewingClaim.email}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Affiliation:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>{viewingClaim.affiliation}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Position Title:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>{viewingClaim.position_title}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>ORCID ID:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>{viewingClaim.orcid_id || 'N/A'}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Article MHID:</Text>
                                    <br />
                                    {viewingClaim.article?.mhid ? (
                                        <a 
                                            onClick={() => {
                                                navigate(`/article-preview/${viewingClaim.article.mhid}`);
                                            }
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#1890ff', textDecoration: 'none', fontSize: '16px' }}
                                        >
                                            <FileTextOutlined style={{ marginRight: '8px' }} />
                                            {viewingClaim.article.mhid}
                                        </a>
                                    ) : (
                                        <Text style={{ fontSize: '16px' }}>N/A</Text>
                                    )}
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Article Title:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>
                                        {viewingClaim.article?.title || 'N/A'}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Status:</Text>
                                    <br />
                                    <Tag 
                                        color={statusConfig[viewingClaim.status?.toLowerCase()]?.color}
                                        icon={statusConfig[viewingClaim.status?.toLowerCase()]?.icon}
                                        style={{ marginTop: '4px', fontWeight: 'bold' }}
                                    >
                                        {statusConfig[viewingClaim.status?.toLowerCase()]?.display || viewingClaim.status}
                                    </Tag>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Created Date:</Text>
                                    <br />
                                    <Text style={{ fontSize: '16px' }}>
                                        {moment(viewingClaim.created_at).format('DD-MM-YYYY HH:mm')}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Explanation:</Text>
                                    <div style={{ 
                                        marginTop: 8, 
                                        padding: 16, 
                                        background: '#f8f9fa', 
                                        borderRadius: 8,
                                        border: '1px solid #e9ecef',
                                        whiteSpace: 'pre-wrap' 
                                    }}>
                                        <Text>{viewingClaim.explanation}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ color: '#8c8c8c' }}>Supporting Evidence:</Text>
                                    <div style={{ 
                                        marginTop: 8, 
                                        padding: 16, 
                                        background: '#f8f9fa', 
                                        borderRadius: 8,
                                        border: '1px solid #e9ecef',
                                        whiteSpace: 'pre-wrap' 
                                    }}>
                                        {viewingClaim.supporting_evidence?.startsWith('http') ? (
                                            <a 
                                                href={viewingClaim.supporting_evidence} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#1890ff', textDecoration: 'none' }}
                                            >
                                                <FileTextOutlined style={{ marginRight: '8px' }} />
                                                View Evidence File
                                            </a>
                                        ) : (
                                            <Text>{viewingClaim.supporting_evidence}</Text>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            {viewingClaim.admin_response && (
                                <Col span={24}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong style={{ color: '#8c8c8c' }}>Admin Response:</Text>
                                        <div style={{ 
                                            marginTop: 8, 
                                            padding: 16, 
                                            background: '#e6f7ff', 
                                            borderRadius: 8,
                                            border: '1px solid #91d5ff',
                                            whiteSpace: 'pre-wrap' 
                                        }}>
                                            <Text>{viewingClaim.admin_response}</Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Claims;
