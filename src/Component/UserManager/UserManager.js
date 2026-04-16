// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Input,
//   Button,
//   Space,
//   Card,
//   Modal,
//   Form,
//   Select,
//   Typography,
//   Tag,
//   Popconfirm,
//   message,
//   Row,
//   Col,
//   DatePicker,
// } from "antd";
// import {
//   UserOutlined,
//   MailOutlined,
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   ExclamationCircleOutlined,
//   TeamOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   CalendarOutlined,
//   BankOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   add_user_service_auth,
//   get_user_service_auth,
//   edit_user_service_auth,
//   delete_user_service_auth,
// } from "../../Services/UserManagement";
// import { asyncStatus } from "../../Utils/asyncStatus";
// import { ClipLoader } from "react-spinners";
// import { colorTheme } from "../../Utils/colortheme";
// import BackButton from "../BackBtn/BackButton";
// import moment from 'moment'; // Import moment for date handling

// const { Title, Text } = Typography;
// const { Option } = Select;

// const UserManager = () => {
//   const dispatch = useDispatch();
//   const { user, getUserStatus, addUserStatus, editUserStatus } = useSelector(
//     (state) => state.user
//   );

//   const [userList, setUserList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [form] = Form.useForm();

//   // Fetch users on component mount
//   useEffect(() => {
//     dispatch(get_user_service_auth());
//   }, [dispatch]);

//   // Update userList when user data is received
//   useEffect(() => {
//     if (user?.users) {
//       // Map API user data to expected format
//       const mappedUsers = user.users.map(u => ({
//         id: u.id,
//         name: u.name,
//         email: u.email,
//         dob: u.dob || null,
//         company: u.company || "",
//         role: u.role?.name || u.role || "User",
//         status: u.status,
//       }));
//       setUserList(mappedUsers);
//     }
//   }, [user]);

//   // Handle success of add user
//   useEffect(() => {
//     if (addUserStatus === asyncStatus.SUCCEEDED) {
//       setUserList([
//         ...userList,
//         { ...form.getFieldsValue(), id: userList.length + 1, status: "In-Active" }, // Force status to In-Active for new users
//       ]);
//       closeModal();
//       //   message.success('User added successfully');
//     }
//   }, [addUserStatus]);

//   // Handle success of edit user
//   useEffect(() => {
//     if (editUserStatus === asyncStatus.SUCCEEDED) {
//       const formValues = form.getFieldsValue();
//       setUserList(
//         userList.map((user) =>
//           user.id === editingUser.id
//             ? {
//                 ...user,
//                 name: formValues.name,
//                 email: formValues.email,
//                 dob: formValues.dob ? formValues.dob.format('YYYY-MM-DD') : null,
//                 company: formValues.company,
//                 role: formValues.role,
//                 status: formValues.status,
//               }
//             : user
//         )
//       );
//       closeModal();
//       //   message.success('User updated successfully');
//     }
//   }, [editUserStatus]);

//   // Filter users based on search term
//   const filteredUsers = userList.filter(
//     (user) =>
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.company?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination calculations
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

//   // Pagination handler
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Modal control functions
//   const openModal = (user = null) => {
//     if (user) {
//       setEditingUser(user);
//       form.setFieldsValue({
//         name: user.name,
//         email: user.email,
//         // Convert string date to moment object for DatePicker
//         dob: user.dob ? moment(user.dob) : null,
//         company: user.company,
//         password: "",
//         role: user.role,
//         status: user.status,
//       });
//     } else {
//       setEditingUser(null);
//       form.resetFields();
//       form.setFieldsValue({
//         role: "Admin",
//         status: "In-Active", // Default status for new users is In-Active
//       });
//     }
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     form.resetFields();
//     setEditingUser(null);
//   };

//   // Helper to get role_id from role name
//   const getRoleId = (roleName) => {
//     switch (roleName) {
//       case "Admin": return 1;
//       case "Reviewer": return 2;
//       case "Researcher":
//       case "Contributor/Researcher": return 3;
//       case "User": return 4;
//       default: return 4;
//     }
//   };

//   // Form submission handlers
//   const handleSubmit = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         // Format the date properly before submitting
//         const formattedValues = {
//           ...values,
//           dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
//         };
//         const role_id = getRoleId(formattedValues.role);

//         if (editingUser) {
//           // Edit existing user
//           const updatedUserObject = {
//             id: editingUser.id,
//             name: formattedValues.name,
//             email: formattedValues.email,
//             dob: formattedValues.dob,
//             company: formattedValues.company,
//             role: formattedValues.role,
//             role_id,
//             status: formattedValues.status, // Status can be changed during edit
//           };
//           dispatch(
//             edit_user_service_auth({
//               user_id: editingUser.id,
//               update_data: updatedUserObject,
//             })
//           );
//         } else {
//           // Add new user - Always set status as In-Active
//           const newUserObject = {
//             name: formattedValues.name,
//             email: formattedValues.email,
//             dob: formattedValues.dob,
//             company: formattedValues.company,
//             password: formattedValues.password,
//             role: formattedValues.role,
//             role_id,
//             status: "In-Active", // Force status to In-Active for new users
//           };
//           dispatch(add_user_service_auth(newUserObject));
//         }
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   // Delete user handler
//   const handleDeleteUser = (id) => {
//     dispatch(delete_user_service_auth(id));
//     setUserList(userList.filter((user) => user.id !== id));
//     message.success("User deleted successfully");
//   };

//   // Render status tag
//   const renderStatusTag = (status) => {
//     if (status === "Active") {
//       return (
//         <Tag icon={<CheckCircleOutlined />} color="success">
//           Active
//         </Tag>
//       );
//     } else {
//       return (
//         <Tag icon={<CloseCircleOutlined />} color="error">
//           In-Active
//         </Tag>
//       );
//     }
//   };

//   // Format date for display in the table
//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     return moment(dateString).format("DD-MM-YYYY");
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "#",
//       key: "index",
//       width: 60,
//       render: (_, __, index) => indexOfFirstEntry + index + 1,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text) => (
//         <Space>
//           <UserOutlined style={{ color: colorTheme.primary }} />
//           <span>{text}</span>
//         </Space>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       render: (text) => (
//         <Space>
//           <MailOutlined style={{ color: colorTheme.primary }} />
//           <span>{text}</span>
//         </Space>
//       ),
//     },
//     {
//       title: "Date of Birth",
//       dataIndex: "dob",
//       key: "dob",
//       render: (text) => (
//         <Space>
//           <CalendarOutlined style={{ color: colorTheme.primary }} />
//           <span>{formatDate(text)}</span>
//         </Space>
//       ),
//     },
//     {
//       title: "Company",
//       dataIndex: "company",
//       key: "company",
//       render: (text) => (
//         <Space>
//           <BankOutlined style={{ color: colorTheme.primary }} />
//           <span>{text || "-"}</span>
//         </Space>
//       ),
//     },
//     {
//       title: "Role",
//       dataIndex: "role",
//       key: "role",
//       render: (text) => (
//         <Space>
//           <TeamOutlined style={{ color: colorTheme.primary }} />
//           <span>{text}</span>
//         </Space>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => renderStatusTag(status),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 120,
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             size="small"
//             onClick={() => openModal(record)}
//             style={{ backgroundColor: colorTheme.primary }}
//           />
//           <Popconfirm
//             title="Delete this user?"
//             description="Are you sure you want to delete this user?"
//             icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
//             onConfirm={() => handleDeleteUser(record.id)}
//             okText="Delete"
//             cancelText="Cancel"
//             okButtonProps={{ danger: true }}
//           >
//             <Button danger icon={<DeleteOutlined />} size="small" />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="container mx-auto p-6">
//       <Row className="mb-6 gap-x-3" align="middle">
//         <Col>
//           <BackButton path={"/DataManager"} />
//         </Col>
//         <Col>
//           <Title level={3} style={{ margin: 0 }}>
//             User Management
//           </Title>
//         </Col>
//       </Row>

//       <Card>
//         <div className="flex justify-end mb-4">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => openModal()}
//             style={{ backgroundColor: colorTheme.primary }}
//           >
//             Add New User
//           </Button>
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
//           <div className="flex items-center">
//             <Text>Show</Text>
//             <Select
//               value={entriesPerPage}
//               onChange={(value) => setEntriesPerPage(value)}
//               style={{ width: 80, margin: "0 8px" }}
//             >
//               <Option value={5}>5</Option>
//               <Option value={10}>10</Option>
//               <Option value={20}>20</Option>
//             </Select>
//             <Text>entries per page</Text>
//           </div>

//           <Input
//             prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: 250 }}
//             allowClear
//           />
//         </div>

//         {getUserStatus === asyncStatus.LOADING ? (
//           <div className="flex justify-center items-center h-64">
//             <ClipLoader size={50} color={colorTheme.primary} loading={true} />
//           </div>
//         ) : (
//           <>
//             <Table
//               columns={columns}
//               dataSource={currentUsers}
//               rowKey="id"
//               pagination={false}
//               className="mb-4"
//             />

//             <div className="flex justify-between items-center mt-4">
//               <span>
//                 Showing {filteredUsers.length > 0 ? indexOfFirstEntry + 1 : 0}{" "}
//                 to {Math.min(indexOfLastEntry, filteredUsers.length)} of{" "}
//                 {filteredUsers.length} entries
//               </span>
//               <div className="flex gap-2">
//                 {Array.from(
//                   { length: Math.ceil(filteredUsers.length / entriesPerPage) },
//                   (_, pageIndex) => (
//                     <Button
//                       key={pageIndex}
//                       onClick={() => handlePageChange(pageIndex + 1)}
//                       type={
//                         currentPage === pageIndex + 1 ? "primary" : "default"
//                       }
//                       style={{
//                         backgroundColor:
//                           currentPage === pageIndex + 1
//                             ? colorTheme.primary
//                             : "white",
//                       }}
//                     >
//                       {pageIndex + 1}
//                     </Button>
//                   )
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </Card>

//       {/* Add/Edit User Modal */}
//       <Modal
//         title={
//           <div className="text-xl font-bold">
//             {editingUser ? "Edit User" : "Add New User"}
//           </div>
//         }
//         open={modalVisible}
//         onCancel={closeModal}
//         footer={[
//           <Button key="cancel" onClick={closeModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={
//               addUserStatus === asyncStatus.LOADING ||
//               editUserStatus === asyncStatus.LOADING
//             }
//             onClick={handleSubmit}
//             style={{ backgroundColor: colorTheme.primary }}
//           >
//             {editingUser ? "Save" : "Add"}
//           </Button>,
//         ]}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{
//             role: "Admin",
//             status: "In-Active", // Default status changed to In-Active
//           }}
//         >
//           <Form.Item
//             name="name"
//             label="Name"
//             rules={[{ required: true, message: "Please enter user name" }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="Name" />
//           </Form.Item>

//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: "Please enter email" },
//               { type: "email", message: "Please enter a valid email" },
//             ]}
//           >
//             <Input prefix={<MailOutlined />} placeholder="Email" />
//           </Form.Item>

//           <Form.Item name="dob" label="Date of Birth">
//             <DatePicker
//               style={{ width: "100%" }}
//               placeholder="Select date of birth"
//               format="DD-MM-YYYY"
//             />
//           </Form.Item>

//           <Form.Item name="company" label="Company">
//             <Input prefix={<BankOutlined />} placeholder="Company" />
//           </Form.Item>

//           {!editingUser && (
//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[{ required: true, message: "Please enter password" }]}
//             >
//               <Input.Password placeholder="Password" />
//             </Form.Item>
//           )}

//           <Form.Item name="role" label="Role">
//             <Select>
//               <Option value="Reviewer">Reviewer</Option>
//               <Option value="Admin">Admin</Option>
//               <Option value="Researcher">Researcher</Option>
//               <Option value="User">User</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="status" label="Status">
//             <Select disabled={!editingUser}> {/* Disable status selection for new users */}
//               <Option value="Active">Active</Option>
//               <Option value="In-Active">In-Active</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserManager;


import React, { useEffect, useState } from "react";
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
  Popconfirm,
  message,
  Row,
  Col,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  add_user_service_auth,
  get_user_service_auth,
  edit_user_service_auth,
  delete_user_service_auth,
} from "../../Services/UserManagement";
import { asyncStatus } from "../../Utils/asyncStatus";
import { ClipLoader } from "react-spinners";
import { colorTheme } from "../../Utils/colortheme";
import BackButton from "../BackBtn/BackButton";
import moment from 'moment'; // Import moment for date handling
import SendEmailModal from "../Modal/SendEmailModal";

const { Title, Text } = Typography;
const { Option } = Select;

const UserManager = () => {
  const dispatch = useDispatch();
  const { user, getUserStatus, addUserStatus, editUserStatus } = useSelector(
    (state) => state.user
  );

  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedUserForEmail, setSelectedUserForEmail] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(get_user_service_auth());
  }, [dispatch]);

  // Update userList when user data is received
  useEffect(() => {
    if (user?.users) {
      // Map API user data to expected format
      const mappedUsers = user.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        dob: u.dob || null,
        company: u.company || "",
        role: u.role?.name || u.role || "User",
        status: u.status,
      }));
      setUserList(mappedUsers);
    }
  }, [user]);

  // Handle success of add user
  useEffect(() => {
    if (addUserStatus === asyncStatus.SUCCEEDED) {
      setUserList([
        ...userList,
        { ...form.getFieldsValue(), id: userList.length + 1, status: "Inactive" }, // Force status to Inactive for new users
      ]);
      closeModal();
      //   message.success('User added successfully');
    }
  }, [addUserStatus]);

  // Handle success of edit user
  useEffect(() => {
    if (editUserStatus === asyncStatus.SUCCEEDED) {
      const formValues = form.getFieldsValue();
      setUserList(
        userList.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: formValues.name,
                email: formValues.email,
                dob: formValues.dob ? formValues.dob.format('YYYY-MM-DD') : null,
                company: formValues.company,
                role: formValues.role,
                status: formValues.status,
              }
            : user
        )
      );
      closeModal();
      //   message.success('User updated successfully');
    }
  }, [editUserStatus]);

  // Filter users based on search term
  const filteredUsers = userList.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when entries per page changes
  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  // Modal control functions
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        // Convert string date to moment object for DatePicker
        dob: user.dob ? moment(user.dob) : null,
        company: user.company,
        password: "",
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      form.resetFields();
      form.setFieldsValue({
        role: "Admin",
        status: "Inactive", // Default status for new users is Inactive
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  // Helper to get role_id from role name
  const getRoleId = (roleName) => {
    switch (roleName) {
      case "Admin": return 1;
      case "User": return 2;
      case "RESEARCHER": return 3;
      default: return 2;
    }
  };

  // Form submission handlers
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Format the date properly before submitting
        const formattedValues = {
          ...values,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
        };
        const role_id = getRoleId(formattedValues.role);

        if (editingUser) {
          // Edit existing user
          const updatedUserObject = {
            id: editingUser.id,
            name: formattedValues.name,
            email: formattedValues.email,
            dob: formattedValues.dob,
            company: formattedValues.company,
            role: formattedValues.role,
            role_id,
            status: formattedValues.status, // Status can be changed during edit
          };
          dispatch(
            edit_user_service_auth({
              user_id: editingUser.id,
              update_data: updatedUserObject,
            })
          );
        } else {
          // Add new user - Always set status as In-Active
          const newUserObject = {
            name: formattedValues.name,
            email: formattedValues.email,
            dob: formattedValues.dob,
            company: formattedValues.company,
            password: formattedValues.password,
            role: formattedValues.role,
            role_id,
            status: "Inactive", // Force status to Inactive for new users
          };
          dispatch(add_user_service_auth(newUserObject));
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Delete user handler
  const handleDeleteUser = (id) => {
    dispatch(delete_user_service_auth(id));
    setUserList(userList.filter((user) => user.id !== id));
    message.success("User deleted successfully");
  };

  // Render status tag
  const renderStatusTag = (status) => {
    if (status === "Active") {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Active
        </Tag>
      );
    } else {
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          In-Active
        </Tag>
      );
    }
  };

  // Format date for display in the table
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("DD-MM-YYYY");
  };

  // Table columns
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => indexOfFirstEntry + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: colorTheme.primary }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: colorTheme.primary }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (text) => (
        <Space>
          <CalendarOutlined style={{ color: colorTheme.primary }} />
          <span>{formatDate(text)}</span>
        </Space>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (text) => (
        <Space>
          <BankOutlined style={{ color: colorTheme.primary }} />
          <span>{text || "-"}</span>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Space>
          <TeamOutlined style={{ color: colorTheme.primary }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<MailOutlined />}
            size="small"
            onClick={() => {
              setSelectedUserForEmail(record);
              setEmailModalVisible(true);
            }}
            style={{ backgroundColor: '#52c41a' }}
            title="Send Email"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
            style={{ backgroundColor: colorTheme.primary }}
          />
          <Popconfirm
            title="Delete this user?"
            description="Are you sure you want to delete this user?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
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
            User Management
          </Title>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            style={{ backgroundColor: colorTheme.primary }}
          >
            Add New User
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center">
            <Text>Show</Text>
            <Select
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
              style={{ width: 80, margin: "0 8px" }}
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            <Text>entries per page</Text>
          </div>

          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </div>

        {getUserStatus === asyncStatus.LOADING ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color={colorTheme.primary} loading={true} />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={currentUsers}
              rowKey="id"
              pagination={false}
              className="mb-4"
            />

            <div className="flex justify-between items-center mt-4">
              <span>
                Showing {filteredUsers.length > 0 ? indexOfFirstEntry + 1 : 0}{" "}
                to {Math.min(indexOfLastEntry, filteredUsers.length)} of{" "}
                {filteredUsers.length} entries
              </span>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(filteredUsers.length / entriesPerPage) },
                  (_, pageIndex) => (
                    <Button
                      key={pageIndex}
                      onClick={() => handlePageChange(pageIndex + 1)}
                      type={
                        currentPage === pageIndex + 1 ? "primary" : "default"
                      }
                      style={{
                        backgroundColor:
                          currentPage === pageIndex + 1
                            ? colorTheme.primary
                            : "white",
                      }}
                    >
                      {pageIndex + 1}
                    </Button>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        title={
          <div className="text-xl font-bold">
            {editingUser ? "Edit User" : "Add New User"}
          </div>
        }
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={
              addUserStatus === asyncStatus.LOADING ||
              editUserStatus === asyncStatus.LOADING
            }
            onClick={handleSubmit}
            style={{ backgroundColor: colorTheme.primary }}
          >
            {editingUser ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: "Admin",
            status: "Inactive", // Default status changed to Inactive
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select date of birth"
              format="DD-MM-YYYY"
            />
          </Form.Item>

          <Form.Item name="company" label="Company">
            <Input prefix={<BankOutlined />} placeholder="Company" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          )}

          <Form.Item name="role" label="Role">
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
              <Option value="Researcher">Researcher</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select disabled={!editingUser}> {/* Disable status selection for new users */}
              <Option value="Active">Active</Option>
              <Option value="Inactive">In-Active</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Send Email Modal */}
      <SendEmailModal
        visible={emailModalVisible}
        onClose={() => {
          setEmailModalVisible(false);
          setSelectedUserForEmail(null);
        }}
        recipientData={selectedUserForEmail}
        recipientType="user"
        onSuccess={() => {
          message.success('Email sent to user successfully');
        }}
      />
    </div>
  );
};

export default UserManager;




