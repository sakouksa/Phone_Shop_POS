import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { request } from "../../util/request";
import { AiOutlinePlus } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { CiEdit } from "react-icons/ci";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";

function SubCategoryPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    categories: [], // សម្រាប់ទុកបញ្ជីប្រភេទមេ
    loading: false,
    open: false,
  });
  const [filter, setFilter] = useState({
    text_search: "",
    category_id: "",
    status: "",
  });
  const [validate, setValidate] = useState({});

  useEffect(() => {
    getlist();
    getCategory(); // ទាញយកប្រភេទមេទុកក្នុង Select
  }, []);

  const getCategory = async () => {
    const res = await request("categories", "get");
    if (res) setState((p) => ({ ...p, categories: res.list || [] }));
  };

  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (filter.text_search) query_param += "&text_search=" + filter.text_search;
    if (filter.category_id) query_param += "&category_id=" + filter.category_id;
    if (filter.status !== "" && filter.status !== null)
      query_param += "&status=" + filter.status;

    const res = await request("sub-categories" + query_param, "get");
    if (res && !res.errors) {
      setState((pre) => ({ ...pre, list: res.list || [], loading: false }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };

  const onFinish = async (values) => {
    let url = "sub-categories";
    let method = "post";
    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }
    const res = await request(url, method, values);
    if (res && !res.errors) {
      message.success("ជោគជ័យ!");
      setState((p) => ({ ...p, open: false }));
      formRef.resetFields();
      getlist();
    } else {
      setValidate(res.errors || {});
      message.error("បរាជ័យ!");
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="main-page-header">
        <Space wrap>
          <Input.Search
            placeholder="ស្វែងរកឈ្មោះ..."
            onChange={(e) =>
              setFilter((p) => ({ ...p, text_search: e.target.value }))
            }
          />
          <Select
            placeholder="ប្រភេទមេ"
            style={{ width: 150 }}
            allowClear
            onChange={(val) => setFilter((p) => ({ ...p, category_id: val }))}
            options={state.categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
          <Button type="primary" onClick={getlist} icon={<SearchOutlined />}>
            ស្វែងរក
          </Button>
        </Space>
        <Button
          type="primary"
          onClick={() => setState((p) => ({ ...p, open: true }))}
          icon={<AiOutlinePlus />}
        >
          បង្កើតថ្មី
        </Button>
      </div>

      <Modal
        title={
          formRef.getFieldValue("id")
            ? "កែប្រែប្រភេទកូន"
            : "បង្កើតប្រភេទកូនថ្មី"
        }
        open={state.open}
        onCancel={() => {
          setState((p) => ({ ...p, open: false }));
          formRef.resetFields();
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            label="ជ្រើសរើសប្រភេទមេ"
            name="category_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="ជ្រើសរើសប្រភេទមេ"
              options={state.categories.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="ឈ្មោះប្រភេទកូន"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះ" />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input placeholder="បញ្ចូល slug" />
          </Form.Item>
          <Form.Item label="ស្ថានភាព" name="status" initialValue={1}>
            <Select
              options={[
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setState((p) => ({ ...p, open: false }))}>
                បោះបង់
              </Button>
              <Button type="primary" htmlType="submit">
                រក្សាទុក
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={state.list}
        columns={[
          { title: "ឈ្មោះ", dataIndex: "name" },
          {
            title: "ប្រភេទមេ",
            dataIndex: "category",
            render: (cat) => cat?.name || "N/A",
          },
          {
            title: "ស្ថានភាព",
            dataIndex: "status",
            render: (v) =>
              v ? (
                <Tag color="green">សកម្ម</Tag>
              ) : (
                <Tag color="red">អសកម្ម</Tag>
              ),
          },
          {
            title: "សកម្មភាព",
            render: (data) => (
              <Space>
                <Button
                  type="text"
                  onClick={() => {
                    formRef.setFieldsValue(data);
                    setState((p) => ({ ...p, open: true }));
                  }}
                  icon={<CiEdit />}
                />
                <Button type="text" danger icon={<MdDelete />} />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
export default SubCategoryPage;
