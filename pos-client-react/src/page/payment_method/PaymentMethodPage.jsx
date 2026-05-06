import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  Pagination,
} from "antd";

import { CiEdit } from "react-icons/ci";
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
import config from "../../util/config";
import UploadButton from "../../components/button/UploadButton";
import { usePreviewStore } from "../../store/previewStore";

const { Text } = Typography;

function PaymentMethodPage() {
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    loading: false,
    open: false,
  });

  const [fileList, setFileList] = useState([]);

  const { pagination, setPagination, resetPagination } = usePaginationStore();

  // calling Zustand Store
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore();

  // function handlePreview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    handleOpenPreview(file.url || file.preview);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const res = await request("payment-methods" + query_param, "get", {});
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
    setFileList([]);
    setValidate({});
  };

  const onFinish = async (item) => {
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("account_number", item.account_number || "");
    formData.append("status", item.status || "active");

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("qr_code", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      let qr_remove = formRef.getFieldValue("qr_code");
      if (qr_remove) {
        formData.append("qr_remove", qr_remove);
      }
    }

    let url = "payment-methods";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      formData.append("_method", "PUT");
    }

    const res = await request(url, method, formData);
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
      title: "ការបញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: "តើអ្នកប្រាកដជាចង់លុបវិធីសាស្ត្រទូទាត់នេះមែនទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      closable: true,
      onOk: async () => {
        const res = await request(`payment-methods/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
        } else {
          message.error(
            res?.message || "មានបញ្ហាក្នុងការលុបវិធីសាស្ត្រទូទាត់នេះ!",
          );
        }
      },
    });
  };

  const handleEdit = (data) => {
    if (data.qr_code) {
      setFileList([
        {
          uid: data.id,
          name: data.qr_code,
          status: "done",
          url: config.image_path + data.qr_code,
        },
      ]);
    }
    formRef.setFieldsValue({
      ...data,
    });
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
                  បញ្ជីគ្រប់គ្រងវិធីសាស្ត្រទូទាត់
                  <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit">
                    វិធីសាស្ត្រសរុប: {pagination.total || 0}
                  </span>
                </h2>
                <Text type="secondary" className="text-sm dark:text-gray-400">
                  គ្រប់គ្រងវិធីសាស្ត្រទូទាត់ និងទិន្នន័យពាក់ព័ន្ធរបស់អ្នកនៅទីនេះ
                </Text>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  type="primary"
                  onClick={handleOpenModal}
                  icon={<PlusOutlined />}
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all"
                >
                  វិធីសាស្ត្រថ្មី
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Input
                  allowClear
                  value={pagination.txt_search || ""}
                  onChange={(e) => setPagination({ txt_search: e.target.value })}
                  placeholder="ស្វែងរកវិធីសាស្ត្រទូទាត់..."
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
              formRef.getFieldValue("id")
                ? "កែប្រែវិធីសាស្ត្រទូទាត់"
                : "បង្កើតវិធីសាស្ត្រទូទាត់ថ្មី"
            }
            open={state.open}
            onCancel={handleCloseModal}
            centered
            width={600}
            footer={null}
            maskClosable={false}
          >
            <Form layout="vertical" onFinish={onFinish} form={formRef}>
              <Form.Item name="id" style={{ display: "none" }}>
                <Input />
              </Form.Item>

              <Form.Item
                label="ឈ្មោះវិធីសាស្ត្រ"
                name="name"
                {...validate.name}
                rules={[
                  { required: true, message: "សូមបញ្ចូលឈ្មោះវិធីសាស្ត្រ!" },
                ]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះវិធីសាស្ត្រ (ឧ. ABA, Wing...)" />
              </Form.Item>

              <Form.Item
                label="លេខគណនី"
                name="account_number"
                {...validate.account_number}
              >
                <Input placeholder="បញ្ចូលលេខគណនី (បើសិនមាន)" />
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

              <Form.Item label="រូបភាព QR Code" {...validate.qr_code}>
                <Upload
                  customRequest={(e) => e.onSuccess("ok")}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={({ fileList }) => setFileList(fileList)}
                  maxCount={1}
                >
                  <UploadButton />
                </Upload>
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: open,
                    onVisibleChange: (visible) => {
                      if (!visible) handleClosePreview();
                    },
                    src: imgUrl,
                  }}
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
                    {formRef.getFieldValue("id") ? "កែប្រែ" : "រក្សាទុក"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            dataSource={state.list}
            rowKey="id"
            scroll={{ x: 800 }}
            pagination={false}
            columns={[
              { title: "ឈ្មោះវិធីសាស្ត្រ", dataIndex: "name", key: "name" },
              {
                title: "លេខគណនី",
                dataIndex: "account_number",
                key: "account_number",
              },
              {
                title: "QR Code",
                dataIndex: "qr_code",
                key: "qr_code",
                render: (qr_code) =>
                  qr_code ? (
                    <Image
                      src={config.image_path + qr_code}
                      width={50}
                      style={{ borderRadius: "4px" }}
                    />
                  ) : (
                    <div style={{ color: "#ccc" }}>គ្មានរូបភាព</div>
                  ),
              },
              {
                title: "ស្ថានភាព",
                dataIndex: "status",
                key: "status",
                align: "center",
                render: (value) => {
                  const isActive = value === "active" || value === 1;
                  return (
                    <Tag
                      bordered={false}
                      color={isActive ? "green" : "red"}
                      style={{ fontWeight: 500, borderRadius: 4 }}
                    >
                      {isActive ? "សកម្ម" : "អសកម្ម"}
                    </Tag>
                  );
                },
              },
              {
                title: "កាលបរិច្ឆេទបង្កើត",
                dataIndex: "created_at",
                key: "created_at",
                render: (value) => dateClient(value),
              },
              {
                title: "សកម្មភាព",
                align: "center",
                render: (_, data) => (
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

export default PaymentMethodPage;