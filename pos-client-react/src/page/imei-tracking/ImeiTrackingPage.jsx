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

import { CiEdit } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

import { request } from "../../util/request";
import { dateClient } from "../../util/helper";

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
    total: 0,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: null,
    status: null,
    product_id: null,
    supplier_id: null,
    purchase_id: null,
    sale_id: null,
  });

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (param_filter) => {
    const current_filter = {
      ...filter,
      ...param_filter,
    };

    setState((pre) => ({ ...pre, loading: true }));

    let query_param = "?page=1";
    if (
      current_filter.text_search !== null &&
      current_filter.text_search !== ""
    ) {
      query_param += "&text_search=" + current_filter.text_search;
    }
    if (current_filter.status !== null && current_filter.status !== "") {
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
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ ៥០០!");
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
        total: res.list?.length || 0,
        loading: false,
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
      title: "Confirm Deletion",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: (
        <div>
          Are you sure you want to delete the imei
          <b>"{data.imei_number}"</b>?
          <p style={{ color: "#8c8c8c", fontSize: "12px", marginTop: "8px" }}>
            * This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        setState((pre) => ({ ...pre, loading: true }));
        const res = await request(`imei-trackings/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "Delete Success!");
          getList();
        } else {
          setState((pre) => ({ ...pre, loading: false }));
          message.error(res?.message || "Failed to delete!");
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
    getList();
  };

  const handleReset = () => {
    const data = {
      text_search: null,
      status: null,
      product_id: null,
      supplier_id: null,
      purchase_id: null,
      sale_id: null,
    };
    setFilter(data);
    getList(data);
  };

  return (
    <>
      <div
        className="main-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          <div>សរុប: {state.list.length}</div>
          <Input.Search
            allowClear
            value={filter.text_search || ""}
            onChange={(e) =>
              setFilter((p) => ({ ...p, text_search: e.target.value }))
            }
            placeholder="ស្វែងរកលេខ IMEI..."
            style={{ width: 220 }}
          />
          <Select
            allowClear
            placeholder="ជ្រើសរើសស្ថានភាព"
            style={{ width: 160 }}
            value={filter.status}
            onChange={(val) => setFilter((p) => ({ ...p, status: val }))}
            options={[
              { label: "ទាំងអស់", value: null },
              { label: "អាចលក់បាន", value: "available" },
              { label: "បានលក់", value: "sold" },
              { label: "កំពុងជួសជុល", value: "repair" },
              { label: "ទិញ-លក់បន្ត", value: "trade_in" },
            ]}
          />
          <Select
            allowClear
            placeholder="ជ្រើសរើសផលិតផល"
            style={{ width: 160 }}
            value={filter.product_id}
            onChange={(value) => {
              setFilter((p) => ({
                ...p,
                product_id: value,
              }));
            }}
            options={state.product?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
          <Button
            type="primary"
            onClick={handleFilter}
            icon={<SearchOutlined />}
          >
            ស្វែងរក
          </Button>
          <Button onClick={handleReset}>សម្អាត</Button>
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
            ? "កែប្រែទិន្នន័យ IMEI"
            : "បង្កើត IMEI ថ្មី"
        }
        open={state.open}
        onCancel={handleCloseModal}
        centered
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
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
            rules={[{ required: true, message: "សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់!" }]}
          >
            <Select
              placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់"
              options={
                Array.isArray(state.supplier)
                  ? state.supplier.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label="Purchase ID"
            name="purchase_id"
            {...validate.purchase_id}
          >
            <Select
              placeholder="ជ្រើសរើស Purchase ID"
              allowClear
              options={
                Array.isArray(state.purchase)
                  ? state.purchase.map((p) => ({
                      label: `PO៖ ${p.po_number || p.id}`,
                      value: p.id,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item label="Sale ID" name="sale_id" {...validate.sale_id}>
            <Select
              placeholder="ជ្រើសរើស Sale ID"
              allowClear
              options={
                Array.isArray(state.sale)
                  ? state.sale.map((s) => ({
                      label: `វិក្កយបត្រ៖ ${s.id}`,
                      value: s.id,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item label="ស្ថានភាព" name="status" initialValue="available">
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
        rowKey="id"
        scroll={{ x: 1000 }}
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
                <Tag color={colorMap[val] || "default"}>
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
    </>
  );
}

export default ImeiTrackingPage;
