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
  Empty,
  InputNumber,
} from 'antd';
import { connect } from 'react-redux';
import {
  fetchRiders,
  createRider,
  updateRider,
  deleteRider,
  createWallet,
  updateWallet,
} from '../actions';
import './index.scss';
import Upload from '../../../utilities/upload';
import ReactS3Client from '../../../utilities/reactS3Client';
import getCommaSeparatedTwoDecimalsNumber from '../../../utilities/formatNumber';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;
const { Option } = Select;

const Rider = ({
  onFetchRider,
  onCreateRider,
  onUpdateRider,
  onDeleteRider,
  riders,
  loading,
  onCreateWallet,
  onUpdateWallet,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState('');
  const [isModalWalletVisible, setIsModalWalletVisible] = useState(false);
  const [wallet, setWallet] = useState({});

  const [form] = Form.useForm();
  const [formWallet] = Form.useForm();

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
          <a onClick={() => handleViewWallet(data)}>Load Wallet</a>
          <a onClick={() => handleEdit(data)}>Edit</a>
          <a onClick={() => handleDelete(Number(id))}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleDelete = (id) => {
    onDeleteRider(id).then(() => {
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

  const handleViewWallet = (data) => {
    setIsModalWalletVisible(true);
    setWallet(data);
  };

  const handleCancelWallet = () => {
    setIsModalWalletVisible(false);
    setWallet({});
    formWallet.resetFields();
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
        onUpdateRider(editData).then(() => {
          setTableData(newArr);
          setEditId('');
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onUpdateRider({ ...editData, image: data.key }).then(() => {
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
        onCreateRider({ ...formValue, image: '', type: 2 }).then((res) => {
          setTableData([res, ...tableData]);
        });
      } else {
        uploader
          .uploadFile(file, file.name)
          .then((data) => {
            onCreateRider({ ...formValue, image: data.key, type: 2 }).then(
              (res) => {
                setTableData([res, ...tableData]);
              }
            );
          })
          .catch((err) => console.log('error', err));
      }
    }

    handleCancel();
  };

  const onFinishWallet = (walletForm) => {
    console.log(walletForm);
    const params = {
      walletId: wallet && wallet.wallet && wallet.wallet.id,
      amount:
        wallet && wallet.wallet && wallet.wallet.amount + walletForm.amount,
    };
    onUpdateWallet(params).then(() => {
      handleCancelWallet();
      onFetchRider().then((res) => {
        setTableData(res);
      });
    });
  };

  const onCreateRiderWallet = () => {
    onCreateWallet({ riderId: wallet && wallet.id, amount: 0, status: 1 }).then(
      (res) => {
        onFetchRider().then((riders) => {
          setTableData(riders);
          setWallet(riders.find((rider) => rider.id === res.riderId));
        });
      }
    );
  };

  useEffect(() => {
    onFetchRider().then((res) => {
      setTableData(res);
    });
  }, []);

  return (
    <Layout className='rider-container'>
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
        title={`${isModalEdit ? 'Edit' : 'Add'} Rider`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button form='myForm' key='submit' htmlType='submit'>
            Submit
          </Button>,
        ]}
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
                name='subscriptionPlan'
                label='Subscription Plan'
                rules={[{ required: true }]}
                initialValue={0}
              >
                <Select
                  placeholder='Select subscription plan'
                  allowClear
                  disabled
                >
                  <Option value={0}>Free</Option>
                  <Option value={1}>Premium</Option>
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

      <Modal
        title={`${wallet && wallet.name} Wallet`}
        visible={isModalWalletVisible}
        onCancel={handleCancelWallet}
        footer={[
          <Button form='walletForm' key='submit' htmlType='submit'>
            Load
          </Button>,
        ]}
        className='wallet-modal'
      >
        {console.log('wallet', wallet)}
        <Form form={formWallet} id='walletForm' onFinish={onFinishWallet}>
          {wallet && wallet.wallet ? (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                Current Balance:{' '}
                <b>
                  ₱{getCommaSeparatedTwoDecimalsNumber(wallet.wallet.amount)}
                </b>
              </Col>
              <Col span={24}>
                <Form.Item
                  name='amount'
                  label='Amount to load'
                  rules={[{ required: true, type: 'number', min: 10 }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Empty
              image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
              imageStyle={{
                height: 60,
              }}
              description={<span>Rider have no wallet.</span>}
            >
              <Button type='primary' onClick={onCreateRiderWallet}>
                Create Wallet
              </Button>
            </Empty>
          )}
        </Form>
      </Modal>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    riders: state.riders.ridersData,
    loading: state.riders.ridersLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchRider: (data) => dispatch(fetchRiders(data)),
    onCreateRider: (data) => dispatch(createRider(data)),
    onUpdateRider: (data) => dispatch(updateRider(data)),
    onDeleteRider: (data) => dispatch(deleteRider(data)),
    onCreateWallet: (data) => dispatch(createWallet(data)),
    onUpdateWallet: (data) => dispatch(updateWallet(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rider);
