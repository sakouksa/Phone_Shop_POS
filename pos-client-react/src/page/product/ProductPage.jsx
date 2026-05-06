import React, { useEffect, useState } from 'react'
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
  Typography,
  DatePicker
} from 'antd'
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
  FileSearchOutlined,
  UploadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin6Line, RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

// Utils
import { request } from '../../util/request'
import config from '../../util/config'
import { usePreviewStore } from '../../store/previewStore'

// Components
import MainPage from '../../components/layout/MainPage'
import UploadButton from '../../components/button/UploadButton'
import { dateClient } from '../../util/helper'
function ProductPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    category: [],
    brand: [],
    sub_category: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: null,
    status: null,
    category_id: null,
    brand_id: null,
    sub_category_id: null,
    date_range: null
  })
  const { Title, Text } = Typography
  const [fileList, setFileList] = useState([])
  const [openPreview, setOpenPreview] = useState(false)
  const [validate, setValidate] = useState({})
  const [subCategoryList, setSubCategoryList] = useState([])
  // call Zustand Store
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore()

  //  handlePreview
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    // ហៅ function ពី Zustand
    handleOpenPreview(file.url || file.preview)
  }
  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })

  const getList = async param_filter => {
    param_filter = {
      ...filter,
      ...param_filter
    }
    setState(pre => ({ ...pre, loading: true }))
    let query_param = '?page=1'
    if (param_filter.txt_search !== null && param_filter.txt_search !== '') {
      query_param += '&txt_search=' + param_filter.txt_search
    }
    if (param_filter.status !== null && param_filter.status !== '') {
      query_param += '&status=' + param_filter.status
    }
    if (param_filter.category_id) {
      query_param += '&category_id=' + param_filter.category_id
    }
    if (param_filter.brand_id) {
      query_param += '&brand_id=' + param_filter.brand_id
    }
    if (param_filter.sub_category_id) {
      query_param += '&sub_category_id=' + param_filter.sub_category_id
    }
    if (
      param_filter.date_range &&
      Array.isArray(param_filter.date_range) &&
      param_filter.date_range.length === 2
    ) {
      // ពិនិត្យមើលថាតើជា Object (dayjs) ឬ String
      const startDate =
        typeof param_filter.date_range[0] === 'object'
          ? param_filter.date_range[0].format('YYYY-MM-DD')
          : param_filter.date_range[0]

      const endDate =
        typeof param_filter.date_range[1] === 'object'
          ? param_filter.date_range[1].format('YYYY-MM-DD')
          : param_filter.date_range[1]

      query_param += `&start_date=${startDate}&end_date=${endDate}`
    }

    const res = await request('products' + query_param, 'get', {})
    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        category: res.category || [],
        sub_category: res.sub_category || [],
        brand: res.brand || [],
        loading: false
      }))
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res.errors?.message) {
        message.error(res.errors?.message)
      }
    }
  }

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenModal = () => {
    setState(pre => ({ ...pre, open: true }))
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setFileList([]) //close file image
    setValidate({})
  }

  const onFinish = async item => {
    const formData = new FormData()
    formData.append('category_id', item.category_id || '')
    formData.append('sub_category_id', item.sub_category_id || '')
    formData.append('brand_id', item.brand_id || '')
    formData.append('name', item.name || '')
    formData.append('slug', item.slug || '')
    formData.append('sku', item.sku || '')
    formData.append('cost_price', item.cost_price || '')
    formData.append('sale_price', item.sale_price || '')
    formData.append('stock_quantity', item.stock_quantity || 0)
    formData.append('min_stock_alert', item.min_stock_alert || 5)
    formData.append('has_imei', item.has_imei ? 1 : 0)
    formData.append('description', item.description || '')
    formData.append(
      'status',
      item.status === 1 || item.status === 'active' ? 'active' : 'inactive'
    )

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj)
    } else if (fileList.length === 0 && formRef.getFieldValue('id')) {
      let image_remove = formRef.getFieldValue('image')
      if (image_remove) {
        formData.append('image_remove', image_remove)
      }
    }

    let url = 'products'
    let method = 'post'

    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      method = 'post'
      formData.append('_method', 'PUT')
    }

    setState(p => ({ ...p, loading: true }))

    const res = await request(url, method, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res && !res.errors) {
      message.success(res.message || 'Success!')
      handleCloseModal()
      getList()
      setState(p => ({ ...p, loading: false }))
    } else {
      setValidate(res.errors || {})
      message.error(res?.message || 'Failed to perform action!')
      setState(p => ({ ...p, loading: false }))
    }
  }
  const handleDelete = async data => {
    Modal.confirm({
      title: 'ការបញ្ជាក់ការលុប',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          តើអ្នកពិតជាចង់លុបផលិតផលនេះ ឬទេ?
          <br />
          <b>{data.product_name || data.title}</b>
          <p style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '8px' }}>
            * សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។
          </p>
        </div>
      ),
      okText: 'លុប',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      closable: true,
      onOk: async () => {
        const res = await request(`products/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success(res.message || 'លុបបានជោគជ័យ!')
          getList()
        } else {
          message.error(res?.message || 'ការលុបបានបរាជ័យ!')
        }
      }
    })
  }
  const handleEdit = data => {
    setFileList([
      {
        uid: data.id,
        name: data.image,
        status: 'done',
        url: config.image_path + data.image
      }
    ])
    // Update sub category list based on the selected category
    const filteredSub = state.sub_category?.filter(
      sub => sub.category_id === data.category_id
    )
    setSubCategoryList(filteredSub || [])
    formRef.setFieldsValue({
      ...data
    })
    setState(p => ({ ...p, open: true }))
  }

  const handleFilter = () => {
    getList()
  }
  const handleReset = () => {
    const data = {
      txt_search: null,
      status: null,
      category_id: null,
      brand_id: null,
      sub_category_id: null,
      date_range: null
    }
    setFilter(data)
    getList(data)
  }
  const handleNameChange = e => {
    const nameValue = e.target.value
    const slugValue = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^-|-$)+/g, '')
    formRef.setFieldsValue({
      name: nameValue,
      slug: slugValue
    })
  }
  const handleDateChange = (dates, dateStrings) => {
    setFilter(p => ({ ...p, date_range: dates }))

    getList({
      ...filter,
      date_range: dateStrings
    })
  }
  return (
    <MainPage loading={state.loading}>
      <div>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2'>
                បញ្ជីគ្រប់គ្រងផលិតផល
                <span className='text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit'>
                  ផលិតផលក្នុងស្តុក: {state.total || 0}
                </span>
              </h2>
              <Text type='secondary' className='text-sm dark:text-gray-400'>
                គ្រប់គ្រងផលិតផល និងគ្រឿងបន្លាស់របស់អ្នកនៅទីនេះ
              </Text>
            </div>

            <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
              <Button
                className='flex items-center px-4 h-9 bg-white border border-gray-200 rounded-lg hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm font-medium text-gray-700'
                icon={<UploadOutlined />}
              >
                នាំចូល
              </Button>

              <Button
                className='flex items-center px-4 h-9 bg-white border border-gray-200 rounded-lg hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm font-medium text-gray-700'
                icon={<FileSearchOutlined />}
              >
                នាំចេញ
              </Button>

              <Button
                type='primary'
                onClick={handleOpenModal}
                icon={<PlusOutlined />}
                className='h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all'
              >
                បន្ថែមផលិតផល
              </Button>
            </div>
          </div>

          {/* Filter Section */}
          <div className='border-t border-gray-100 pt-6'>
            <div className='flex flex-wrap justify-between items-center gap-4'>
              <Input
                allowClear
                value={filter.txt_search}
                onChange={e =>
                  setFilter(p => ({ ...p, txt_search: e.target.value }))
                }
                placeholder='ស្វែងរកផលិតផល...'
                onPressEnter={handleFilter}
                prefix={
                  <SearchOutlined className='text-gray-400 dark:text-gray-500 mr-2' />
                }
                style={{ width: 150 }}
              />
              <div className='flex flex-wrap items-center gap-3'>
                {/* filter date */}
                <DatePicker.RangePicker
                  value={filter.date_range}
                  onChange={handleDateChange}
                  style={{ width: 200 }}
                />

                <Select
                  allowClear
                  placeholder='ស្ថានភាព'
                  style={{ width: 110 }}
                  value={filter.status}
                  onChange={value => setFilter(p => ({ ...p, status: value }))}
                  options={[
                    { label: 'សកម្ម', value: 1 },
                    { label: 'អសកម្ម', value: 0 }
                  ]}
                />

                <Select
                  allowClear
                  placeholder='ប្រភេទផលិតផល'
                  style={{ width: 110 }}
                  value={filter.category_id}
                  onChange={value => {
                    setFilter(p => ({
                      ...p,
                      category_id: value,
                      sub_category_id: null
                    }))
                  }}
                  options={state.category?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />

                <Select
                  allowClear
                  placeholder='ប្រភេទរង'
                  style={{ width: 110 }}
                  value={filter.sub_category_id}
                  onChange={value =>
                    setFilter(p => ({ ...p, sub_category_id: value }))
                  }
                  options={
                    filter.category_id
                      ? state.sub_category
                          ?.filter(
                            sub => sub.category_id === filter.category_id
                          )
                          ?.map(item => ({
                            label: item.name,
                            value: item.id
                          }))
                      : []
                  }
                />
                <Select
                  allowClear
                  placeholder='ម៉ាក/យីហោ'
                  style={{ width: 110 }}
                  value={filter.brand_id}
                  onChange={value =>
                    setFilter(p => ({ ...p, brand_id: value }))
                  }
                  options={state.brand?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />
                <div className='flex gap-2'>
                  <Button
                    type='default'
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                    className='px-3 flex items-center'
                  >
                    កំណត់ឡើងវិញ
                  </Button>
                  <Button
                    type='primary'
                    onClick={handleFilter}
                    icon={<FilterOutlined />}
                    className='px-3 flex items-center bg-indigo-600 border-0 hover:bg-indigo-700'
                  >
                    តម្រងទិន្នន័យ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal for Add/Edit Product */}
        <Modal
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={1000}
          footer={null}
          closable={false}
          mask={{ closable: false }}
        >
          <div
            className='flex justify-between items-center px-6 py-4 rounded-t-lg mb-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-200'
            style={{
              borderLeft: '5px solid #0958D9'
            }}
          >
            <h2 className='text-lg font-bold m-0 flex items-center gap-3 text-gray-900 dark:text-white'>
              {formRef.getFieldValue('id') ? (
                <>
                  <span>កែប្រែព័ត៌មានផលិតផល</span>
                </>
              ) : (
                <>
                  <span>បន្ថែមផលិតផលថ្មី</span>
                </>
              )}
            </h2>
            <Button
              type='text'
              onClick={handleCloseModal}
              className='hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full h-8 w-8 flex items-center justify-center transition-all duration-300 ease-in-out group'
              style={{
                color: '#FF4D4F'
              }}
              icon={
                <IoCloseOutline
                  className='transition-transform duration-300 group-hover:rotate-90'
                  style={{ fontSize: 22 }}
                />
              }
            />
          </div>

          <Form
            layout='vertical'
            onFinish={onFinish}
            form={formRef}
            className='pb-2'
          >
            <div className='grid grid-cols-3 gap-x-6 gap-y-1'>
              {/* Product Name */}
              <Form.Item
                label='ឈ្មោះផលិតផល'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះផលិតផល!' }]}
                className='mb-2'
              >
                <Input
                  placeholder='បញ្ចូលឈ្មោះផលិតផល'
                  onChange={handleNameChange}
                  className='h-8'
                />
              </Form.Item>

              {/* Slug */}
              <Form.Item
                label='ស្លាក់ (Slug)'
                name='slug'
                {...validate.slug}
                className='mb-2'
              >
                <Input
                  placeholder='Slug នឹងបង្កើតអូតូតាមឈ្មោះ'
                  className='h-8'
                />
              </Form.Item>

              {/* SKU */}
              <Form.Item
                label='កូដទំនិញ (SKU)'
                name='sku'
                {...validate.sku}
                className='mb-2'
              >
                <Input placeholder='បញ្ចូលកូដ SKU' className='h-8' />
              </Form.Item>

              {/* Brand */}
              <Form.Item
                label='ម៉ាក/យីហោ'
                name='brand_id'
                {...validate.brand_id}
                rules={[{ required: true, message: 'សូមជ្រើសរើសម៉ាក!' }]}
                className='mb-2'
              >
                <Select
                  placeholder='ជ្រើសរើសម៉ាក'
                  className='h-8 w-full'
                  options={state.brand?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />
              </Form.Item>

              {/* Category */}
              <Form.Item
                label='ប្រភេទ (Category)'
                name='category_id'
                {...validate.category_id}
                rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទ!' }]}
                className='mb-2'
              >
                <Select
                  placeholder='ជ្រើសរើសប្រភេទ'
                  className='h-8 w-full'
                  onChange={value => {
                    formRef.setFieldsValue({ sub_category_id: null })
                    const filteredSub = state.sub_category?.filter(
                      sub => sub.category_id === value
                    )
                    setSubCategoryList(filteredSub || [])
                  }}
                  options={state.category?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />
              </Form.Item>

              {/* Sub Category */}
              <Form.Item
                label='ប្រភេទរង (Sub Category)'
                name='sub_category_id'
                {...validate.sub_category_id}
                className='mb-2'
              >
                <Select
                  allowClear
                  placeholder='ជ្រើសរើសប្រភេទរង'
                  className='h-8 w-full'
                  options={subCategoryList?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />
              </Form.Item>

              {/* Cost Price */}
              <Form.Item
                label='តម្លៃដើម (Cost)'
                name='cost_price'
                {...validate.cost_price}
                rules={[{ required: true, message: 'សូមបញ្ចូលតម្លៃដើម!' }]}
                className='mb-2'
              >
                <InputNumber
                  placeholder='0.00'
                  className='h-8 w-full'
                  min={0}
                />
              </Form.Item>

              {/* Sale Price */}
              <Form.Item
                label='តម្លៃលក់ (Sale)'
                name='sale_price'
                {...validate.sale_price}
                rules={[{ required: true, message: 'សូមបញ្ចូលតម្លៃលក់!' }]}
                className='mb-2'
              >
                <InputNumber
                  placeholder='0.00'
                  className='h-8 w-full'
                  min={0}
                />
              </Form.Item>

              {/* Stock Quantity */}
              <Form.Item
                label='បរិមាណស្តុក'
                name='stock_quantity'
                {...validate.stock_quantity}
                className='mb-2'
              >
                <InputNumber placeholder='0' className='h-8 w-full' min={0} />
              </Form.Item>

              {/* Minimum Stock Alert */}
              <Form.Item
                label='កម្រិតដាស់តឿនស្តុកទាប'
                name='min_stock_alert'
                {...validate.min_stock_alert}
                className='mb-2'
              >
                <InputNumber placeholder='5' className='h-8 w-full' min={0} />
              </Form.Item>

              {/* IMEI */}
              <Form.Item
                label='មានលេខ IMEI?'
                name='has_imei'
                valuePropName='checked'
                className='mb-2 flex items-center h-full'
              >
                <Switch checkedChildren='បាទ/ចាស' unCheckedChildren='ទេ' />
              </Form.Item>

              {/* Status */}
              <Form.Item
                label='ស្ថានភាព'
                name='status'
                initialValue='active'
                className='mb-2'
              >
                <Select
                  placeholder='ជ្រើសរើសស្ថានភាព'
                  className='h-8 w-full'
                  options={[
                    { label: 'សកម្ម', value: 'active' },
                    { label: 'អសកម្ម', value: 'inactive' }
                  ]}
                />
              </Form.Item>
            </div>

            {/* Description */}
            <Form.Item
              label='ការពណ៌នាផលិតផល'
              name='description'
              className='mb-2'
            >
              <Input.TextArea
                placeholder='រៀបរាប់លម្អិតអំពីផលិតផល...'
                autoSize={{ minRows: 2, maxRows: 2 }}
              />
            </Form.Item>

            {/* Image */}
            <Form.Item
              label='រូបភាពផលិតផល'
              {...validate.image}
              className='mb-3'
            >
              <Upload
                customRequest={e => e.onSuccess('ok')}
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : (
                  <div className='flex flex-col items-center'>
                    <PlusOutlined />
                    <div className='text-xs mt-1'>ជ្រើសរូបភាព</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Custom Footer */}
            <div className='flex justify-end items-center border-t border-gray-200 pt-4 mt-2'>
              <Space>
                <Button onClick={handleCloseModal} className='h-8'>
                  បោះបង់
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={state.loading}
                  className='h-8 flex items-center'
                  style={{ backgroundColor: '#004EBC' }} // ពណ៌ផ្ទាល់ខ្លួន
                  icon={
                    formRef.getFieldValue('id') ? (
                      <BiSolidEditAlt />
                    ) : (
                      <RiSave3Fill />
                    )
                  }
                >
                  {formRef.getFieldValue('id')
                    ? 'ធ្វើបច្ចុប្បន្នភាព'
                    : 'រក្សាទុកទិន្នន័យ'}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        <Table
          dataSource={state.list}
          rowKey='id'
          scroll={{ x: 1300 }}
          size='middle'
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: total => `សរុប: ${total} មុខទំនិញ`
          }}
          columns={[
            {
              title: 'ឈ្មោះផលិតផល',
              dataIndex: 'name',
              key: 'name',
              fixed: 'left',
              width: 200,
              render: text => (
                <span className='font-semibold text-gray-800'>{text}</span>
              )
            },
            {
              title: 'រូបភាព',
              dataIndex: 'image',
              key: 'image',
              align: 'center',
              width: 80,
              render: image =>
                image ? (
                  <Image
                    src={config.image_path + image}
                    width={44}
                    height={44}
                    style={{
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                ) : (
                  <div className='text-gray-400 text-xs'>គ្មានរូបភាព</div>
                )
            },
            {
              title: 'ប្រភេទ',
              dataIndex: 'category',
              key: 'category',
              render: category => category?.name || '-'
            },
            {
              title: 'ប្រភេទរង',
              dataIndex: 'sub_category',
              key: 'sub_category',
              render: sub_category => sub_category?.name || '-'
            },
            {
              title: 'ម៉ាក',
              dataIndex: 'brand',
              key: 'brand',
              render: brand => brand?.name || '-'
            },
            {
              title: 'តម្លៃដើម',
              dataIndex: 'cost_price',
              key: 'cost_price',
              align: 'right',
              render: price => (
                <span className='font-medium text-red-500'>
                  ${Number(price).toFixed(2)}
                </span>
              )
            },
            {
              title: 'តម្លៃលក់',
              dataIndex: 'sale_price',
              key: 'sale_price',
              align: 'right',
              render: price => (
                <span className='font-medium text-blue-600'>
                  ${Number(price).toFixed(2)}
                </span>
              )
            },
            {
              title: 'បរិមាណស្តុក',
              dataIndex: 'stock_quantity',
              key: 'stock_quantity',
              align: 'center',
              render: qty => (
                <span
                  style={{
                    color: qty <= 5 ? '#EF4444' : '#374151',
                    fontWeight: qty <= 5 ? '600' : '500',
                    backgroundColor: qty <= 5 ? '#FEE2E2' : 'transparent',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {qty}
                </span>
              )
            },
            {
              title: 'មាន IMEI',
              dataIndex: 'has_imei',
              key: 'has_imei',
              align: 'center',
              render: hasImei => (
                <Tag
                  color={hasImei ? 'blue' : 'default'}
                  bordered={false}
                  className='rounded-md'
                >
                  {hasImei ? 'មាន' : 'គ្មាន'}
                </Tag>
              )
            },
            {
              title: 'ស្ថានភាព',
              dataIndex: 'status',
              key: 'status',
              align: 'center',
              render: value => {
                const isActive = value === 'active' || value === 1
                return (
                  <Tag
                    bordered={false}
                    color={isActive ? 'success' : 'error'}
                    className='font-medium px-2.5 py-0.5 rounded-md'
                  >
                    {isActive ? 'សកម្ម' : 'អសកម្ម'}
                  </Tag>
                )
              }
            },
            {
              title: 'ថ្ងៃបង្កើត',
              dataIndex: 'created_at',
              key: 'created_at',
              render: val => (
                <span className='text-gray-500'>{dateClient(val)}</span>
              )
            },
            {
              title: 'សកម្មភាព',
              align: 'center',
              fixed: 'right',
              width: 110,
              dataIndex: 'id',
              render: (id, data) => (
                <Space size='small'>
                  <Button
                    type='text'
                    onClick={() => handleEdit(data)}
                    className='hover:bg-blue-50 text-blue-600 rounded-full h-8 w-8 flex items-center justify-center transition'
                    icon={<CiEdit style={{ fontSize: 20 }} />}
                  />
                  <Button
                    type='text'
                    danger
                    onClick={() => handleDelete(data)}
                    className='hover:bg-red-50 text-red-500 rounded-full h-8 w-8 flex items-center justify-center transition'
                    icon={<MdDelete style={{ fontSize: 20 }} />}
                  />
                </Space>
              )
            }
          ]}
        />
      </div>
    </MainPage>
  )
}
export default ProductPage
