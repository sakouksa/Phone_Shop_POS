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
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../components/layout/MainPage";
import config from "../../util/config";
import UploadButton from "../../components/button/UploadButton";
import { usePreviewStore } from "../../store/previewStore";

function SubCategoryPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    category: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    status: null,
    category_id: null,
  });

  const [validate, setValidate] = useState({});
  const [fileList, setFileList] = useState([]);
  const [slug, setSlug] = useState("");

  const {
    open: previewOpen,
    imgUrl,
    handleOpenPreview,
    handleClosePreview,
  } = usePreviewStore();

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

  const getList = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (filter.text_search) {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== "" && filter.status !== null) {
      query_param += "&status=" + filter.status;
    }
    if (filter.category_id) {
      query_param += "&category_id=" + filter.category_id;
    }

    const res = await request("sub_categories" + query_param, "get", {});
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total || res.list?.length,
        list: res.list || [],
        category: res.category || [],
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

    setSlug(slugValue);
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
    setSlug("");
    setFileList([]);
    setValidate({});
  };

  const onFinish = async (item) => {
    const formData = new FormData();
    formData.append("category_id", item.category_id);
    formData.append("name", item.name);

    const currentSlug = formRef.getFieldValue("slug") || "";
    formData.append("slug", currentSlug);
    formData.append("status", item.status ?? 1);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      let image_remove = formRef.getFieldValue("image");
      if (image_remove) {
        formData.append("image_remove", image_remove);
      }
    }

    let url = "sub_categories";
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
      content: `តើអ្នកប្រាកដជាចង់លុបប្រភេទរង "${data.name}" នេះមែនទេ?`,
      okText: "លុប",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`sub_categories/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុបនេះ!");
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
    setSlug(data.slug || "");
    formRef.setFieldsValue({
      ...data,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    getList();
  };

  const handleReset = () => {
    setFilter({
      text_search: "",
      status: "",
      category_id: "",
    });
    getList();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 w-full">
          <Space wrap size={[8, 16]} className="flex-1 w-full md:w-auto">
            <div className="text-lg font-medium text-gray-700">
              សរុបប្រភេទរង៖ {state.list.length}
            </div>

            <Input.Search
              allowClear
              value={filter.text_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              placeholder="ស្វែងរកតាមឈ្មោះ..."
              onSearch={handleFilter}
              style={{ width: 200 }}
            />

            <Select
              allowClear
              placeholder="ស្ថានភាព"
              style={{ width: 130 }}
              value={filter.status}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />

            <Select
              allowClear
              placeholder="ជ្រើសរើសប្រភេទ"
              style={{ width: 160 }}
              value={filter.category_id}
              onChange={(value) =>
                setFilter((p) => ({ ...p, category_id: value }))
              }
              options={state.category?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />

            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              សារឡើងវិញ
            </Button>

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
            ប្រភេទរងថ្មី
          </Button>
        </div>

        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែប្រភេទរង"
              : "បង្កើតប្រភេទរងថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={500}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <div className="flex flex-col gap-1">
              <Form.Item
                label="ជ្រើសរើសប្រភេទមេ"
                name="category_id"
                {...validate.category_id}
                rules={[{ required: true, message: "សូមជ្រើសរើសប្រភេទមេ!" }]}
              >
                <Select
                  placeholder="ជ្រើសរើសប្រភេទមេ"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={state.category?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="ឈ្មោះប្រភេទរង"
                name="name"
                {...validate.name}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះប្រភេទរង!" }]}
              >
                <Input
                  placeholder="បញ្ចូលឈ្មោះប្រភេទរង"
                  onChange={(e) => handleNameChange(e)}
                />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input
                  placeholder="Slug"
                  readOnly
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                />
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
                    visible: previewOpen,
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
              title: "ប្រភេទមេ",
              dataIndex: "category",
              key: "category",
              render: (category) => category?.name,
            },
            {
              title: "ស្ថានភាព",
              dataIndex: "status",
              key: "status",
              align: "center",
              render: (value) => {
                const isActive = value === 1;
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

export default SubCategoryPage;
