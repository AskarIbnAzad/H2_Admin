import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Input,
    Button,
    Space,
    Tag,
    Tooltip,
    Modal,
    Descriptions,
    Typography,
    Row,
    Col,
    Select,
    Badge,
    Divider,
    message,
    Popconfirm,
    Avatar,
    Dropdown,
    Menu,
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    MoreOutlined,
    ReloadOutlined,
    MailOutlined,
    BankOutlined,
    GlobalOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { apiHandle } from "../../../Config/ApiHandle/apiHandle";
import * as XLSX from 'xlsx';
import SendEmailModal from "../../../Component/Modal/SendEmailModal";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const VolunteerContributorAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState({}); // For per-row loading states
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [selectedVolunteerForEmail, setSelectedVolunteerForEmail] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            console.log("Fetching contributors...");
            const response = await apiHandle.get("get-contributor");
            console.log("API Response:", response);
            
            if (response.status === 200) {
                // Map API data to component format
                const mappedData = response.data.contributors.map(contributor => ({
                    id: contributor.id,
                    key: contributor.id,
                    fullName: contributor.name,
                    email: contributor.email,
                    institution: contributor.institution || 'Not provided',
                    role: contributor.role || 'Not specified',
                    country: contributor.country || 'Not provided',
                    experience: Array.isArray(contributor.experience) ? contributor.experience : [],
                    interests: Array.isArray(contributor.interests) ? contributor.interests : [],
                    otherInterests: contributor.otherInterests || '',
                    background: contributor.background || '',
                    availability: contributor.availability || 'Not specified',
                    consent: contributor.consent,
                    status: contributor?.approve_status || 'pending', // Default status since not in API response
                    submittedAt: contributor.created_at,
                    approvedAt: contributor.updated_at !== contributor.created_at ? contributor.updated_at : null,
                }));
                
                setData(mappedData);
                setPagination(prev => ({ ...prev, total: mappedData.length }));
                console.log("Contributors loaded:", mappedData.length);
            } else {
                message.error('Failed to load contributors');
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error('Failed to fetch contributors data');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleStatusChange = async (record, newStatus) => {
        const actionKey = `${record.id}-${newStatus}`;
        setActionLoading(prev => ({ ...prev, [actionKey]: true }));
        
        try {
            console.log(`${newStatus === 'approved' ? 'Approving' : 'Rejecting'} contributor:`, record.id);
            
            const response = await apiHandle.post("approve-reject-contributor", {
                user_id: record.id,
                action: newStatus === 'approved' ? 'approve' : 'reject'
            });
            
            console.log("Status change response:", response);
            
            if (response.data.success || response.status === 200) {
                // Update local state
                const updatedData = data.map(item =>
                    item.id === record.id
                        ? {
                            ...item,
                            status: newStatus,
                            approvedAt: newStatus === 'approved' ? new Date().toISOString() : null
                        }
                        : item
                );
                setData(updatedData);
                message.success(`Contributor ${newStatus} successfully`);
                
                // Close modal if open
                if (viewModalVisible && selectedRecord?.id === record.id) {
                    setViewModalVisible(false);
                }
            } else {
                message.error(`Failed to ${newStatus} contributor`);
            }
        } catch (error) {
            console.error(`${newStatus} error:`, error);
            const errorMessage = error.response?.data?.message || `Failed to ${newStatus} contributor`;
            message.error(errorMessage);
        } finally {
            setActionLoading(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const handleDelete = async (record) => {
        try {
             const response = await apiHandle.post(`delete-user/${record.id}`);
            // Since there's no delete API mentioned, we'll just remove from local state
            const updatedData = data.filter(item => item.id !== record.id);
            setData(updatedData);
            setPagination(prev => ({ ...prev, total: updatedData.length }));
            message.success('Contributor removed from list');
        } catch (error) {
            message.error('Failed to delete contributor');
        }
    };

    const exportVolunteersToExcel = () => {
        const dataToExport = data.map(v => ({
            ID: v.id,
            Name: v.fullName,
            Email: v.email,
            Institution: v.institution,
            Role: v.role,
            Country: v.country,
            Experience: Array.isArray(v.experience) ? v.experience.join(', ') : '',
            Interests: Array.isArray(v.interests) ? v.interests.join(', ') : '',
            OtherInterests: v.otherInterests || '',
            Background: v.background || '',
            Availability: v.availability || '',
            Status: v.status,
            SubmittedAt: v.submittedAt,
            ApprovedAt: v.approvedAt || '',
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Volunteers');
        XLSX.writeFile(wb, 'volunteers.xlsx');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircleOutlined />;
            case 'rejected': return <ExclamationCircleOutlined />;
            case 'pending': return <ClockCircleOutlined />;
            default: return null;
        }
    };

    const filteredData = data.filter(item => {
        const matchesSearch = searchText === '' ||
            item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.email.toLowerCase().includes(searchText.toLowerCase()) ||
            item.institution.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesRole = roleFilter === 'all' || item.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const getActionMenu = (record) => (
        <Menu>
            <Menu.Item key="approve" disabled={record.status === 'approved'}>
                <Button
                    type="text"
                    icon={<CheckCircleOutlined />}
                    loading={actionLoading[`${record.id}-approved`]}
                    onClick={() => handleStatusChange(record, 'approved')}
                >
                    Approve
                </Button>
            </Menu.Item>
            <Menu.Item key="reject" disabled={record.status === 'rejected'}>
                <Button
                    type="text"
                    icon={<ExclamationCircleOutlined />}
                    loading={actionLoading[`${record.id}-rejected`]}
                    onClick={() => handleStatusChange(record, 'rejected')}
                >
                    Reject
                </Button>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this contributor?"
                    onConfirm={() => handleDelete(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                        Remove
                    </Button>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 220,
            render: (text, record) => (
                <div className="flex items-center">
                    <Avatar size={32} icon={<UserOutlined />} className="mr-3" style={{ backgroundColor: '#214a78' }} />
                    <div>
                        <div className="font-medium text-gray-900">{text}</div>
                        <Text type="secondary" className="text-xs">
                            <a href={`mailto:${record.email}`}>{record.email}</a>
                        </Text>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Institution',
            dataIndex: 'institution',
            key: 'institution',
            width: 200,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="flex items-center">
                        <BankOutlined className="mr-2 text-gray-500" />
                        <span className="truncate font-medium text-gray-700">{text}</span>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => (
                <Tag color="#214a78" style={{ fontWeight: 500 }}>
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            render: (country) => (
                <div className="flex items-center">
                    <GlobalOutlined className="mr-2 text-gray-500" />
                    {country}
                </div>
            ),
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            width: 200,
            render: (experiences) => (
                <div>
                    {experiences.length > 0 ? (
                        <>
                            {experiences.slice(0, 2).map(exp => (
                                <Tag key={exp} size="small" className="mb-1">
                                    {exp.length > 15 ? `${exp.substring(0, 15)}...` : exp}
                                </Tag>
                            ))}
                            {experiences.length > 2 && (
                                <Tag size="small" color="default">+{experiences.length - 2} more</Tag>
                            )}
                        </>
                    ) : (
                        <Text type="secondary">Not provided</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                const colors = {
                    pending: { color: '', bg: '#fff7e6', border: '#ffd666' },
                    approved: { color: '', bg: '#f6ffed', border: '#95de64' },
                    rejected: { color: '', bg: '#fff2f0', border: '#ffadd2' }
                };
                return (
                    <Tag
                        color={colors[status]?.color}
                        style={{
                            backgroundColor: colors[status]?.bg,
                            borderColor: colors[status]?.border,
                            fontWeight: 500,
                            textTransform: 'capitalize'
                        }}
                    >
                        {getStatusIcon(status)} {status}
                    </Tag>
                );
            },
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Rejected', value: 'rejected' },
            ],
        },
        {
            title: 'Submitted',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            width: 120,
            render: (date) => (
                <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                    <Text className="text-xs text-gray-500">
                        {new Date(date).toLocaleDateString('en-US', { year: 'numeric' })}
                    </Text>
                </div>
            ),
            sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 160,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedRecord(record);
                                setViewModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={`Send Email to ${record.fullName}`}>
                        <Button
                            type="text"
                            icon={<MailOutlined />}
                            style={{ color: '#52c41a' }}
                            onClick={() => {
                                setSelectedVolunteerForEmail(record);
                                setEmailModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const stats = [
        {
            title: 'Total Submissions',
            value: data.length,
            icon: <UserOutlined />,
            color: '#1890ff',
        },
        {
            title: 'Pending Review',
            value: data.filter(item => item.status === 'pending').length,
            icon: <ClockCircleOutlined />,
            color: '#faad14',
        },
        {
            title: 'Approved',
            value: data.filter(item => item.status === 'approved').length,
            icon: <CheckCircleOutlined />,
            color: '#52c41a',
        },
        {
            title: 'Rejected',
            value: data.filter(item => item.status === 'rejected').length,
            icon: <ExclamationCircleOutlined />,
            color: '#ff4d4f',
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Title level={3} className="mb-2">
                    <UserOutlined className="mr-3" />
                    Volunteer Contributors
                </Title>
                <Text type="secondary">
                    Manage volunteer contributor applications and track their contributions to the database.
                </Text>
            </div>

            {/* Export Button
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={6} key={-1}>
                    <Card>
                      
                    </Card>
                </Col>
            </Row> */}

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card>
                            <div className="flex items-center">
                                <div
                                    className="flex items-center justify-center w-12 h-12 rounded-lg mr-4"
                                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <Text type="secondary" className="text-sm">{stat.title}</Text>
                                    <div className="text-2xl font-bold" style={{ color: stat.color }}>
                                        {stat.value}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Filters and Search */}
            <Card className="mb-6">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Input
                            placeholder="Search contributors..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            allowClear
                            size="large"
                        />
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Select
                            placeholder="Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={4} md={3}>
                        <Select
                            placeholder="Role"
                            value={roleFilter}
                            onChange={setRoleFilter}
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value="all">All Roles</Option>
                            <Option value="Student">Student</Option>
                            <Option value="Researcher">Researcher</Option>
                            <Option value="Scientist">Scientist</Option>
                            <Option value="Educator">Educator</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Text type="secondary" className="text-sm">
                                Showing {filteredData.length} of {data.length} contributors
                            </Text>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={loadData}
                                loading={loading}
                                type="default"
                            >
                                Refresh
                            </Button>
                              <Button 
                              style={{ backgroundColor: '#214a78' }}
                            icon={<DownloadOutlined />}
                            type="primary"
                            block
                            onClick={exportVolunteersToExcel}
                        >
                            Export All Volunteers
                        </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        total: filteredData.length,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} contributors`,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                    size="middle"
                    className="professional-table"
                    rowClassName={(record) =>
                        record.status === 'pending' ? 'pending-row' : ''
                    }
                />
                <style jsx>{`
          .professional-table .ant-table-thead > tr > th {
            background-color: #fafafa;
            font-weight: 600;
            color: #262626;
            border-bottom: 2px solid #f0f0f0;
          }
          .pending-row {
            background-color: #fffbf0;
          }
          .pending-row:hover {
            background-color: #fff7e6 !important;
          }
        `}</style>
            </Card>

            {/* View Details Modal */}
            <Modal
                title={
                    <div className="flex items-center">
                        <UserOutlined className="mr-2" />
                        Contributor Details
                    </div>
                }
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>,
                    selectedRecord && selectedRecord.status === 'pending' && (
                        <Button
                            key="approve"
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            loading={actionLoading[`${selectedRecord.id}-approved`]}
                            onClick={() => handleStatusChange(selectedRecord, 'approved')}
                        >
                            Approve
                        </Button>
                    ),
                ]}
            >
                {selectedRecord && (
                    <div>
                        {/* Status Badge */}
                        <div className="mb-4">
                            <Badge
                                status={getStatusColor(selectedRecord.status)}
                                text={selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                            />
                        </div>

                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Full Name" span={1}>
                                {selectedRecord.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={1}>
                                <a href={`mailto:${selectedRecord.email}`}>{selectedRecord.email}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Institution" span={1}>
                                {selectedRecord.institution}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role" span={1}>
                                <Tag color="blue">{selectedRecord.role}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Country" span={2}>
                                {selectedRecord.country}
                            </Descriptions.Item>
                            <Descriptions.Item label="Availability" span={2}>
                                {selectedRecord.availability} hours/month
                            </Descriptions.Item>
                            <Descriptions.Item label="Experience" span={2}>
                                <div>
                                    {selectedRecord.experience.length > 0 ? (
                                        selectedRecord.experience.map(exp => (
                                            <Tag key={exp} className="mb-1">{exp}</Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">Not provided</Text>
                                    )}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Interests" span={2}>
                                <div>
                                    {selectedRecord.interests.length > 0 ? (
                                        selectedRecord.interests.map(interest => (
                                            <Tag key={interest} color="green" className="mb-1">{interest}</Tag>
                                        ))
                                    ) : (
                                        <Text type="secondary">Not provided</Text>
                                    )}
                                </div>
                            </Descriptions.Item>
                            {selectedRecord.otherInterests && (
                                <Descriptions.Item label="Other Interests" span={2}>
                                    {selectedRecord.otherInterests}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Background" span={2}>
                                <Paragraph>{selectedRecord.background || 'Not provided'}</Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Submitted" span={1}>
                                {new Date(selectedRecord.submittedAt).toLocaleString()}
                            </Descriptions.Item>
                            {selectedRecord.approvedAt && (
                                <Descriptions.Item label="Last Updated" span={1}>
                                    {new Date(selectedRecord.approvedAt).toLocaleString()}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>
                )}
            </Modal>

            {/* Send Email Modal */}
            <SendEmailModal
                visible={emailModalVisible}
                onClose={() => {
                    setEmailModalVisible(false);
                    setSelectedVolunteerForEmail(null);
                }}
                recipientData={selectedVolunteerForEmail}
                recipientType="volunteer"
                onSuccess={() => {
                    message.success('Email sent to volunteer successfully');
                }}
            />
        </div>
    );
};

export default VolunteerContributorAdmin;