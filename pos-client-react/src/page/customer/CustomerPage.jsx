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
  Typography,
  Pagination,
} from "antd";

import { CiEdit } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import {
  SearchOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

import { request } from "../../util/request";
import { dateClient } from "../../util/helper";
import { usePaginationStore } from "../../store/usePaginationStore";
import MainPage from "../../components/layout/MainPage";

const { Text } = Typography;

function CustomerPage() {
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    loading: false,
    open: false,
  });

  const { pagination, setPagination, resetPagination } = usePaginationStore();

  useEffect(() => {
    getList();
  }, []);

  const getList = async (currentFilter = pagination) => {
    setState((pre) => ({ ...pre, loading: true }));

    let query_param = `?page=${currentFilter.page}&limit=${currentFilter.limit}`;
    if (currentFilter.txt_search !== "" && currentFilter.txt_search !== null) {
      query_param += "&txt_search=" + currentFilter.txt_search;
    }
    if (currentFilter.status !== "" && currentFilter.status !== null) {
      query_param += "&status=" + currentFilter.status;
    }

    const res = await request("customers" + query_param, "get");
    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ 500!");
      setState((pre) => ({ ...pre, loading: false }));
      return;
    }

    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list || [],
        loading: false,
      }));
      setPagination({ total: res.total || res.list?.length || 0 });
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
    let url = "customers";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, item);
    if (res && !res.errors) {
      message.success(res.message || "ជោគជ័យ!");
      handleCloseModal();
      getList();
    } else {
      setValidate(res.errors || {});
      message.error(res?.message || "ប្រតិបត្តិការបរាជ័យ!");
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "បញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: "តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនដែរឬទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      closeIcon: true,
      onOk: async () => {
        const res = await request(`customers/${data.id}`, "delete");
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
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
    setPagination({ page: 1 });
    getList({ ...pagination, page: 1 });
  };

  const handleReset = async () => {
    resetPagination();
    getList({ page: 1, limit: 10, txt_search: "", status: null });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize });
    getList({ ...pagination, page, limit: pageSize });
  };

  return (
    <>
      <MainPage loading={state.loading}>
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2">
                  បញ្ជីគ្រប់គ្រងអតិថិជន
                  <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit">
                    អតិថិជនសរុប: {pagination.total || 0}
                  </span>
                </h2>
                <Text type="secondary" className="text-sm dark:text-gray-400">
                  គ្រប់គ្រងព័ត៌មានអតិថិជនរបស់អ្នកនៅទីនេះ
                </Text>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  type="primary"
                  onClick={handleOpenModal}
                  icon={<PlusOutlined />}
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all"
                >
                  បង្កើតថ្មី
                </Button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Input
                  allowClear
                  value={pagination.txt_search}
                  onChange={(e) => setPagination({ txt_search: e.target.value })}
                  placeholder="ស្វែងរកអតិថិជន..."
                  onPressEnter={handleFilter}
                  prefix={
                    <SearchOutlined className="text-gray-400 dark:text-gray-500 mr-2" />
                  }
                  style={{ width: 220 }}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    allowClear
                    placeholder="ជ្រើសរើសស្ថានភាព"
                    style={{ width: 160 }}
                    value={pagination.status}
                    onChange={(value) => setPagination({ status: value })}
                    options={[
                      { label: "សកម្ម", value: "active" },
                      { label: "អសកម្ម", value: "inactive" },
                    ]}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="default"
                      onClick={handleReset}
                      icon={<ReloadOutlined />}
                      className="px-3 flex items-center hover:text-indigo-600"
                    >
                      កំណត់ឡើងវិញ
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleFilter}
                      icon={<FilterOutlined />}
                      className="px-3 flex items-center bg-indigo-600 border-0 hover:bg-indigo-700"
                    >
                      តម្រងទិន្នន័យ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            title={
              formRef.getFieldValue("id") ? "កែប្រែអតិថិជន" : "បង្កើតអតិថិជនថ្មី"
            }
            open={state.open}
            onCancel={handleCloseModal}
            centered
            footer={null}
            width={600}
          >
            <Form layout="vertical" onFinish={onFinish} form={formRef}>
              <Form.Item name="id" style={{ display: "none" }}>
                <Input />
              </Form.Item>

              <Form.Item
                label="ឈ្មោះ"
                name="name"
                {...validate.name}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអតិថិជន!" }]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះ" />
              </Form.Item>

              <Form.Item
                label="លេខទូរស័ព្ទ"
                name="phone"
                {...validate.phone}
                rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
              >
                <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
              </Form.Item>

              <Form.Item label="អ៊ីមែល (Email)" name="email" {...validate.email}>
                <Input placeholder="បញ្ចូលអ៊ីមែល" />
              </Form.Item>

              <Form.Item label="អាសយដ្ឋាន" name="address" {...validate.address}>
                <Input.TextArea placeholder="បញ្ចូលអាសយដ្ឋាន" rows={2} />
              </Form.Item>

              <Form.Item label="ពិន្ទុ (Points)" name="points" initialValue={0} {...validate.points}>
                <Input type="number" placeholder="បញ្ចូលពិន្ទុ" />
              </Form.Item>

              <Form.Item label="ស្ថានភាព" name="status" initialValue="active">
                <Select
                  placeholder="ជ្រើសរើសស្ថានភាព"
                  options={[
                    { label: "សកម្ម", value: "active" },
                    { label: "អសកម្ម", value: "inactive" },
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
            dataSource={state.list}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={false}
            columns={[
              { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
              { title: "លេខទូរស័ព្ទ", dataIndex: "phone", key: "phone" },
              { title: "អ៊ីមែល", dataIndex: "email", key: "email" },
              { title: "ពិន្ទុ", dataIndex: "points", key: "points" },
              {
                title: "ស្ថានភាព",
                dataIndex: "status",
                key: "status",
                render: (val) =>
                  val === "active" ? (
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
          <div className="flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5">
            <span className="text-gray-600 text-sm">
              សរុប: <b className="text-indigo-600">{pagination.total || 0}</b>{" "}
              ទិន្នន័យ
            </span>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50", "100"]}
              showTotal={(total, range) => `${range[0]}-${range[1]} នៃ ${total}`}
              className="ant-pagination-custom"
            />
          </div>
        </div>
      </MainPage>
    </>
  );
}

export default CustomerPage;