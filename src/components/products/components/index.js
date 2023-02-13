import React, { useEffect, useState, useRef } from 'react';
import {
  Row,
  Col,
  Layout,
  Button,
  Input,
  Select,
  Form,
  Modal,
  Table,
  Tag,
  Space,
  Switch,
  InputNumber,
} from 'antd';
import { connect } from 'react-redux';
import {
  fetchProducts,
  fetchProductsMerchant,
  createProduct,
  deleteProduct,
  updateProduct,
  fetchMerchants,
  fetchCategories,
} from '../actions';
import './index.scss';
import Upload from '../../../utilities/upload';
import { getUser } from '../../../utilities/token';
import ReactS3Client from '../../../utilities/reactS3Client';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;
const { Option } = Select;

const Products = (props) => {
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
      title: 'Category ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (text, data) => data.category && data.category.title,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Stocks',
      dataIndex: 'stocks',
      key: 'stocks',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState('');
  const [merchantsData, setMerchantsData] = useState([]);
  const [userId, setUserId] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);
  const [form] = Form.useForm();
  const ref = useRef(null);

  const handleDelete = (id) => {
    props.onDeleteProduct(id).then(() => {
      const filteredData = tableData.filter(
        (value) => Number(value.id) !== Number(id)
      );
      setTableData(filteredData);
    });
  };

  const getUserType = () => {
    const type = getUser().type;
    const currentUserType =
      type === 4
        ? 'admin'
        : type === 3
        ? 'merchant'
        : type === 2
        ? 'riders'
        : 'customers';

    return currentUserType;
  };

  const handleAdd = () => {
    if (getUserType() === 'merchant') {
      const merchantId = getUser().id;
      form.setFieldsValue({ merchantId });
    }

    if (getUserType() === 'admin') {
      form.setFieldsValue({ merchantId: selectedMerchantId });
    }

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

  const adminOrMerchant = () => {
    return selectedMerchantId ? selectedMerchantId : userId;
  };

  const onFinish = (formValue) => {
    const uploader = ReactS3Client('products');

    if (isModalEdit) {
      // Edit Mode
      let newArr = [...tableData]; // copying the old datas array
      let editData = { id: Number(editId), ...formValue };
      let foundIndex = newArr.findIndex((x) => x.id === editId);
      newArr[foundIndex] = { ...newArr[foundIndex], ...editData };

      if (file === '') {
        props.onUpdateProduct(editData).then(() => {
          props.onFetchProductsMerchant(adminOrMerchant()).then((res) => {
            setTableData(res);
          });
          setEditId('');
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            props.onUpdateProduct({ ...editData, image: data.key }).then(() => {
              props.onFetchProductsMerchant(adminOrMerchant()).then((res) => {
                setTableData(res);
              });
              setEditId('');
            });
          })
          .catch((err) => console.log('error', err));
      }
    } else {
      // Add Mode
      if (file === '') {
        props
          .onCreateProduct({
            ...formValue,
            image: '',
            userId: adminOrMerchant(),
          })
          .then(() => {
            props.onFetchProductsMerchant(adminOrMerchant()).then((res) => {
              setTableData(res);
            });
          });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            props
              .onCreateProduct({
                ...formValue,
                image: data.key,
                userId: adminOrMerchant(),
              })
              .then(() => {
                props.onFetchProductsMerchant(adminOrMerchant()).then((res) => {
                  setTableData(res);
                });
              });
          })
          .catch((err) => console.log('error', err));
      }
    }

    handleCancel();
  };

  const onSelectMerchant = (merchantId) => {
    setSelectedMerchantId(merchantId);

    props.onFetchProductsMerchant(merchantId).then((res) => {
      setTableData(res);
    });

    console.log('Selected Merchant ID', merchantId);
  };

  useEffect(() => {
    // if admin get merchants
    getUserType() === 'admin' &&
      props.onFetchMerchants().then((res) => {
        console.log('merchants data', res);
        setMerchantsData(res);
      });

    // set current user id
    setUserId(getUser().id);
    console.log('user', getUser());

    getUserType() === 'merchant' &&
      props.onFetchProductsMerchant(getUser().id).then((res) => {
        setTableData(res);
      });

    props.onFetchCategories();
  }, []);

  return (
    <Layout className='products-container'>
      <Row justify='space-between' align='bottom' className='page-header'>
        <Col>
          {merchantsData && merchantsData.length !== 0 && (
            <Col>
              <Select
                placeholder='Select Merchant'
                style={{ width: 200 }}
                onChange={onSelectMerchant}
              >
                {merchantsData.map((merchant) => (
                  <Option
                    value={merchant.id}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {merchant.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Col>
        <Col>
          <Button
            type='primary'
            onClick={handleAdd}
            disabled={getUserType() === 'admin' && !selectedMerchantId}
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={tableData}
            loading={props.loading}
          />
        </Col>
      </Row>

      <Modal
        title={`${isModalEdit ? 'Edit' : 'Add'} Product`}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button form='myForm' key='submit' htmlType='submit'>
            Submit
          </Button>,
        ]}
      >
        {console.log('categoriescategories', props.categories)}
        <Form layout='vertical' form={form} name='myForm' onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col sm={24} lg={8}>
              <Form.Item name='merchantId' label='Merchant ID' hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                name='categoryId'
                label='Category ID'
                rules={[{ required: true }]}
              >
                <Select optionLabelProp='label'>
                  {props.categories.map((data, index) => {
                    return (
                      <Option key={index} value={data.id} label={data.title}>
                        {data.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name='title'
                label='Title'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='description'
                label='Description'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='price'
                label='Price'
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              {/* <Form.Item name='cost' label='Cost' rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item> */}
            </Col>
            <Col sm={24} lg={8}>
              <Form.Item name='meta' label='Meta' rules={[{ required: true }]}>
                <Input placeholder='(Ex: Fries, Burger)' />
              </Form.Item>
              <Form.Item
                name='stocks'
                label='Stocks'
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name='rating'
                label='Rating'
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
              {/* <Form.Item
                name='productType'
                label='Product Type'
                rules={[{ required: true }]}
              >
                <Select placeholder='Please select product type' allowClear>
                  <Option value={1}>Ala Carte</Option>
                  <Option value={2}>Package</Option>
                  <Option value={3}>Bundle</Option>
                  <Option value={4}>Promo</Option>
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
              <Form.Item name='rewardPoints' label='Allow Reward'>
                <Switch onChange={() => {}} />
              </Form.Item>
              <Form.Item name='allowReferral' label='Allow Referral'>
                <Switch onChange={() => {}} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    products: state.products.productsData,
    loading: state.products.productsLoading,
    categories: state.categories.categoriesData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchProducts: (data) => dispatch(fetchProducts(data)),
    onCreateProduct: (data) => dispatch(createProduct(data)),
    onUpdateProduct: (data) => dispatch(updateProduct(data)),
    onDeleteProduct: (data) => dispatch(deleteProduct(data)),
    onFetchMerchants: (data) => dispatch(fetchMerchants(data)),
    onFetchProductsMerchant: (data) => dispatch(fetchProductsMerchant(data)),
    onFetchCategories: (data) => dispatch(fetchCategories(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
