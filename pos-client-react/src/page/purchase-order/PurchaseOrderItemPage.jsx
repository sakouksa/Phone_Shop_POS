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

function PurchaseOrderItemPage() {
  const [formRef] = Form.useForm();
  const [validate, setValidate] = useState({});
  const [state, setState] = useState({
    list: [],
    purchaseOrders: [],
    products: [],
    loading: false,
    open: false,
  });

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));

    const res = await request("purchase-order-items", "get");
    if (res && res.status === 500) {
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ ៥០០!");
      return;
    }
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list || [],
        purchaseOrders: res.purchaseOrders || [],
        products: res.products || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
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
    let url = "purchase-order-items";
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
      content: "តើអ្នកពិតជាចង់លុបទំនិញនេះមែនដែរឬទេ?",
      okText: "លុบចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`purchase-order-items/${data.id}`, "delete");
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

  return (
    <>
      <div className="main-page-header flex justify-between items-center mb-5">
        <div>ទំនិញលម្អិតសរុប: {state.list.length}</div>
        <Button
          type="primary"
          onClick={handleOpenModal}
          icon={<AiOutlinePlus />}
        >
          បន្ថែមទំនិញ
        </Button>
      </div>

      <Modal
        title={
          formRef.getFieldValue("id")
            ? "កែប្រែទំនិញបញ្ជាទិញ"
            : "បន្ថែមទំនិញបញ្ជាទិញថ្មី"
        }
        open={state.open}
        onCancel={handleCloseModal}
        centered
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            label="ការបញ្ជាទិញ (PO)"
            name="purchase_order_id"
            {...validate.purchase_order_id}
            rules={[{ required: true, message: "សូមជ្រើសរើសការបញ្ជាទិញ!" }]}
          >
            <Select
              placeholder="ជ្រើសរើសលេខ PO"
              options={state.purchaseOrders.map((po) => ({
                label: po.po_number,
                value: po.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="ជ្រើសរើសទំនិញ"
            name="product_id"
            {...validate.product_id}
            rules={[{ required: true, message: "សូមជ្រើសរើសទំនិញ!" }]}
          >
            <Select
              placeholder="ជ្រើសរើសទំនិញ"
              options={state.products.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="ចំនួន"
            name="quantity"
            {...validate.quantity}
            rules={[{ required: true, message: "សូមបញ្ចូលចំនួន!" }]}
          >
            <Input type="number" placeholder="ចំនួន" />
          </Form.Item>

          <Form.Item
            label="តម្លៃក្នុងមួយឯកតា"
            name="unit_price"
            {...validate.unit_price}
            rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃ!" }]}
          >
            <Input type="number" placeholder="តម្លៃក្នុងមួយឯកតា" />
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
          {
            title: "លេខ PO",
            dataIndex: ["purchaseOrder", "po_number"],
            key: "po_number",
          },
          {
            title: "ឈ្មោះទំនិញ",
            dataIndex: ["product", "name"],
            key: "product_name",
          },
          { title: "ចំនួន", dataIndex: "quantity", key: "quantity" },
          { title: "តម្លៃ (ឯកតា)", dataIndex: "unit_price", key: "unit_price" },
          {
            title: "សរុប",
            dataIndex: "total_line_price",
            key: "total_line_price",
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

export default PurchaseOrderItemPage;