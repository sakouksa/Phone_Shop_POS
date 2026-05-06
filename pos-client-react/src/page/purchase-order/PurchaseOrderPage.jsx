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
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";

import { CiEdit } from "react-icons/ci";
import { RiSave3Fill } from "react-icons/ri";
import {
  SearchOutlined,
  ExclamationCircleFilled,
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

import { request } from "../../util/request";
import { dateClient } from "../../util/helper";
import MainPage from "../../components/layout/MainPage";
import { usePaginationStore } from "../../store/usePaginationStore";
import dayjs from "dayjs";

const { Text } = Typography;

function PurchaseOrderPage() {
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    suppliers: [],
    payment_method: [],
    users: [],
    loading: false,
    open: false,
  });

  // Pagination Store
  const { pagination, setPagination, resetPagination } = usePaginationStore();

  const [filter, setFilter] = useState({
    text_search: "",
    supplier_id: "",
    payment_method_id: "",
    status: "",
  });

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (currentFilter = pagination) => {
    setState((pre) => ({ ...pre, loading: true }));

    let query_param = `?page=${currentFilter.page}&limit=${currentFilter.limit}`;

    if (filter.text_search) {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.supplier_id) {
      query_param += "&supplier_id=" + filter.supplier_id;
    }
    if (filter.status) {
      query_param += "&status=" + filter.status;
    }

    const res = await request("purchase-orders" + query_param, "get");

    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ 500!");
      setState((pre) => ({ ...pre, loading: false }));
      return;
    }

    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list?.data || res.list || [],
        suppliers: res.supplier || [],
        users: res.user || [],
        payment_method: res.payment_method || [],
        loading: false,
      }));
      setPagination({
        total: res.list?.total || res.total || res.list?.length || 0,
      });
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
    let url = "purchase-orders";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const payload = {
      ...item,
      created_by_id: item.created_by_id || 1,
      order_date: item.order_date
        ? dayjs(item.order_date).format("YYYY-MM-DD")
        : null,
      expected_delivery_date: item.expected_delivery_date
        ? dayjs(item.expected_delivery_date).format("YYYY-MM-DD")
        : null,
      items: item.items || [],
    };

    const res = await request(url, method, payload);
    if (res && !res.errors && res.status !== 500) {
      message.success(res.message || "រក្សាទុកបានជោគជ័យ!");
      handleCloseModal();
      getList();
    } else {
      setValidate(res.errors || {});
      message.error(res?.message || "ប្រតិបត្តិការបរាជ័យ!");
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "ការបញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: "តើអ្នកពិតជាចង់លុបការបញ្ជាទិញនេះមែនដែរឬទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      closable:true,
      onOk: async () => {
        const res = await request(`purchase-orders/${data.id}`, "delete");
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
    formRef.setFieldsValue({
      ...data,
      order_date: data.order_date ? dayjs(data.order_date) : null,
      expected_delivery_date: data.expected_delivery_date
        ? dayjs(data.expected_delivery_date)
        : null,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    setPagination({ page: 1 });
    getList({ ...pagination, page: 1 });
  };

  const handleReset = () => {
    resetPagination();
    const resetFilter = {
      text_search: "",
      supplier_id: "",
      payment_method_id: "",
      status: "",
    };
    setFilter(resetFilter);
    getList({ page: 1, limit: 10 });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize });
    getList({ page, limit: pageSize });
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        {/* Card Header & Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2">
                បញ្ជីគ្រប់គ្រងការបញ្ជាទិញ (PO)
                <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit">
                  ទិន្នន័យសរុប: {pagination.total || 0}
                </span>
              </h2>
              <Text type="secondary" className="text-sm dark:text-gray-400">
                គ្រប់គ្រងការបញ្ជាទិញ និងទិន្នន័យពាក់ព័ន្ធរបស់អ្នកនៅទីនេះ
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

          <div className="border-t border-gray-100 pt-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input
                allowClear
                value={filter.text_search}
                onChange={(e) =>
                  setFilter((p) => ({ ...p, text_search: e.target.value }))
                }
                placeholder="ស្វែងរកលេខកូដ PO..."
                onPressEnter={handleFilter}
                prefix={
                  <SearchOutlined className="text-gray-400 dark:text-gray-500 mr-2" />
                }
                style={{ width: 220 }}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Select
                  allowClear
                  placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់"
                  style={{ width: 180 }}
                  value={filter.supplier_id || undefined}
                  onChange={(val) =>
                    setFilter((p) => ({ ...p, supplier_id: val }))
                  }
                  options={state.suppliers.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                />

                <Select
                  allowClear
                  placeholder="ជ្រើសរើសស្ថានភាព"
                  style={{ width: 160 }}
                  value={filter.status || undefined}
                  onChange={(val) => setFilter((p) => ({ ...p, status: val }))}
                  options={[
                    { label: "ទាំងអស់", value: "" },
                    { label: "រង់ចាំ", value: "pending" },
                    { label: "បានបញ្ចប់", value: "completed" },
                    { label: "បានលុបចោល", value: "cancelled" },
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

        {/* Modal Section */}
        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែការបញ្ជាទិញ"
              : "បង្កើតការបញ្ជាទិញថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={800}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name="created_by_id"
              initialValue={1}
              style={{ display: "none" }}
            >
              <Input />
            </Form.Item>

            <div className="flex flex-col gap-1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="លេខកូដ PO"
                    name="po_number"
                    {...validate.po_number}
                  >
                    <Input placeholder="ស្វ័យប្រវត្តិ ប្រសិនបើទុកទទេ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="អ្នកផ្គត់ផ្គង់"
                    name="supplier_id"
                    rules={[
                      { required: true, message: "សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់!" },
                    ]}
                  >
                    <Select
                      placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់"
                      options={state.suppliers.map((s) => ({
                        label: s.name,
                        value: s.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="ថ្ងៃបញ្ជាទិញ"
                    name="order_date"
                    rules={[
                      { required: true, message: "សូមជ្រើសរើសថ្ងៃបញ្ជាទិញ!" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="ថ្ងៃរំពឹងថានឹងមកដល់"
                    name="expected_delivery_date"
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="សរុប (មុនពន្ធ/សេវា)"
                    name="sub_total"
                    rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃ!" }]}
                  >
                    <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="ថ្លៃដឹកជញ្ជូន" name="shipping_cost">
                    <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="អត្រាពន្ធ (%)" name="tax_rate">
                    <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ចំនួនទឹកប្រាក់ពន្ធ" name="tax_amount">
                    <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="តម្លៃសរុបចុងក្រោយ"
                    name="grand_total"
                    rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃ!" }]}
                  >
                    <InputNumber style={{ width: "100%" }} placeholder="0.00" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="ស្ថានភាពទូទាត់"
                    name="payment_status"
                    initialValue="unpaid"
                  >
                    <Select
                      options={[
                        { label: "បានទូទាត់", value: "paid" },
                        { label: "មិនទាន់ទូទាត់", value: "unpaid" },
                        { label: "ទូទាត់ខ្លះៗ", value: "partial" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="វិធីសាស្រ្តទូទាត់"
                    name="payment_method_id"
                    rules={[
                      {
                        required: true,
                        message: "សូមជ្រើសរើសវិធីសាស្រ្តទូទាត់!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="ជ្រើសរើសវិធីសាស្រ្តទូទាត់"
                      options={state.payment_method?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="ស្ថានភាព"
                    name="status"
                    initialValue="pending"
                  >
                    <Select
                      options={[
                        { label: "រង់ចាំ", value: "pending" },
                        { label: "បានបញ្ចប់", value: "completed" },
                        { label: "បានលុបចោល", value: "cancelled" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="កំណត់សម្គាល់" name="notes">
                    <Input.TextArea placeholder="កំណត់សម្គាល់បន្ថែម..." />
                  </Form.Item>
                </Col>
              </Row>
            </div>

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

        {/* Table Section */}
        <Table
          dataSource={state.list}
          scroll={{ x: 1200 }}
          pagination={false}
          columns={[
            { title: "លេខកូដ PO", dataIndex: "po_number", key: "po_number" },
            {
              title: "អ្នកផ្គត់ផ្គង់",
              dataIndex: ["supplier", "name"],
              key: "supplier",
            },
            {
              title: "តម្លៃសរុប",
              dataIndex: "grand_total",
              key: "grand_total",
            },
            {
              title: "ស្ថានភាពទូទាត់",
              dataIndex: "payment_status",
              key: "payment_status",
              align: "center",
              render: (val) => {
                let color = "red";
                if (val === "paid") color = "green";
                if (val === "partial") color = "orange";
                return (
                  <Tag
                    bordered={false}
                    color={color}
                    style={{ fontWeight: 500, borderRadius: 4 }}
                  >
                    {val}
                  </Tag>
                );
              },
            },
            {
              title: "ស្ថានភាព PO",
              dataIndex: "status",
              key: "status",
              align: "center",
              render: (val) => {
                let color = "blue";
                if (val === "completed") color = "green";
                if (val === "cancelled") color = "red";
                return (
                  <Tag
                    bordered={false}
                    color={color}
                    style={{ fontWeight: 500, borderRadius: 4 }}
                  >
                    {val}
                  </Tag>
                );
              },
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

        {/* Pagination Footer */}
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
  );
}

export default PurchaseOrderPage;
