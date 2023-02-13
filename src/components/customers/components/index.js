import React, { useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Layout,
  Select,
  Table,
  Tag,
  Form,
  Modal,
  Input,
  Space,
  Button,
} from 'antd';
import { connect } from 'react-redux';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../actions';
import './index.scss';
import Upload from '../../../utilities/upload';
import ReactS3Client from '../../../utilities/reactS3Client';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;
const { Option } = Select;

const Customer = ({
  onFetchCustomers,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  customers,
  loading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState('');
  const [form] = Form.useForm();
  const ref = useRef(null);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (item) => {
        return item ? (
          <img
            className='table-index-image'
            src={`${STORAGE_URL}/${item}`}
            alt='img'
          />
        ) : (
          <div className='table-index-image'>No Image</div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Middle Name',
      dataIndex: 'middleName',
      key: 'middleName',
    },
    // {
    //   title: 'Birth Date',
    //   dataIndex: 'birthdate',
    //   key: 'birthdate',
    // },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: 'Subscription Plan',
    //   dataIndex: 'subscriptionPlan',
    //   key: 'subscriptionPlan',
    //   render: (plan) => <div>{plan === 1 ? 'Premium' : 'Free'}</div>,
    // },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    //   render: (type) => <div>{type === 2 ? 'Rider' : 'Customer'}</div>,
    // },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <>
          {
            <Tag color={status === 1 ? 'green' : 'red'} key={status}>
              {status === 1 ? 'Active' : 'Inactive'}
            </Tag>
          }
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: ({ id }, data) => (
        <Space size='middle'>
          {/* eslint-disable-next-line */}
          <a onClick={() => handleEdit(data)}>Edit</a>
          <a onClick={() => handleDelete(Number(id))}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleDelete = (id) => {
    onDeleteCustomer(id).then(() => {
      const filteredData = tableData.filter(
        (value) => Number(value.id) !== Number(id)
      );
      setTableData(filteredData);
    });
  };

  const handleAdd = () => {
    setIsModalVisible(true);
    setIsModalEdit(false);
    setFile('');
    ref && ref.current && ref.current.handleDeleteImage();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (data) => {
    setIsModalVisible(true);
    setIsModalEdit(true);
    setEditId(data.id);
    form.setFieldsValue(data);
    ref && ref.current && ref.current.handleDeleteImage();
  };

  const onFinish = (formValue) => {
    const uploader = ReactS3Client('users');

    if (isModalEdit) {
      // Edit Mode
      let newArr = [...tableData]; // copying the old datas array
      let editData = { id: Number(editId), ...formValue };
      let foundIndex = newArr.findIndex((x) => x.id === editId);
      newArr[foundIndex] = { ...newArr[foundIndex], ...editData };

      if (file === '') {
        onUpdateCustomer(editData).then(() => {
          setTableData(newArr);
          setEditId('');
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onUpdateCustomer({ ...editData, image: data.key }).then(() => {
              newArr[foundIndex].image = data.key;
              setTableData(newArr);
              setEditId('');
            });
          })
          .catch((err) => console.log('error', err));
      }
    } else {
      // Add Mode
      if (file === '') {
        onCreateCustomer({
          ...formValue,
          image: '',
          type: 1,
        }).then((res) => {
          setTableData([res, ...tableData]);
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onCreateCustomer({
              ...formValue,
              image: data.key,
              type: 1,
            }).then((res) => {
              setTableData([res, ...tableData]);
            });
          })
          .catch((err) => console.log('error', err));
      }
    }

    handleCancel();
  };

  useEffect(() => {
    onFetchCustomers().then((res) => {
      setTableData(res);
    });
  }, []);

  return (
    <Layout className='customer-container'>
      <Row justify='space-between' align='bottom' className='page-header'>
        <Col></Col>
        <Col>
          <Button type='primary' onClick={handleAdd}>
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table columns={columns} dataSource={tableData} loading={loading} />
        </Col>
      </Row>

      <Modal
        title={`${isModalEdit ? 'Edit' : 'Add'} Customer`}
        visible={isModalVisible}
        footer={[
          <Button form='myForm' key='submit' htmlType='submit'>
            Submit
          </Button>,
        ]}
        onCancel={handleCancel}
        width={1000}
      >
        <Form layout='vertical' form={form} id='myForm' onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col sm={24} lg={8}>
              <Form.Item name='name' label='Name' rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name='lastName'
                label='Last Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='firstName'
                label='First Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='middleName'
                label='Middle Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                name='birthdate'
                label='Birth Date'
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item> */}

              <Form.Item
                name='phoneNumber'
                label='Phone Number'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={24} lg={8}>
              {/* <Form.Item
                name='address'
                label='Address'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item> */}
              <Form.Item
                name='email'
                label='email'
                rules={[{ required: true }]}
              >
                <Input type='email' />
              </Form.Item>
              {!isModalEdit && (
                <Form.Item
                  name='password'
                  label='Password'
                  rules={[{ required: true }]}
                >
                  <Input type='password' />
                </Form.Item>
              )}

              {/* <Form.Item
                name='subscriptionPlan'
                label='Subscription Plan'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='Select a option and change subscription plan'
                  allowClear
                >
                  <Option value={0}>Free</Option>
                  <Option value={1}>Premium</Option>
                </Select>
              </Form.Item> */}
              <Form.Item
                name='status'
                label='Status'
                rules={[{ required: true }]}
              >
                <Select allowClear>
                  <Option value={1}>Active</Option>
                  <Option value={2}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={24} lg={8}>
              <div style={{ margin: 10 }}>
                <span>Image</span>
                <Upload
                  value={
                    form.getFieldsValue(true).image &&
                    `${STORAGE_URL}/${form.getFieldsValue(true).image}`
                  }
                  ref={ref}
                  setFile={(e) => setFile(e)}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    customers: state.customers.customersData,
    loading: state.customers.customersLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchCustomers: (data) => dispatch(fetchCustomers(data)),
    onCreateCustomer: (data) => dispatch(createCustomer(data)),
    onUpdateCustomer: (data) => dispatch(updateCustomer(data)),
    onDeleteCustomer: (data) => dispatch(deleteCustomer(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
