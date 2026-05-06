import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { profileStore } from "../../store/profileStore";
import { request } from "../../util/request";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setProfile, setAccessToken } = profileStore();

  const onFinish = async (values) => {
    const param = {
      email: values.username,
      password: values.password,
    };
    const res = await request("login", "post", param);

    if (res && !res.error) {
      setProfile({
        ...res.user?.profile,
        ...res.user,
      });
      setAccessToken(res.access_token);
      message.success(res.message || "ចូលប្រើបានជោគជ័យ!");
      navigate("/");
    } else {
      const errorMsg =
        res?.errors?.message || "អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវទេ!";
      message.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ចូលប្រើប្រាស់គណនី
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីបន្ត
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="username"
              label={<span className="font-medium text-gray-700">អ៊ីមែល</span>}
              rules={[{ required: true, message: "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="អ៊ីមែល"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="font-medium text-gray-700">លេខសម្ងាត់</span>
              }
              rules={[
                { required: true, message: "សូមបញ្ចូលលេខសម្ងាត់របស់អ្នក!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="លេខសម្ងាត់"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-sm text-gray-600">
                    ចងចាំខ្ញុំ
                  </Checkbox>
                </Form.Item>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150"
                >
                  ភ្លេចលេខសម្ងាត់?
                </a>
              </Flex>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="bg-indigo-600 hover:bg-indigo-700 border-none font-semibold text-base shadow-sm h-11"
              >
                ចូលប្រើប្រាស់
              </Button>
              <div className="mt-6 text-center text-sm text-gray-600">
                ឬ{" "}
                <a
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150"
                >
                  ចុះឈ្មោះឥឡូវនេះ!
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
