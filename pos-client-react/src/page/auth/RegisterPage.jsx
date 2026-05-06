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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined className="text-gray-400 text-lg" />
      <div className="mt-2 text-xs text-gray-500">ផ្ទុកឡើង</div>
    </button>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ចុះឈ្មោះបង្កើតគណនី
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតគណនីថ្មី
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                name="name"
                label={
                  <span className="font-medium text-gray-700">ឈ្មោះពេញ</span>
                }
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះរបស់អ្នក!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="ឈ្មោះពេញ"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <span className="font-medium text-gray-700">អ៊ីមែល</span>
                }
                rules={[
                  { required: true, message: "សូមបញ្ចូលអ៊ីមែល!" },
                  { type: "email", message: "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ!" },
                ]}
                {...errors?.email}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="អ៊ីមែល"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                name="password"
                label={
                  <span className="font-medium text-gray-700">លេខសម្ងាត់</span>
                }
                rules={[{ required: true, message: "សូមបញ្ចូលលេខសម្ងាត់!" }]}
                {...errors?.password}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="លេខសម្ងាត់"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label={
                  <span className="font-medium text-gray-700">
                    បញ្ជាក់លេខសម្ងាត់
                  </span>
                }
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
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="បញ្ជាក់លេខសម្ងាត់"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="phone"
              label={
                <span className="font-medium text-gray-700">លេខទូរស័ព្ទ</span>
              }
              rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="លេខទូរស័ព្ទ (ឧទាហរណ៍៖ 012 345 678)"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span className="font-medium text-gray-700">អាសយដ្ឋាន</span>
              }
            >
              <TextArea
                rows={3}
                placeholder="ភូមិ/ឃុំ, ស្រុក/ខណ្ឌ, ខេត្ត/រាជធានី"
                showCount
                maxLength={200}
                className="rounded-md p-2 border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">រូបថតគណនី</span>
              }
            >
              <div className="flex items-center gap-4">
                <Upload
                  customRequest={({ onSuccess }) => onSuccess("ok")}
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </div>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="bg-indigo-600 hover:bg-indigo-700 border-none font-semibold text-base shadow-sm h-11"
              >
                ចុះឈ្មោះឥឡូវនេះ
              </Button>
              <div className="mt-6 text-center text-sm text-gray-600">
                មានគណនីរួចហើយមែនទេ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150"
                >
                  ចូលប្រើប្រាស់នៅទីនេះ
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
