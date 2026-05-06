import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  Pagination,
  InputNumber
} from 'antd'

import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import {
  SearchOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { Input } from 'antd'

import { request } from '../../util/request'
import { dateClient } from '../../util/helper'
import MainPage from '../../components/layout/MainPage'
import { usePaginationStore } from '../../store/usePaginationStore'

const { Text } = Typography

function PurchaseOrderItemPage () {
  const [formRef] = Form.useForm()
  const [validate, setValidate] = useState({})
  const [state, setState] = useState({
    list: [],
    purchase_order: [],
    products: [],
    loading: false,
    open: false
  })

  // use Pagination Store
  const { pagination, setPagination, resetPagination } = usePaginationStore()

  const [filter, setFilter] = useState({
    text_search: '',
    purchase_order_id: null,
    product_id: null
  })

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async (currentFilter = pagination) => {
    setState(pre => ({ ...pre, loading: true }))

    let query_param = `?page=${currentFilter.page}&limit=${currentFilter.limit}`
    if (filter.text_search) {
      query_param += '&text_search=' + filter.text_search
    }
    if (filter.purchase_order_id) {
      query_param += '&purchase_order_id=' + filter.purchase_order_id
    }
    if (filter.product_id) {
      query_param += '&product_id=' + filter.product_id
    }

    const res = await request('purchase-order-items' + query_param, 'get')

    if (res && res.status === 500) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ 500!')
      setState(pre => ({ ...pre, loading: false }))
      return
    }

    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        list: res.list?.data || res.list || [],
        purchase_order: res.purchase_order || [],
        products: res.products || [],
        loading: false
      }))
      setPagination({
        total: res.list?.total || res.total || res.list?.length || 0
      })
    } else {
      setState(pre => ({ ...pre, loading: false }))
    }
  }

  const handleOpenModal = () => {
    setState(pre => ({ ...pre, open: true }))
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setValidate({})
  }

  const onFinish = async item => {
    let url = 'purchase-order-items'
    let method = 'post'

    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      method = 'put'
    }

    const res = await request(url, method, item)
    if (res && !res.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleCloseModal()
      getList()
    } else {
      setValidate(res.errors || {})
      message.error(res?.message || 'ប្រតិបត្តិការបរាជ័យ!')
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'ការបញ្ជាក់ការលុប',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          តើអ្នកពិតជាចង់លុបព័ត៌មានទំនិញនេះ ឬទេ?
          <br />
          <b>{data.product?.name}</b>
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
        const res = await request(`purchase-order-items/${data.id}`, 'delete', {})
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
    formRef.setFieldsValue({ ...data })
    setState(p => ({ ...p, open: true }))
  }

  const handleFilter = () => {
    setPagination({ page: 1 })
    getList({ ...pagination, page: 1 })
  }

  const handleReset = () => {
    resetPagination()
    setFilter({
      text_search: '',
      purchase_order_id: null,
      product_id: null
    })
    getList({ page: 1, limit: 10 })
  }

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize })
    getList({ page, limit: pageSize })
  }
  //  សម្រាប់តាមដានតម្លៃនៃ quantity and unit_price
  const quantity = Form.useWatch('quantity', formRef);
  const unit_price = Form.useWatch('unit_price', formRef);

  // គណនាតម្លៃ total_line_price auto
  React.useEffect(() => {
    if (quantity !== undefined && unit_price !== undefined) {
      const total = Number(quantity) * Number(unit_price);
      formRef.setFieldsValue({ total_line_price: isNaN(total) ? 0 : total });
    } else {
      formRef.setFieldsValue({ total_line_price: 0 });
    }
  }, [quantity, unit_price, formRef]);

  return (
    <MainPage loading={state.loading}>
      <div>
        {/* Card Header & Filter Section */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2'>
                បញ្ជីទំនិញលម្អិតនៃការបញ្ជាទិញ
                <span className='text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit'>
                  ទិន្នន័យសរុប: {pagination.total || 0}
                </span>
              </h2>
              <Text type='secondary' className='text-sm dark:text-gray-400'>
                គ្រប់គ្រងព័ត៌មានលម្អិតនៃទំនិញបញ្ជាទិញរបស់អ្នកនៅទីនេះ
              </Text>
            </div>

            <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
              <Button
                type='primary'
                onClick={handleOpenModal}
                icon={<PlusOutlined />}
                className='h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all'
              >
                បន្ថែមទំនិញ
              </Button>
            </div>
          </div>

          <div className='border-t border-gray-100 pt-6'>
            <div className='flex flex-wrap justify-between items-center gap-4'>
              <Input
                allowClear
                value={filter.text_search}
                onChange={e =>
                  setFilter(p => ({ ...p, text_search: e.target.value }))
                }
                placeholder='ស្វែងរក...'
                onPressEnter={handleFilter}
                prefix={
                  <SearchOutlined className='text-gray-400 dark:text-gray-500 mr-2' />
                }
                style={{ width: 220 }}
              />

              <div className='flex flex-wrap items-center gap-3'>
                <Select
                  allowClear
                  showSearch
                  placeholder='ជ្រើសរើសលេខ PO'
                  style={{ width: 200 }}
                  value={filter.purchase_order_id || undefined}
                  onChange={val =>
                    setFilter(p => ({ ...p, purchase_order_id: val }))
                  }
                  optionFilterProp='label'
                  options={state.purchase_order.map(po => ({
                    label: po.po_number,
                    value: po.id
                  }))}
                />

                <Select
                  allowClear
                  showSearch
                  placeholder='ជ្រើសរើសទំនិញ'
                  style={{ width: 200 }}
                  value={filter.product_id || undefined}
                  onChange={val => setFilter(p => ({ ...p, product_id: val }))}
                  optionFilterProp='label'
                  options={state.products.map(p => ({
                    label: p.name,
                    value: p.id
                  }))}
                />

                <div className='flex gap-2'>
                  <Button
                    type='default'
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                    className='px-3 flex items-center hover:text-indigo-600'
                  >
                    កំណត់ឡើងវិញ
                  </Button>
                  <Button
                    type='primary'
                    onClick={handleFilter}
                    className='px-3 flex items-center bg-indigo-600 border-0 hover:bg-indigo-700'
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
    formRef.getFieldValue('id')
      ? 'កែប្រែទំនិញបញ្ជាទិញ'
      : 'បន្ថែមទំនិញបញ្ជាទិញថ្មី'
  }
  open={state.open}
  onCancel={handleCloseModal}
  centered
  footer={null}
  width={650}
  maskClosable={false}
>
  <Form layout='vertical' onFinish={onFinish} form={formRef}>
    <Form.Item name='id' style={{ display: 'none' }}>
      <Input type='hidden' />
    </Form.Item>

    <Form.Item
      label='ការបញ្ជាទិញ (PO)'
      name='purchase_order_id'
      {...validate.purchase_order_id}
      rules={[{ required: true, message: 'សូមជ្រើសរើសការបញ្ជាទិញ!' }]}
    >
      <Select
        placeholder='ជ្រើសរើសលេខ PO'
        options={state.purchase_order.map(po => ({
          label: po.po_number,
          value: po.id
        }))}
      />
    </Form.Item>

    <Form.Item
      label='ជ្រើសរើសទំនិញ'
      name='product_id'
      {...validate.product_id}
      rules={[{ required: true, message: 'សូមជ្រើសរើសទំនិញ!' }]}
    >
      <Select
        placeholder='ជ្រើសរើសទំនិញ'
        options={state.products.map(p => ({
          label: p.name,
          value: p.id
        }))}
      />
    </Form.Item>

    <div style={{ display: 'flex', gap: '16px' }}>
      <Form.Item
        label='ចំនួន'
        name='quantity'
        style={{ flex: 1 }}
        {...validate.quantity}
        rules={[{ required: true, message: 'សូមបញ្ចូលចំនួន!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          type='number'
          placeholder='ចំនួន'
        />
      </Form.Item>

      <Form.Item
        label='តម្លៃក្នុងមួយឯកតា'
        name='unit_price'
        style={{ flex: 1 }}
        {...validate.unit_price}
        rules={[{ required: true, message: 'សូមបញ្ចូលតម្លៃ!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          type='number'
          placeholder='តម្លៃក្នុងមួយឯកតា'
        />
      </Form.Item>
    </div>

    <Form.Item
      label='តម្លៃសរុប'
      name='total_line_price'
      {...validate.total_line_price}
    >
      <InputNumber
        style={{ width: '100%' }}
        placeholder='តម្លៃសរុប (គណនាស្វ័យប្រវត្តិ)'
        disabled
      />
    </Form.Item>

    <Form.Item
      label='កំណត់សម្គាល់ (Remarks)'
      name='remarks'
      {...validate.remarks}
    >
      <Input.TextArea
        placeholder='បញ្ចូលកំណត់សម្គាល់ (ប្រសិនបើមាន)'
        rows={2}
      />
    </Form.Item>

    <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: '12px' }}>
      <Space>
        <Button onClick={handleCloseModal}>បោះបង់</Button>
        <Button
          type='primary'
          htmlType='submit'
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
            : 'រក្សាទុក'}
        </Button>
      </Space>
    </Form.Item>
  </Form>
</Modal>

        {/* Table Section */}
        <Table
          dataSource={state.list}
          scroll={{ x: 800 }}
          pagination={false}
          columns={[
            {
              title: 'លេខ PO',
              dataIndex: ['purchase_order', 'po_number'],
              key: 'po_number'
            },
            {
              title: 'ឈ្មោះទំនិញ',
              dataIndex: ['product', 'name'],
              key: 'product_name'
            },
            { title: 'ចំនួន', dataIndex: 'quantity', key: 'quantity' },
            {
              title: 'តម្លៃ (ឯកតា)',
              dataIndex: 'unit_price',
              key: 'unit_price'
            },
            {
              title: 'សរុប',
              dataIndex: 'total_line_price',
              key: 'total_line_price'
            },
            {
              title: 'ថ្ងៃបង្កើត',
              dataIndex: 'created_at',
              key: 'created_at',
              render: val => dateClient(val)
            },
            {
              title: 'សកម្មភាព',
              key: 'action',
              align: 'center',
              render: data => (
                <Space>
                  <Button
                    type='text'
                    onClick={() => handleEdit(data)}
                    icon={<CiEdit style={{ fontSize: 18, color: '#004EBC' }} />}
                  />
                  <Button
                    type='text'
                    danger
                    onClick={() => handleDelete(data)}
                    icon={<MdDelete style={{ fontSize: 18 }} />}
                  />
                </Space>
              )
            }
          ]}
        />

        <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
          <span className='text-gray-600 text-sm'>
            សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b>{' '}
            ទិន្នន័យ
          </span>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['10', '20', '50', '100']}
            showTotal={(total, range) => `${range[0]}-${range[1]} នៃ ${total}`}
          />
        </div>
      </div>
    </MainPage>
  )
}

export default PurchaseOrderItemPage