import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  Row,
  Switch,
  InputNumber,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { CiEdit } from "react-icons/ci";
import { RiSave3Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";

// Utils
import { request } from "../../util/request";
import config from "../../util/config";
import { usePreviewStore } from "../../store/previewStore";

// Components
import MainPage from "../../components/layout/MainPage";
import UploadButton from "../../components/button/UploadButton";
import { dateClient } from "../../util/helper";
function ProductPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    category: [],
    brand: [],
    sub_category: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    txt_search: null,
    status: null,
    category_id: null,
    brand_id: null,
    sub_category_id: null,
  });

  const [fileList, setFileList] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [validate, setValidate] = useState({});
  const [subCategoryList, setSubCategoryList] = useState([]);
  // call Zustand Store
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore();

  //  handlePreview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // ហៅ function ពី Zustand
    handleOpenPreview(file.url || file.preview);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getList = async (param_filter) => {
    param_filter = {
      ...filter,
      ...param_filter,
    };
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (param_filter.txt_search !== null && param_filter.txt_search !== "") {
      query_param += "&txt_search=" + param_filter.txt_search;
    }
    if (param_filter.status !== null && param_filter.status !== "") {
      query_param += "&status=" + param_filter.status;
    }
    if (param_filter.category_id) {
      query_param += "&category_id=" + param_filter.category_id;
    }
    if (param_filter.brand_id) {
      query_param += "&brand_id=" + param_filter.brand_id;
    }
    if (param_filter.sub_category_id) {
      query_param += "&sub_category_id=" + param_filter.sub_category_id;
    }

    const res = await request("products" + query_param, "get", {});
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        category: res.category || [],
        sub_category: res.sub_category || [],
        brand: res.brand || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setFileList([]); //close file image
    setValidate({});
  };

  
  const onFinish = async (item) => {
    const formData = new FormData();
    formData.append("category_id", item.category_id || "");
    formData.append("sub_category_id", item.sub_category_id || "");
    formData.append("brand_id", item.brand_id || "");
    formData.append("name", item.name || "");
    formData.append("slug", item.slug || "");
    formData.append("sku", item.sku || "");
    formData.append("cost_price", item.cost_price || "");
    formData.append("sale_price", item.sale_price || "");
    formData.append("stock_quantity", item.stock_quantity || 0);
    formData.append("min_stock_alert", item.min_stock_alert || 5);
    formData.append("has_imei", item.has_imei ? 1 : 0);
    formData.append("description", item.description || "");
    formData.append(
      "status",
      item.status === 1 || item.status === "active" ? "active" : "inactive",
    );

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      let image_remove = formRef.getFieldValue("image");
      if (image_remove) {
        formData.append("image_remove", image_remove);
      }
    }

    let url = "products";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }

    setState((p) => ({ ...p, loading: true }));

    const res = await request(url, method, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
          Are you sure you want to delete the product{" "}
          <b>"{data.product_name || data.title}"</b>?
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
        const res = await request(`products/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "Delete Success!");
          getList();
        } else {
          message.error(res?.message || "Failed to delete!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    setFileList([
      {
        uid: data.id,
        name: data.image,
        status: "done",
        url: config.image_path + data.image,
      },
    ]);
    // Update sub category list based on the selected category
    const filteredSub = state.sub_category?.filter(
      (sub) => sub.category_id === data.category_id,
    );
    setSubCategoryList(filteredSub || []);
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
      txt_search: null,
      status: null,
      category_id: null,
      brand_id: null,
      sub_category_id: null,
    };
    setFilter(data);
    getList(data);
  };
  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    const slugValue = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^-|-$)+/g, "");
    formRef.setFieldsValue({
      name: nameValue,
      slug: slugValue,
    });
  };
  return (
    <MainPage loading={state.loading}>
      <div>
        <div
          className="main-page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <Space wrap size={[8, 16]} style={{ flex: 1 }}>
            <div className="text-lg font-medium">
              ទំនិញសរុប: {state.list.length}
            </div>
            <Input.Search
              allowClear
              value={filter.txt_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, txt_search: e.target.value }))
              }
              placeholder="ស្វែងរកទំនិញ..."
              onSearch={handleFilter}
              style={{ width: 200 }}
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ width: 150 }}
              value={filter.status}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "ទាំងអស់", value: "" },
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសប្រភេទ"
              style={{ width: 150 }}
              value={filter.category_id}
              onChange={(value) => {
                // Add a () sign in front of p
                setFilter((p) => ({
                  ...p,
                  category_id: value,
                  sub_category_id: null,
                }));
              }}
              options={state.category?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />

            <Select
              allowClear
              placeholder="ជ្រើសរើសប្រភេទរង"
              style={{ width: 150 }}
              value={filter.sub_category_id}
              onChange={(value) =>
                setFilter((p) => ({ ...p, sub_category_id: value }))
              }
              // Here we filter the Sub Category data according to the selected Category.
              options={
                filter.category_id
                  ? state.sub_category
                      ?.filter((sub) => sub.category_id === filter.category_id)
                      ?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                  : []
              }
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសម៉ាក"
              style={{ width: 150 }}
              value={filter.brand_id}
              onChange={(value) =>
                setFilter((p) => ({ ...p, brand_id: value }))
              }
              options={state.brand?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
            <Button
              type="default"
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              កំណត់ឡើងវិញ
            </Button>
            <Button
              type="primary"
              onClick={handleFilter}
              icon={<FilterOutlined />}
            >
              ត្រងទិន្នន័យ
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<PlusOutlined />}
            style={{ borderRadius: "8px" }}
          >
            ទំនិញថ្មី
          </Button>
        </div>
        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែព័ត៌មានផលិតផល"
              : "បន្ថែមផលិតផលថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={750}
          footer={null}
          mask={{ closable: false }}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Row gutter={16}>
              {/* Product Name */}
              <Col span={12}>
                <Form.Item
                  label="ឈ្មោះផលិតផល"
                  name="name"
                  {...validate.name}
                  rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះផលិតផល!" }]}
                >
                  <Input
                    placeholder="បញ្ចូលឈ្មោះផលិតផល"
                    onChange={handleNameChange}
                  />
                </Form.Item>
              </Col>

              {/* Slug */}
              <Col span={12}>
                <Form.Item label="ស្លាក់ (Slug)" name="slug" {...validate.slug}>
                  <Input placeholder="Slug នឹងបង្កើតអូតូតាមឈ្មោះ" />
                </Form.Item>
              </Col>

              {/* SKU */}
              <Col span={12}>
                <Form.Item label="កូដទំនិញ (SKU)" name="sku" {...validate.sku}>
                  <Input placeholder="បញ្ចូលកូដ SKU" />
                </Form.Item>
              </Col>

              {/* Brand */}
              <Col span={12}>
                <Form.Item
                  label="ម៉ាក/យីហោ"
                  name="brand_id"
                  {...validate.brand_id}
                  rules={[{ required: true, message: "សូមជ្រើសរើសម៉ាក!" }]}
                >
                  <Select
                    placeholder="ជ្រើសរើសម៉ាក"
                    options={state.brand?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              {/* Category */}
              <Col span={12}>
                <Form.Item
                  label="ប្រភេទ (Category)"
                  name="category_id"
                  {...validate.category_id}
                  rules={[{ required: true, message: "សូមជ្រើសរើសប្រភេទ!" }]}
                >
                  <Select
                    placeholder="ជ្រើសរើសប្រភេទ"
                    onChange={(value) => {
                      // category changes to show sub category to null and
                      formRef.setFieldsValue({ sub_category_id: null });

                      // filter sub category by category id
                      const filteredSub = state.sub_category?.filter(
                        (sub) => sub.category_id === value,
                      );
                      setSubCategoryList(filteredSub || []);
                    }}
                    options={state.category?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              {/* Sub Category */}
              <Col span={12}>
                <Form.Item
                  label="ប្រភេទរង (Sub Category)"
                  name="sub_category_id"
                  {...validate.sub_category_id}
                >
                  <Select
                    allowClear
                    placeholder="ជ្រើសរើសប្រភេទរង"
                    options={subCategoryList?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              {/* Cost Price */}
              <Col span={12}>
                <Form.Item
                  label="តម្លៃដើម (Cost)"
                  name="cost_price"
                  {...validate.cost_price}
                  rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃដើម!" }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              {/* Sale Price */}
              <Col span={12}>
                <Form.Item
                  label="តម្លៃលក់ (Sale)"
                  name="sale_price"
                  {...validate.sale_price}
                  rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃលក់!" }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              {/* Stock Quantity */}
              <Col span={12}>
                <Form.Item
                  label="បរិមាណស្តុក"
                  name="stock_quantity"
                  {...validate.stock_quantity}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: "100%" }}
                    min={0}
                  />
                </Form.Item>
              </Col>

              {/* Minimum Stock Alert */}
              <Col span={12}>
                <Form.Item
                  label="កម្រិតដាស់តឿនស្តុកទាប"
                  name="min_stock_alert"
                  {...validate.min_stock_alert}
                >
                  <InputNumber
                    placeholder="5"
                    style={{ width: "100%" }}
                    min={0}
                  />
                </Form.Item>
              </Col>

              {/*  IMEI */}
              <Col span={12}>
                <Form.Item
                  label="មានលេខ IMEI?"
                  name="has_imei"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
                </Form.Item>
              </Col>

              {/* Status */}
              <Col span={12}>
                <Form.Item label="ស្ថានភាព" name="status" initialValue={1}>
                  <Select
                    placeholder="ជ្រើសរើសស្ថានភាព"
                    options={[
                      { label: "សកម្ម (Active)", value: 1 },
                      { label: "អសកម្ម (Inactive)", value: 0 },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Description */}
              <Col span={24}>
                <Form.Item label="ការពណ៌នាផលិតផល" name="description">
                  <Input.TextArea
                    placeholder="រៀបរាប់លម្អិតអំពីផលិតផល..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  />
                </Form.Item>
              </Col>

              {/* image */}
              <Col span={24}>
                <Form.Item label="រូបភាពផលិតផល" {...validate.image}>
                  <Upload
                    customRequest={(e) => e.onSuccess("ok")}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={({ fileList }) => setFileList(fileList)}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>ជ្រើសរូបភាព</div>
                      </div>
                    )}
                  </Upload>
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: openPreview,
                      onVisibleChange: (visible) => setOpenPreview(visible),
                      src: imgUrl,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}
            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button onClick={handleCloseModal}>បោះបង់</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={state.loading}
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
                    : "រក្សាទុកទិន្នន័យ"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Table
          dataSource={state.list}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          columns={[
            {
              title: "ឈ្មោះផលិតផល",
              dataIndex: "name",
              key: "name",
              fixed: "left",
              width: 180,
            },
            {
              title: "រូបភាព",
              dataIndex: "image",
              key: "image",
              align: "center",
              render: (image) =>
                image ? (
                  <Image
                    src={config.image_path + image}
                    width={60}
                    height={60}
                    style={{
                      borderRadius: "4px",
                      objectFit: "cover",
                      border: "1px solid #f0f0f0",
                    }}
                  />
                ) : (
                  <div style={{ color: "#ccc", fontSize: "12px" }}>
                    គ្មានរូបភាព
                  </div>
                ),
            },
            {
              title: "ប្រភេទ",
              dataIndex: "category",
              key: "category",
              render: (category) => category?.name,
            },
            {
              title: "ប្រភេទរង",
              dataIndex: "sub_category",
              key: "sub_category",
              render: (sub_category) => sub_category?.name,
            },
            {
              title: "ម៉ាក",
              dataIndex: "brand",
              key: "brand",
              render: (brand) => brand?.name,
            },
            {
              title: "តម្លៃដើម",
              dataIndex: "cost_price",
              key: "cost_price",
              align: "right",
              render: (price) => (
                <span style={{ fontWeight: "500", color: "#ff4d4f" }}>
                  ${Number(price).toFixed(2)}
                </span>
              ),
            },
            {
              title: "តម្លៃលក់",
              dataIndex: "sale_price",
              key: "sale_price",
              align: "right",
              render: (price) => (
                <span style={{ fontWeight: "500", color: "#1677ff" }}>
                  ${Number(price).toFixed(2)}
                </span>
              ),
            },
            {
              title: "បរិមាណស្តុក",
              dataIndex: "stock_quantity",
              key: "stock_quantity",
              align: "center",
              render: (qty) => (
                <span
                  style={{
                    color: qty <= 5 ? "red" : "inherit",
                    fontWeight: qty <= 5 ? "bold" : "normal",
                  }}
                >
                  {qty}
                </span>
              ),
            },
            {
              title: "មាន IMEI",
              dataIndex: "has_imei",
              key: "has_imei",
              align: "center",
              render: (hasImei) => (
                <Tag color={hasImei ? "blue" : "default"}>
                  {hasImei ? "មាន" : "គ្មាន"}
                </Tag>
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
              title: "ថ្ងៃបង្កើត",
              dataIndex: "created_at",
              key: "created_at",
              render: (val) => dateClient(val),
            },
            {
              title: "សកម្មភាព",
              align: "center",
              fixed: "right",
              dataIndex: "id",
              render: (id, data) => (
                <Space size="middle">
                  <Button
                    type="text"
                    onClick={() => handleEdit(data)}
                    icon={<CiEdit style={{ fontSize: 20, color: "#004EBC" }} />}
                  />
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDelete(data)}
                    icon={<MdDelete style={{ fontSize: 20 }} />}
                  />
                </Space>
              ),
            },
          ]}
        />
      </div>
    </MainPage>
  );
}
export default ProductPage;
