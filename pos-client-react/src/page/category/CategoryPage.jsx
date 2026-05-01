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
// Import icons
import { CiEdit } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

// Import utilities
import { request } from "../../util/request";
import { dateClient } from "../../util/helper";
import { useNavigate } from "react-router-dom"; // បន្ថែមនេះ

function CategoryPage() {
  const navigate = useNavigate();
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
  });

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));

    // រៀបចំ Query Params ដូច RolePage
    let query_param = "?page=1";
    if (filter.text_search !== "" && filter.text_search !== null) {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== "" && filter.status !== null) {
      query_param += "&status=" + filter.status;
    }

    const res = await request("categories" + query_param, "get");
    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ ៥០០!");
      return;
    }
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors.message);
      }
    }
  };

  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setValidate({});
  };
  //auto change slug
  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    const slugValue = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_") // បម្លែងអក្សរទៅជាតួអក្សរ និងលេខ និងប្តូរទៅជា "_"
      .replace(/(^-|-$)+/g, ""); /// លុប "_" នៅចុងក្រោយនិងចុងដើម
    formRef.setFieldsValue({
      name: nameValue,
      slug: slugValue,
    });
  };
  const onFinish = async (item) => {
    let url = "categories";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, item);
    if (res && !res.errors) {
      message.success(res.message || "ជោគជ័យ!");
      handleCloseModal();
      getlist();
    } else {
      setValidate(res.errors || {});
      message.error(res?.message || "ប្រតិបត្តិការបរាជ័យ!");
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "បញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: "តើអ្នកពិតជាចង់លុបមែនដែរឬទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`categories/${data.id}`, "delete");
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getlist();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    formRef.setFieldsValue({ ...data });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    getlist();
  };

  return (
    <>
      <div className="main-page-header">
        <Space>
          <div>ប្រភេទសរុប: {state.list.length}</div>
          <Input.Search
            allowClear
            onChange={(e) =>
              setFilter((p) => ({ ...p, text_search: e.target.value }))
            }
            placeholder="ស្វែងរកប្រភេទ..."
          />
          <Select
            allowClear
            placeholder="ជ្រើសរើសស្ថានភាព"
            style={{ width: 160 }}
            onChange={(val) => setFilter((p) => ({ ...p, status: val }))}
            options={[
              { label: "ទាំងអស់", value: null },
              { label: "សកម្ម", value: 1 },
              { label: "អសកម្ម", value: 0 },
            ]}
          />
          <Button
            type="primary"
            onClick={handleFilter}
            icon={<SearchOutlined />}
          >
            ស្វែងរក
          </Button>
        </Space>
        <Button
          type="primary"
          onClick={handleOpenModal}
          icon={<AiOutlinePlus />}
        >
          បង្កើតថ្មី
        </Button>
      </div>

      <Modal
        title={
          formRef.getFieldValue("id") ? "កែប្រែប្រភេទ" : "បង្កើតប្រភេទថ្មី"
        }
        open={state.open}
        onCancel={handleCloseModal}
        centered
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            label="ឈ្មោះប្រភេទ"
            name="name"
            {...validate.name}
            rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះប្រភេទ!" }]}
          >
            <Input
              placeholder="បញ្ចូលឈ្មោះប្រភេទ"
              onChange={handleNameChange}
            />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            {...validate.slug}
            rules={[{ required: true, message: "សូមបញ្ចូល slug!" }]}
          >
            <Input placeholder="បញ្ចូល slug" />
          </Form.Item>

          <Form.Item label="ស្ថានភាព" name="status" initialValue={1}>
            <Select
              placeholder="ជ្រើសរើសស្ថានភាព"
              options={[
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCloseModal}>បោះបង់</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={
                  formRef.getFieldValue("id") ? (
                    <BiSolidEditAlt />
                  ) : (
                    <RiSave3Fill />
                  )
                }
              >
                {formRef.getFieldValue("id")
                  ? "ធ្វើបច្ចុប្បន្នភាព"
                  : "រក្សាទុក"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        loading={state.loading}
        dataSource={state.list}
        scroll={{ x: 800 }}
        columns={[
          { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
          { title: "Slug", dataIndex: "slug", key: "slug" },
          {
            title: "ស្ថានភាព",
            dataIndex: "status",
            key: "status",
            render: (val) =>
              val ? (
                <Tag color="green">សកម្ម</Tag>
              ) : (
                <Tag color="red">អសកម្ម</Tag>
              ),
          },
          {
            title: "ថ្ងៃបង្កើត",
            dataIndex: "created_at",
            key: "created_at",
            render: (val) => dateClient(val),
          },
          {
            title: "សកម្មភាព",
            key: "action",
            align: "center",
            render: (data) => (
              <Space>
                <Button
                  type="text"
                  onClick={() => handleEdit(data)}
                  icon={<CiEdit style={{ fontSize: 18, color: "#004EBC" }} />}
                />
                <Button
                  type="text"
                  danger
                  onClick={() => handleDelete(data)}
                  icon={<MdDelete style={{ fontSize: 18 }} />}
                />
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}

export default CategoryPage;
