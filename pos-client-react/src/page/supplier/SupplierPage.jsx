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
import { useNavigate } from "react-router-dom";
import MainPage from "../../components/layout/MainPage";

function SupplierPage() {
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

    let query_param = "?page=1";
    if (filter.text_search !== "" && filter.text_search !== null) {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== "" && filter.status !== null) {
      query_param += "&status=" + filter.status;
    }

    const res = await request("suppliers" + query_param, "get");
    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ!");
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

  const onFinish = async (item) => {
    let url = "suppliers";
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
        const res = await request(`suppliers/${data.id}`, "delete");
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
      <MainPage>
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-5 w-full">
          {/* Section: Search and Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
              អ្នកផ្គត់ផ្គង់សរុប: {state.list.length}
            </span>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Input.Search
                allowClear
                onChange={(e) =>
                  setFilter((p) => ({ ...p, text_search: e.target.value }))
                }
                placeholder="ស្វែងរកអ្នកផ្គត់ផ្គង់..."
                className="w-full sm:w-64 md:w-72"
              />
              <Select
                allowClear
                placeholder="ជ្រើសរើសស្ថានភាព"
                style={{ width: 160 }}
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                ស្វែងរក
              </Button>
            </div>
          </div>

          {/* Section: Create New Button */}
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<AiOutlinePlus />}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            បង្កើតថ្មី
          </Button>
        </div>

        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែអ្នកផ្គត់ផ្គង់"
              : "បង្កើតអ្នកផ្គត់ផ្គង់ថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          footer={null}
          width={600}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះអ្នកផ្គត់ផ្គង់"
              name="name"
              {...validate.name}
              rules={[
                { required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកផ្គត់ផ្គង់!" },
              ]}
            >
              <Input placeholder="បញ្ចូលឈ្មោះអ្នកផ្គត់ផ្គង់" />
            </Form.Item>

            <Form.Item
              label="អ្នកទំនាក់ទំនង"
              name="contact_person"
              {...validate.contact_person}
            >
              <Input placeholder="បញ្ចូលឈ្មោះអ្នកទំនាក់ទំនង" />
            </Form.Item>

            <Form.Item label="លេខទូរស័ព្ទ" name="phone" {...validate.phone}>
              <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
            </Form.Item>

            <Form.Item label="អ៊ីម៉ែល" name="email" {...validate.email}>
              <Input placeholder="បញ្ចូលអ៊ីម៉ែល" />
            </Form.Item>

            <Form.Item label="អាសយដ្ឋាន" name="address" {...validate.address}>
              <Input.TextArea placeholder="បញ្ចូលអាសយដ្ឋាន" rows={2} />
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

        <div className="w-full overflow-x-auto shadow-sm border border-gray-100 rounded-lg bg-white p-2">
          <Table
            loading={state.loading}
            dataSource={state.list}
            scroll={{ x: 900 }}
            columns={[
              { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
              {
                title: "អ្នកទំនាក់ទំនង",
                dataIndex: "contact_person",
                key: "contact_person",
              },
              { title: "លេខទូរស័ព្ទ", dataIndex: "phone", key: "phone" },
              { title: "អ៊ីម៉ែល", dataIndex: "email", key: "email" },
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
                      icon={
                        <CiEdit style={{ fontSize: 18, color: "#004EBC" }} />
                      }
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
        </div>
      </MainPage>
    </>
  );
}

export default SupplierPage;
