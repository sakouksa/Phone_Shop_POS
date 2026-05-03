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
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";
// Import icons
import { CiEdit } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import {
  SearchOutlined,
  ExclamationCircleFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

// Import utilities
import { request } from "../../util/request";
import { dateClient } from "../../util/helper";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // ប្រើ dayjs ជំនួស moment

function PurchaseOrderPage() {
  const navigate = useNavigate();
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    suppliers: [],
    users: [],
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    supplier_id: null,
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
    if (filter.supplier_id !== null) {
      query_param += "&supplier_id=" + filter.supplier_id;
    }
    if (filter.status !== "" && filter.status !== null) {
      query_param += "&status=" + filter.status;
    }

    const res = await request("purchase-orders" + query_param, "get");
    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ ៥០០!");
      return;
    }
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list?.data || res.list || [],
        suppliers: res.supplier || [],
        users: res.user || [],
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
    let url = "purchase-orders";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    // បម្លែងកាលបរិច្ឆេទឱ្យត្រូវទម្រង់ YYYY-MM-DD
    const payload = {
      ...item,
      order_date: item.order_date
        ? dayjs(item.order_date).format("YYYY-MM-DD")
        : null,
      expected_delivery_date: item.expected_delivery_date
        ? dayjs(item.expected_delivery_date).format("YYYY-MM-DD")
        : null,
      items: item.items || [],
    };

    const res = await request(url, method, payload);
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
      content: "តើអ្នកពិតជាចង់លុបការបញ្ជាទិញនេះមែនដែរឬទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`purchase-orders/${data.id}`, "delete");
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
    getlist();
  };

  return (
    <>
      <div className="main-page-header flex justify-between items-center mb-5">
        <Space wrap>
          <div>ការបញ្ជាទិញសរុប: {state.list.length}</div>
          <Input.Search
            allowClear
            onChange={(e) =>
              setFilter((p) => ({ ...p, text_search: e.target.value }))
            }
            placeholder="ស្វែងរកលេខកូដ PO..."
          />
          <Select
            allowClear
            placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់"
            style={{ width: 180 }}
            onChange={(val) => setFilter((p) => ({ ...p, supplier_id: val }))}
            options={state.suppliers.map((s) => ({
              label: s.name,
              value: s.id,
            }))}
          />
          <Select
            allowClear
            placeholder="ជ្រើសរើសស្ថានភាព"
            style={{ width: 160 }}
            onChange={(val) => setFilter((p) => ({ ...p, status: val }))}
            options={[
              { label: "ទាំងអស់", value: null },
              { label: "រង់ចាំ", value: "pending" },
              { label: "បានបញ្ចប់", value: "completed" },
              { label: "បានលុបចោល", value: "cancelled" },
            ]}
          />
          <Button
            type="primary"
            onClick={handleFilter}
            icon={<FilterOutlined />}
          >
            តម្រង
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
          formRef.getFieldValue("id")
            ? "កែប្រែការបញ្ជាทិញ"
            : "បង្កើតការបញ្ជាទិញថ្មី"
        }
        open={state.open}
        onCancel={handleCloseModal}
        centered
        footer={null}
        width={800}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
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
              <Form.Item label="វិធីសាស្ត្រទូទាត់" name="payment_method">
                <Input placeholder="ឧ. ABA, Cash, Wing" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ស្ថានភាព" name="status" initialValue="pending">
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
        scroll={{ x: 1200 }}
        columns={[
          { title: "លេខកូដ PO", dataIndex: "po_number", key: "po_number" },
          {
            title: "អ្នកផ្គត់ផ្គង់",
            dataIndex: ["supplier", "name"],
            key: "supplier",
          },
          { title: "តម្លៃសរុប", dataIndex: "grand_total", key: "grand_total" },
          {
            title: "ស្ថានភាពទូទាត់",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (val) => {
              let color = "red";
              if (val === "paid") color = "green";
              if (val === "partial") color = "orange";
              return <Tag color={color}>{val}</Tag>;
            },
          },
          {
            title: "ស្ថានភាព PO",
            dataIndex: "status",
            key: "status",
            render: (val) => {
              let color = "blue";
              if (val === "completed") color = "green";
              if (val === "cancelled") color = "red";
              return <Tag color={color}>{val}</Tag>;
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
    </>
  );
}

export default PurchaseOrderPage;
