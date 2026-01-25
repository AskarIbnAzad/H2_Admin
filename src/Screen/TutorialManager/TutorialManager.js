
import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Spin,
  Empty,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { 
  get_tutorials_service_auth, 
  add_tutorial_service_auth, 
  update_tutorial_service_auth, 
  delete_tutorial_service_auth 
} from "../../Services/TutorialService";
import { setTutorialIdleStatus, resetTutorialData } from "../../Store/slices/Tutorial_slice";
import { asyncStatus } from "../../Utils/asyncStatus";

const { Title, Paragraph } = Typography;

const PAGE_SIZE = 6;

const TutorialManager = () => {
  // Get user from redux
  const user = useSelector((state) => state.userAuth.user);

  console.log("User Role ID:", user?.role_id);
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    get_tutorials_data, 
    get_tutorials_status, 
    add_tutorial_status, 
    update_tutorial_status, 
    delete_tutorial_status
  } = useSelector((state) => state.tutorial);

  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [form] = Form.useForm();

  const loading = get_tutorials_status === asyncStatus.LOADING || 
                 add_tutorial_status === asyncStatus.LOADING || 
                 update_tutorial_status === asyncStatus.LOADING || 
                 delete_tutorial_status === asyncStatus.LOADING;

    // Load tutorials on component mount
  useEffect(() => {
    dispatch(get_tutorials_service_auth());
  }, [dispatch]);

  // Auto close modal, reset form, and refetch after successful add/update
  useEffect(() => {
    if (add_tutorial_status === asyncStatus.SUCCEEDED || 
        update_tutorial_status === asyncStatus.SUCCEEDED) {
      setModalVisible(false);
      form.resetFields();
      setEditingTutorial(null);
      dispatch(setTutorialIdleStatus());
      dispatch(get_tutorials_service_auth());
    }
  }, [add_tutorial_status, update_tutorial_status, dispatch, form]);

  // Handle successful delete operations and refetch
  useEffect(() => {
    if (delete_tutorial_status === asyncStatus.SUCCEEDED) {
      // Adjust page if last item on page is deleted
      if ((get_tutorials_data?.length || 0) % PAGE_SIZE === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      dispatch(setTutorialIdleStatus());
      dispatch(get_tutorials_service_auth());
    }
  }, [delete_tutorial_status, get_tutorials_data, currentPage, dispatch]);

  // Pagination logic
  const paginatedTutorials = get_tutorials_data?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  ) || [];

  // Helper to detect resource type
  const getResourceType = (url) => {
    if (!url) return 'none';
    if (url.match(/youtube|youtu\.be|vimeo|dailymotion|video/)) {
      console.log("video");
      return 'video'};
    if (url.match(/\.pdf$|\.docx$|\.doc$|\.pptx$|\.xlsx$/)) return 'document';
    return 'link';
  };
  const handleAdd = () => {
    setEditingTutorial(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    form.setFieldsValue(tutorial);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this tutorial?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(delete_tutorial_service_auth(id));
        // Adjust page if last item on page is deleted
        if ((get_tutorials_data.length - 1) % PAGE_SIZE === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTutorial) {
        // Update existing tutorial
        dispatch(update_tutorial_service_auth({ id: editingTutorial.id, ...values }));
      } else {
        // Create new tutorial
        dispatch(add_tutorial_service_auth(values));
      }
    } catch (error) {
      // Validation error - form will show errors
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Loading state for the page (only block main list, not modal)
  const showLoading = get_tutorials_status === asyncStatus.LOADING && !get_tutorials_data?.length;
  const showEmpty = get_tutorials_status === asyncStatus.SUCCEEDED && (!get_tutorials_data || get_tutorials_data.length === 0);

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={showLoading}>
        <Card
          className="dashboard-card"
          bordered={false}
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              <VideoCameraOutlined /> Tutorial Manager
            </Title>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ color: "#004c78", fontWeight: "bold" }}>
                Total Tutorials: {get_tutorials_data?.length || 0}
              </span>
              {user?.role_id === 1 && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                  style={{ backgroundColor: "#004c78", borderColor: "#004c78" }}
                >
                  Add Tutorial
                </Button>
              )}
            </div>
          </div>
        </Card>

        {showEmpty && user?.role_id === 1 ? (
          <Card
            className="dashboard-card"
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>
                <VideoCameraOutlined /> Tutorial Manager
              </Title>
              <Button type="primary" onClick={handleAdd}>
                Add Tutorial
              </Button>
            </div>
            <Empty
              description="No tutorials found"
              style={{ marginTop: "50px" }}
            >
              <Button type="primary" onClick={handleAdd}>
                Create First Tutorial
              </Button>
            </Empty>
          </Card>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
                marginBottom: 32,
              }}
            >
              {paginatedTutorials?.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  hoverable
                  style={{ borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}
                  actions={
                    user?.role_id === 1
                      ? [
                          <EditOutlined key="edit" onClick={() => handleEdit(tutorial)} />, 
                          <DeleteOutlined key="delete" onClick={() => handleDelete(tutorial.id)} style={{ color: "#cf1322" }} />, 
                        ]
                      : []
                  }
                  cover={
                    tutorial.video_url && getResourceType(tutorial.video_url) === 'video' ? (
                      <div style={{ height: 180, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <iframe
                          width="100%"
                          height="180"
                          src={tutorial.video_url.replace('/share/', '/embed/')}
                          title={tutorial.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ borderRadius: 8 }}
                        />
                      </div>
                    ) : tutorial.video_url && getResourceType(tutorial.video_url) === 'document' ? (
                      <div style={{ height: 180, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <a href={tutorial.video_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#004c78', fontSize: 18 }}>
                          Open Document
                        </a>
                      </div>
                    ) : tutorial.video_url ? (
                      <div style={{ height: 180, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <a href={tutorial.video_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#004c78', fontSize: 18 }}>
                          Open Resource
                        </a>
                      </div>
                    ) : null
                  }
                >
                  <Title level={5}>{tutorial.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }}>{tutorial.description}</Paragraph>
                </Card>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={get_tutorials_data?.length || 0}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}

        <Modal
          title={editingTutorial ? "Edit Tutorial" : "Add Tutorial"}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={editingTutorial ? "Update" : "Add"}
          confirmLoading={loading}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ title: "", description: "", video_url: "" }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Tutorial Title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea rows={3} placeholder="Tutorial Description (optional)" />
            </Form.Item>
            <Form.Item
              label="Resource Link (YouTube, PDF, Doc, etc)"
              name="video_url"
              rules={[{ required: true, message: "Please enter a resource link (video, document, etc)" }]}
            >
              <Input placeholder="Paste any link: YouTube, PDF, Doc, etc" />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default TutorialManager;
