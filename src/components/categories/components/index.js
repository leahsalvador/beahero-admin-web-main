import React, { useEffect, useRef, useState } from 'react';
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
} from 'antd';
import { connect } from 'react-redux';
import {
  fetchCategories,
  fetchCategoriesMerchant,
  createCategory,
  deleteCategory,
  updateCategory,
  fetchMerchants,
} from '../actions';
import './index.scss';
import Upload from '../../../utilities/upload';
import { getUser } from '../../../utilities/token';
import ReactS3Client from '../../../utilities/reactS3Client';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;
const { Option } = Select;

const Categories = (props) => {
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
  const [userId, setUserId] = useState([]);
  // const [merchantsData, setMerchantsData] = useState([]);
  const ref = useRef(null);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    props.onDeleteCategory(id).then(() => {
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
    setFile('');
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
    const uploader = ReactS3Client('categories');

    if (isModalEdit) {
      // Edit Mode
      let newArr = [...tableData]; // copying the old datas array
      let editData = { id: Number(editId), ...formValue };
      let foundIndex = newArr.findIndex((x) => x.id === editId);
      newArr[foundIndex] = { ...newArr[foundIndex], ...editData };

      if (file === '') {
        props.onUpdateCategory(editData).then(() => {
          setTableData(newArr);
          setEditId('');
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            props
              .onUpdateCategory({ ...editData, image: data.key })
              .then(() => {
                newArr[foundIndex].image = data.key;
                setTableData(newArr);
                setEditId('');
              });
          })
          .catch((err) => {
            console.error('error', err);
          });
      }
    } else {
      // Add Mode
      if (file === '') {
        props
          .onCreateCategory({ ...formValue, image: '', userId })
          .then((res) => {
            setTableData([res, ...tableData]);
          });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            props
              .onCreateCategory({ ...formValue, image: data.key, userId })
              .then((res) => {
                setTableData([res, ...tableData]);
              });
          })
          .catch((err) => {
            console.error('error', err);
          });
      }
    }

    handleCancel();
  };

  // const onSelectMerchant = (merchantId) => {
  //   props.onFetchCategoriesMerchant(merchantId).then((res) => {
  //     setTableData(res);
  //   });

  //   console.log('Selected Merchant ID', merchantId);
  // };

  useEffect(() => {
    // const type = getUser().type;
    // const currentUserType =
    //   type === 4
    //     ? 'admin'
    //     : type === 3
    //     ? 'merchant'
    //     : type === 2
    //     ? 'riders'
    //     : 'customers';

    // if admin get merchants
    // currentUserType === "admin" &&
    //   props.onFetchMerchants().then((res) => {
    //     console.log("merchants data", res);
    //     setMerchantsData(res);
    //   });

    // set current user id
    setUserId(getUser().id);
    console.log('user', getUser());

    // fetch current user categories if not admin
    // currentUserType !== "admin" &&
    //   props.onFetchCategories().then((res) => {
    //     setTableData(res);
    //   });

    props.onFetchCategories().then((res) => {
      setTableData(res);
    });
  }, []);

  return (
    <Layout className='categories-container'>
      <Row justify='space-between' align='bottom' className='page-header'>
        <Col>
          {/* <Row>
            {merchantsData && merchantsData.length !== 0 && (
              <Col>
                <Select
                  placeholder="Select Merchant"
                  style={{ width: 200 }}
                  onChange={onSelectMerchant}
                >
                  {merchantsData.map((merchant) => (
                    <Option value={merchant.id}>{merchant.email}</Option>
                  ))}
                </Select>
              </Col>
            )}
          </Row> */}
        </Col>

        <Col>
          <Button type='primary' onClick={handleAdd}>
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
        title={`${isModalEdit ? 'Edit' : 'Add'} Category`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button form='myForm' key='submit' htmlType='submit'>
            Submit
          </Button>,
        ]}
      >
        <Form layout='vertical' form={form} id='myForm' onFinish={onFinish}>
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
          <Form.Item name='title' label='Title' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='status' label='Status' rules={[{ required: true }]}>
            <Select allowClear>
              <Option value={1}>Active</Option>
              <Option value={2}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    categories: state.categories.categoriesData,
    loading: state.categories.categoriesLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchCategories: (data) => dispatch(fetchCategories(data)),
    onCreateCategory: (data) => dispatch(createCategory(data)),
    onUpdateCategory: (data) => dispatch(updateCategory(data)),
    onDeleteCategory: (data) => dispatch(deleteCategory(data)),
    onFetchMerchants: (data) => dispatch(fetchMerchants(data)),
    onFetchCategoriesMerchant: (data) =>
      dispatch(fetchCategoriesMerchant(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
