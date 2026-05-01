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
  Upload,
} from "antd";
import { CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
import { RiSave3Fill } from "react-icons/ri";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../components/layout/MainPage";
import config from "../../util/config";
import UploadButton from "../../components/button/UploadButton";
import { usePreviewStore } from "../../store/previewStore";

function BrandPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
    country: "",
  });

  const [validate, setValidate] = useState({});
  const [fileList, setFileList] = useState([]);

  // ហៅ Zustand Store
  const {
    open,
    imgUrl,
    handleOpen: openPreview,
    handleOpenPreview,
    handleClosePreview,
  } = usePreviewStore();

  // មុខងារ handlePreview
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
// country list api
const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // កំណត់ទម្រង់ទិន្នន័យ (label និង value) ឲ្យត្រូវនឹង Ant Design Select
    const countryOptions = data.map((country) => ({
      label: country.name.common,
      value: country.name.common,
    }));
    setCountries(countryOptions);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};
  useEffect(() => {
    getList();
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (filter.text_search) {
      query_param += "&txt_search=" + filter.text_search;
    }
    if (filter.status) {
      query_param += "&status=" + filter.status;
    }
    const res = await request("brands" + query_param, "get", {});
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total || res.list?.length,
        list: res.list || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  // auto change slug
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

    const currentSlug = formRef.getFieldValue("slug") || "";
    formData.append("slug", currentSlug);
    formData.append("status", item.status || "active");
    formData.append("country", item.country || "");
    // ករណីមានការ Upload រូបភាពថ្មី
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      let image_remove = formRef.getFieldValue("image");
      if (image_remove) {
        formData.append("image_remove", image_remove);
      }
    }

    let url = "brands";
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
      content: "តើអ្នកប្រាកដជាចង់លុបម៉ាកយីហោនេះមែនទេ?",
      okText: "លុប",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`brands/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុបម៉ាកយីហោនេះ!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    if (data.image) {
      setFileList([
        {
          uid: data.id,
          name: data.image,
          status: "done",
          url: config.image_path + data.image,
        },
      ]);
    }
    formRef.setFieldsValue({
      ...data,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    getList();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div
          className="main-page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space>
            <div>ម៉ាកផលិតផលសរុប: {state.list.length}</div>
            <Input.Search
              allowClear
              value={filter.text_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              placeholder="ស្វែងរកម៉ាកផលិតផល..."
              onSearch={handleFilter}
            />
            {/* filter by status */}
            <Select
              allowClear
              placeholder="ស្ថានភាព"
              style={{ width: 150 }}
              value={filter.status}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "ទាំងអស់", value: "" },
                { label: "សកម្ម", value: "active" },
                { label: "អសកម្ម", value: "inactive" },
              ]}
            />
            <Button
              type="primary"
              onClick={handleFilter}
              icon={<FilterOutlined />}
            >
              ស្វែងរក
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<IoMdAddCircle style={{ fontSize: "18px" }} />}
            style={{ borderRadius: "8px" }}
          >
            ម៉ាកថ្មី
          </Button>
        </div>

        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែម៉ាកយីហោ"
              : "បង្កើតម៉ាកយីហោថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <div style={{ display: "grid" }}>
              <Form.Item
                label="ឈ្មោះម៉ាក"
                name="name"
                {...validate.name}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះម៉ាក!" }]}
              >
                <Input
                  placeholder="បញ្ចូលឈ្មោះម៉ាក"
                  onChange={handleNameChange}
                />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input placeholder="Slug" />
              </Form.Item>
              <Form.Item
                label="ប្រទេស (Country)"
                name="country"
                {...validate.country}
              >
                <Input placeholder="បញ្ចូលឈ្មោះប្រទេស (ឧ. USA, China)" />
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

              <Form.Item label="រូបភាព" {...validate.image}>
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
          columns={[
            { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
            { title: "Slug", dataIndex: "slug", key: "slug" },
            {
              title: "រូបភាព",
              dataIndex: "image",
              key: "image",
              render: (image) =>
                image ? (
                  <Image
                    src={config.image_path + image}
                    width={50}
                    style={{ borderRadius: "4px" }}
                  />
                ) : (
                  <div style={{ color: "#ccc" }}>គ្មានរូបភាព</div>
                ),
            },
            {
              title: "ប្រទេស",
              dataIndex: "country",
              key: "country",
              render: (value) =>
                value || <span style={{ color: "#ccc" }}>មិនបានកំណត់</span>,
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
      </div>
    </MainPage>
  );
}

export default BrandPage;
