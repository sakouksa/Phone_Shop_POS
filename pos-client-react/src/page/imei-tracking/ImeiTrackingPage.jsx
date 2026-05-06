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

const { Text } = Typography;

function ImeiTrackingPage() {
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});

  const [state, setState] = useState({
    list: [],
    loading: false,
    product: [],
    supplier: [],
    purchase: [],
    sale: [],
    open: false,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
    product_id: "",
    supplier_id: "",
    purchase_id: "",
    sale_id: "",
  });

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (param_filter = {}) => {
    const current_filter = {
      ...filter,
      ...param_filter,
    };

    setState((pre) => ({ ...pre, loading: true }));

    let query_param = `?page=${pagination.page}&limit=${pagination.limit}`;
    if (current_filter.text_search) {
      query_param += "&text_search=" + current_filter.text_search;
    }
    if (current_filter.status) {
      query_param += "&status=" + current_filter.status;
    }
    if (current_filter.product_id) {
      query_param += "&product_id=" + current_filter.product_id;
    }
    if (current_filter.supplier_id) {
      query_param += "&supplier_id=" + current_filter.supplier_id;
    }
    if (current_filter.purchase_id) {
      query_param += "&purchase_id=" + current_filter.purchase_id;
    }
    if (current_filter.sale_id) {
      query_param += "&sale_id=" + current_filter.sale_id;
    }

    const res = await request("imei-trackings" + query_param, "get");

    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ 500!");
      setState((pre) => ({ ...pre, loading: false }));
      return;
    }

    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list || [],
        product: res.product || [],
        supplier: res.supplier || [],
        purchase: res.purchase || [],
        sale: res.sale || [],
        loading: false,
      }));
      setPagination((prev) => ({
        ...prev,
        total: res.total || res.list?.length || 0,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
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
    let url = "imei-trackings";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    setState((p) => ({ ...p, loading: true }));

    const res = await request(url, method, item);

    if (res && !res.errors) {
      message.success(res.message || "Success!");
      handleCloseModal();
      getList();
      setState((p) => ({ ...p, loading: false }));
    } else {
      setValidate(res.errors || {});
      message.error(res?.message || "Failed to perform action!");
      setState((p) => ({ ...p, loading: false }));
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "ការបញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: (
        <div>
          តើអ្នកពិតជាចង់លុបលេខ IMEI <b>"{data.imei_number}"</b> នេះមែនទេ?
          <p style={{ color: "#8c8c8c", fontSize: "12px", marginTop: "8px" }}>
            * សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។
          </p>
        </div>
      ),
      okText: "លុប",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      closable: true,
      onOk: async () => {
        setState((pre) => ({ ...pre, loading: true }));
        const res = await request(`imei-trackings/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
        } else {
          setState((pre) => ({ ...pre, loading: false }));
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    formRef.setFieldsValue({
      ...data,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    getList({ page: 1 });
  };

  const handleReset = () => {
    const data = {
      text_search: "",
      status: "",
      product_id: "",
      supplier_id: "",
      purchase_id: "",
      sale_id: "",
    };
    setFilter(data);
    setPagination({ page: 1, limit: 10, total: 0 });
    getList(data);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
    getList({ page, limit: pageSize });
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2">
                បញ្ជីគ្រប់គ្រង IMEI
                <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit">
                  ទិន្នន័យសរុប: {pagination.total || state.list.length || 0}
                </span>
              </h2>
              <Text type="secondary" className="text-sm dark:text-gray-400">
                គ្រប់គ្រងលេខ IMEI និងទិន្នន័យពាក់ព័ន្ធរបស់អ្នកនៅទីនេះ
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
                placeholder="ស្វែងរកលេខ IMEI..."
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
                  value={filter.status || undefined}
                  onChange={(val) => setFilter((p) => ({ ...p, status: val }))}
                  options={[
                    { label: "ទាំងអស់", value: "" },
                    { label: "អាចលក់បាន", value: "available" },
                    { label: "បានលក់", value: "sold" },
                    { label: "កំពុងជួសជុល", value: "repair" },
                    { label: "ទិញ-លក់បន្ត", value: "trade_in" },
                  ]}
                />

                <Select
                  allowClear
                  placeholder="ជ្រើសរើសផលិតផល"
                  style={{ width: 180 }}
                  value={filter.product_id || undefined}
                  onChange={(value) =>
                    setFilter((p) => ({ ...p, product_id: value }))
                  }
                  options={state.product?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
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
            formRef.getFieldValue("id")
              ? "កែប្រែទិន្នន័យ IMEI"
              : "បង្កើត IMEI ថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <div className="flex flex-col gap-1">
              <Form.Item
                label="លេខ IMEI"
                name="imei_number"
                {...validate.imei_number}
                rules={[{ required: true, message: "សូមបញ្ចូលលេខ IMEI!" }]}
              >
                <Input placeholder="បញ្ចូលលេខ IMEI" />
              </Form.Item>

              <Form.Item
                label="តម្លៃដើម"
                name="cost_price"
                {...validate.cost_price}
                rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃដើម!" }]}
              >
                <Input type="number" placeholder="បញ្ចូលតម្លៃដើម" />
              </Form.Item>

              <Form.Item
                label="ផលិតផល"
                name="product_id"
                {...validate.product_id}
                rules={[{ required: true, message: "សូមជ្រើសរើសផលិតផល!" }]}
              >
                <Select
                  placeholder="ជ្រើសរើសផលិតផល"
                  options={state.product?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="អ្នកផ្គត់ផ្គង់"
                name="supplier_id"
                {...validate.supplier_id}
                rules={[
                  { required: true, message: "សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់!" },
                ]}
              >
                <Select
                  placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់"
                  options={state.supplier?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="អ្នកទិញចូល"
                name="purchase_id"
                {...validate.purchase_id}
              >
                <Select
                  placeholder="ជ្រើសរើសអ្នកទិញចូល"
                  allowClear
                  options={state.purchase?.map((item) => ({
                    label: item.po_number || item.id,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="អ្នកលក់ចេញ"
                name="sale_id"
                {...validate.sale_id}
              >
                <Select
                  placeholder="ជ្រើសរើសអ្នកលក់ចេញ"
                  allowClear
                  options={state.sale?.map((item) => ({
                    label: item.invoice_number || item.id,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="ស្ថានភាព"
                name="status"
                initialValue="available"
              >
                <Select
                  placeholder="ជ្រើសរើសស្ថានភាព"
                  options={[
                    { label: "អាចលក់បាន", value: "available" },
                    { label: "បានលក់", value: "sold" },
                    { label: "កំពុងជួសជុល", value: "repair" },
                    { label: "ទិញ-លក់បន្ត", value: "trade_in" },
                  ]}
                />
              </Form.Item>
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

        <Table
          dataSource={state.list}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={false}
          columns={[
            {
              title: "លេខ IMEI",
              dataIndex: "imei_number",
              key: "imei_number",
            },
            {
              title: "តម្លៃដើម",
              dataIndex: "cost_price",
              key: "cost_price",
              render: (val) => `$${Number(val).toFixed(2)}`,
            },
            {
              title: "ឈ្មោះទំនិញ",
              dataIndex: ["product", "name"],
              key: "product_name",
              render: (val) => val || "មិនមាន",
            },
            {
              title: "អ្នកផ្គត់ផ្គង់",
              dataIndex: ["supplier", "name"],
              key: "supplier_name",
              render: (val) => val || "មិនមាន",
            },
            {
              title: "ស្ថានភាព",
              dataIndex: "status",
              key: "status",
              align: "center",
              render: (val) => {
                const colorMap = {
                  available: "green",
                  sold: "blue",
                  repair: "orange",
                  trade_in: "purple",
                };
                const labelMap = {
                  available: "អាចលក់បាន",
                  sold: "បានលក់",
                  repair: "កំពុងជួសជុល",
                  trade_in: "ទិញ-លក់បន្ត",
                };
                return (
                  <Tag
                    bordered={false}
                    color={colorMap[val] || "default"}
                    style={{ fontWeight: 500, borderRadius: 4 }}
                  >
                    {labelMap[val] || val}
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

export default ImeiTrackingPage;
