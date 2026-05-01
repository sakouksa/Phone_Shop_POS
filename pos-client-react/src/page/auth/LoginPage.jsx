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
      // បង្ហាញសារកំហុសពី Backend ឬសារលំនាំដើមជាភាសាខ្មែរ
      const errorMsg =
        res?.errors?.message || "អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវទេ!";
      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        width: 400,
        padding: 25,
        margin: "100px auto",
        border: "1px solid #d9d9d9",
        backgroundColor: "#fff",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        ចូលប្រើប្រាស់គណនី
      </h1>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="អ៊ីមែល" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "សូមបញ្ចូលលេខសម្ងាត់របស់អ្នក!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="លេខសម្ងាត់"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>ចងចាំខ្ញុំ</Checkbox>
            </Form.Item>
            <a href="/forgot-password">ភ្លេចលេខសម្ងាត់?</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" size="large">
            ចូលប្រើប្រាស់
          </Button>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            ឬ <a href="/register">ចុះឈ្មោះឥឡូវនេះ!</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
