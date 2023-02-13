import React, { useEffect, useState, useRef } from 'react';
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
  // DatePicker,
} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  fetchMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} from '../actions';
import './index.scss';
import Upload from '../../../utilities/upload';
import ReactS3Client from '../../../utilities/reactS3Client';
import GoogleMap from './googleMap';
import BusinessHours from './businessHours';
import { fetchCategories } from '../../categories/actions';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;
const { Option } = Select;

const Merchant = ({
  onFetchMerchants,
  onCreateMerchant,
  onUpdateMerchant,
  onDeleteMerchant,
  onFetchCategories,
  categories,
  loading,
}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState('');
  const [location, setLocation] = useState({});
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
      title: 'Business Name',
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
    //   render: (type) => <div>{type === 3 ? 'Merchant' : 'Customer'}</div>,
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
          <a onClick={() => handleEdit(data)}>Edit</a>
          <a onClick={() => handleDelete(Number(id))}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleDelete = (id) => {
    onDeleteMerchant(id).then(() => {
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
    setLocation({});
    form.resetFields();
  };

  const handleEdit = (data) => {
    setLocation({
      title: 'Pinned Location',
      name: data && data.address,
      position: { lat: data.latitude, lng: data.longitude },
      address: data && data.address,
    });
    setIsModalVisible(true);
    setIsModalEdit(true);
    setEditId(data.id);
    console.log('edit data', data);

    form.setFieldsValue({
      ...data,
      businessHours:
        data &&
        data.businessHours &&
        data.businessHours.map((x) => {
          return {
            ...x,
            open: moment(new Date(x.open), 'hh:mm A'),
            close: moment(new Date(x.close), 'hh:mm A'),
          };
        }),
    });
    ref && ref.current && ref.current.handleDeleteImage();
  };

  const onFinish = (formValue) => {
    const uploader = ReactS3Client('users');

    if (isModalEdit) {
      // Edit Mode
      let newArr = [...tableData]; // copying the old datas array
      let editData = {
        id: Number(editId),
        ...formValue,
        latitude: location && location.position.lat,
        longitude: location && location.position.lng,
        address: location && location.address,
      };
      let foundIndex = newArr.findIndex((x) => x.id === editId);
      newArr[foundIndex] = { ...newArr[foundIndex], ...editData };

      if (file === '') {
        onUpdateMerchant(editData).then(() => {
          setTableData(newArr);
          setEditId('');
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onUpdateMerchant({
              ...editData,
              image: data.key,
            }).then(() => {
              newArr[foundIndex].image = data.key;
              setTableData(newArr);
              setEditId('');
            });
          })
          .catch((err) => console.log('error', err));
      }
    } else {
      // Add Mode
      let newData = {
        ...formValue,
        type: 3,
        latitude: location && location.position.lat,
        longitude: location && location.position.lng,
        address: location && location.address,
      };

      if (file === '') {
        onCreateMerchant({
          ...newData,
          image: '',
        }).then((res) => {
          setTableData([res, ...tableData]);
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onCreateMerchant({
              ...newData,
              image: data.key,
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
    onFetchMerchants().then((res) => {
      setTableData(res);
    });
    onFetchCategories();
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
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey='id'
          />
        </Col>
      </Row>

      <Modal
        title={`${isModalEdit ? 'Edit' : 'Add'} Merchant`}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1300}
        className='form-modal'
        footer={[
          <Button form='myForm' key='submit' htmlType='submit'>
            Submit
          </Button>,
        ]}
      >
        <Form layout='vertical' form={form} id='myForm' onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col sm={24} lg={8}>
              <Form.Item
                name='name'
                label='Business Name'
                rules={[{ required: true }]}
              >
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
                label='Email'
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

              <Form.Item
                name='businessType'
                label='Business Type'
                rules={[{ required: true }]}
              >
                <Select allowClear>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category) => (
                      <Option value={category.id}>{category.title}</Option>
                    ))}
                </Select>
              </Form.Item>

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
              <BusinessHours form={form} />
            </Col>
            <Col sm={24} lg={8}>
              <Row>
                <Col span={24} style={{ height: '300px' }}>
                  <GoogleMap location={location} setLocation={setLocation} />
                </Col>
                <Col span={24}>{location && location.address}</Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ margin: 10 }}>
                    <span>Image</span>
                    <Upload
                      value={
                        form.getFieldsValue(true).image &&
                        `${STORAGE_URL}/${form.getFieldsValue(true).image}`
                      }
                      setFile={(e) => setFile(e)}
                      ref={ref}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    merchants: state.merchants.merchantsData,
    loading: state.merchants.merchantsLoading,
    categories: state.categories.categoriesData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchMerchants: (data) => dispatch(fetchMerchants(data)),
    onCreateMerchant: (data) => dispatch(createMerchant(data)),
    onUpdateMerchant: (data) => dispatch(updateMerchant(data)),
    onDeleteMerchant: (data) => dispatch(deleteMerchant(data)),
    onFetchCategories: (data) => dispatch(fetchCategories(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Merchant);
