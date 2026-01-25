import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  message,
  Select,
  Tooltip,
  Spin,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { apiHandle } from '../../Config/ApiHandle/apiHandle';

const { TextArea } = Input;
const { Option } = Select;

/**
 * Reusable Email Modal Component
 * @param {Object} props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Object} props.recipientData - Data of the recipient (email, name, etc.)
 * @param {string} props.recipientType - Type of recipient (user, volunteer, contact, feedback)
 * @param {Function} props.onSuccess - Callback after successful email send
 * @param {string} props.defaultSubject - Default email subject
 * @param {string} props.defaultMessage - Default email message body
 */
const SendEmailModal = ({
  visible,
  onClose,
  recipientData,
  recipientType = 'user',
  onSuccess,
  defaultSubject = '',
  defaultMessage = '',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState('custom');

  const handleClose = () => {
    form.resetFields();
    setEmailType('custom');
    onClose();
  };

  const handleSendEmail = async (values) => {
    if (!recipientData?.email) {
      message.error('Recipient email is not available');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        recipient_email: recipientData.email,
        recipient_name: recipientData.name || recipientData.fullName || 'User',
        recipient_type: recipientType,
        subject: values.subject,
        message: values.message,
        email_type: emailType,
        recipient_id: recipientData.id,
      };

      const response = await apiHandle.post('send-mail', payload);

      if (response?.status === 200 || response?.data?.success) {
        message.success('Email sent successfully');
        form.resetFields();
        setEmailType('custom');
        
        if (onSuccess) {
          onSuccess();
        }
        
        handleClose();
      } else {
        message.error(response?.data?.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      message.error(
        error?.response?.data?.message || 'Failed to send email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getEmailTemplates = () => {
    const templates = {
      user: [
        {
          label: 'Account Activation',
          value: 'account_activation',
          subject: 'Account Activation Required',
          message: `Dear ${recipientData?.name || 'User'},\n\nYour account has been created and is ready for activation. Please follow the instructions sent to your email to activate your account.\n\nBest regards,\nH2 Admin Team`,
        },
        {
          label: 'Account Status Update',
          value: 'status_update',
          subject: 'Account Status Updated',
          message: `Dear ${recipientData?.name || 'User'},\n\nYour account status has been updated. Please log in to your account for more details.\n\nBest regards,\nH2 Admin Team`,
        },
      ],
      volunteer: [
        {
          label: 'Application Approved',
          value: 'application_approved',
          subject: 'Congratulations! Your Application Has Been Approved',
          message: `Dear ${recipientData?.fullName || 'Volunteer'},\n\nCongratulations! Your volunteer application has been approved. We look forward to working with you.\n\nBest regards,\nH2 Admin Team`,
        },
        {
          label: 'Application Rejected',
          value: 'application_rejected',
          subject: 'Application Status Update',
          message: `Dear ${recipientData?.fullName || 'Volunteer'},\n\nThank you for your interest in volunteering. Unfortunately, your application could not be approved at this time. We encourage you to apply again in the future.\n\nBest regards,\nH2 Admin Team`,
        },
      ],
      contact: [
        {
          label: 'Response to Inquiry',
          value: 'inquiry_response',
          subject: 'Re: Your Contact Form Submission',
          message: `Dear ${recipientData?.name || 'User'},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nH2 Admin Team`,
        },
      ],
      feedback: [
        {
          label: 'Feedback Acknowledgment',
          value: 'feedback_ack',
          subject: 'Thank You for Your Feedback',
          message: `Dear ${recipientData?.name || 'User'},\n\nThank you for taking the time to provide your feedback. Your input is valuable to us and helps us improve our services.\n\nBest regards,\nH2 Admin Team`,
        },
      ],
    };

    return templates[recipientType] || [];
  };

  const handleTemplateChange = (value) => {
    const templates = getEmailTemplates();
    const selected = templates.find(t => t.value === value);
    
    if (selected) {
      form.setFieldsValue({
        subject: selected.subject,
        message: selected.message,
      });
    }
  };

  const templates = getEmailTemplates();

  return (
    <Modal
      title={
        <Space>
          <MailOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <span>Send Email</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={() => form.submit()}
          style={{ backgroundColor: '#004c78' }}
        >
          Send Email
        </Button>,
      ]}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              backgroundColor: '#f0f5ff',
              padding: 12,
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            <p style={{ margin: '4px 0', fontSize: 12 }}>
              <strong>To:</strong> {recipientData?.email}
            </p>
            <p style={{ margin: '4px 0', fontSize: 12 }}>
              <strong>Recipient:</strong>{' '}
              {recipientData?.name || recipientData?.fullName || 'Unknown'}
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendEmail}
          initialValues={{
            subject: defaultSubject,
            message: defaultMessage,
            email_type: 'custom',
          }}
        >
          {templates.length > 0 && (
            <Form.Item label="Email Template" name="email_type">
              <Select
                placeholder="Select a template or choose Custom"
                onChange={(value) => {
                  setEmailType(value);
                  if (value !== 'custom') {
                    handleTemplateChange(value);
                  }
                }}
              >
                <Option value="custom">Custom Email</Option>
                {templates.map((template) => (
                  <Option key={template.value} value={template.value}>
                    {template.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="subject"
            label="Subject"
            rules={[
              { required: true, message: 'Please enter email subject' },
              { min: 3, message: 'Subject must be at least 3 characters' },
              { max: 100, message: 'Subject must not exceed 100 characters' },
            ]}
          >
            <Input
              placeholder="Enter email subject"
              prefix={<MailOutlined />}
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: 'Please enter email message' },
              { min: 10, message: 'Message must be at least 10 characters' },
              { max: 5000, message: 'Message must not exceed 5000 characters' },
            ]}
          >
            <TextArea
              placeholder="Enter your email message"
              rows={8}
              showCount
              maxLength={5000}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Form.Item>

          <div
            style={{
              backgroundColor: '#fafafa',
              padding: 12,
              borderRadius: 4,
              marginTop: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 11, color: '#666' }}>
              <strong>Note:</strong> This email will be sent to the recipient's email address.
              Please review the content before sending.
            </p>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default SendEmailModal;
