import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Upload, Image, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../util/request";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

// Function បម្លែង File ទៅជា Base64 សម្រាប់ Preview
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [errors, setErrors] = useState({});

  // States សម្រាប់ Preview រូបភាព
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // ប៊ូតុង Upload
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>ផ្ទុកឡើង</div>
    </button>
  );

  // បើកមើលរូបភាពធំ
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // គ្រប់គ្រងការប្តូររូបភាព (យកតែ 1 សន្លឹក)
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);

    formData.append("phone", values.phone);
    formData.append("address", values.address || "");
    formData.append("type", "customer");

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    const res = await request("register", "post", formData);

    if (res && !res.error) {
      message.success("ការចុះឈ្មោះបានជោគជ័យ!");
      navigate("/login");
    } else {
      setErrors(res.errors);
      message.error("មានបញ្ហាក្នុងការចុះឈ្មោះ!");
    }
  };

  return (
    <div
      style={{
        width: 430,
        padding: 30,
        margin: "60px auto",
        border: "1px solid #d9d9d9",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        ចុះឈ្មោះបង្កើតគណនី
      </h1>

      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះរបស់អ្នក!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="ឈ្មោះពេញ"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "សូមបញ្ចូលអ៊ីមែល!" },
            { type: "email", message: "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ!" },
          ]}
          {...errors?.email}
        >
          <Input prefix={<MailOutlined />} placeholder="អ៊ីមែល" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="លេខទូរស័ព្ទ (ឧទាហរណ៍៖ 012 345 678)"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "សូមបញ្ចូលលេខសម្ងាត់!" }]}
          {...errors?.password}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="លេខសម្ងាត់"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          rules={[
            { required: true, message: "សូមបញ្ជាក់លេខសម្ងាត់ម្តងទៀត!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("លេខសម្ងាត់បញ្ជាក់មិនត្រូវគ្នាទេ!"),
                );
              },
            }),
          ]}
          {...errors?.password_confirmation}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="បញ្ជាក់លេខសម្ងាត់"
            size="large"
          />
        </Form.Item>

        <Form.Item name="address" label="អាសយដ្ឋាន">
          <TextArea
            rows={3}
            placeholder="ភូមិ/ឃុំ, ស្រុក/ខណ្ឌ, ខេត្ត/រាជធានី"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item label="រូបថតគណនី">
          <Upload
            customRequest={({ onSuccess }) => onSuccess("ok")}
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" size="large">
            ចុះឈ្មោះឥឡូវនេះ
          </Button>
          <div style={{ marginTop: 15, textAlign: "center" }}>
            មានគណនីរួចហើយមែនទេ? <Link to="/login">ចូលប្រើប្រាស់នៅទីនេះ</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
