import React, { useEffect, useState } from 'react';
import { Row, Col, Layout, Button, Form, Input, Spin, Select } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { getProfile, editProfile } from '../actions';
import './index.scss';
import { getUser } from '../../../utilities/token';
import BusinessHours from '../../merchants/components/businessHours';
import GoogleMap from '../../merchants/components/googleMap';
import Upload from '../../../utilities/upload';
import ReactS3Client from '../../../utilities/reactS3Client';
import { fetchCategories } from '../../categories/actions';

const { Option } = Select;
const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;

const Profile = (props) => {
  const {
    onGetProfile,
    onEditProfile,
    profileProps,
    loadingProps,
    onFetchCategories,
    categories,
  } = props;
  const [profileState, setProfileState] = useState({});
  const [location, setLocation] = useState({});
  const [file, setFile] = useState('');

  const [form] = Form.useForm();

  const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p]);

  const onFinish = async (formValues) => {
    const uploader = ReactS3Client('users');
    const {
      address,
      position: { lat, lng },
    } = location;

    const payload = {
      ...formValues,
      latitude: lat,
      longitude: lng,
      address,
      id: getUser().id,
    };

    if (file === '') {
      await onEditProfile(payload);
    } else {
      uploader
        .uploadFile(file, file.name)
        .then(async (img) => {
          await onEditProfile({
            ...payload,
            image: img.key,
          });

          await onGetProfile(getUser().id).then((data) => {
            setProfileState(data);
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
          });
        })
        .catch((err) => console.log('error', err));
    }
  };

  const onFormChange = (form) => {
    const formName = form[0].name[0];
    const formValue = form[0].value;
    setProfileState((prev) => ({ ...prev, [formName]: formValue }));
  };

  const updateStateOnSetLocation = (data) => {
    setLocation(data);
    const {
      position: { lat, lng },
      address,
    } = data;
    setProfileState((prev) => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lng,
    }));
  };

  useEffect(() => {
    onGetProfile(getUser().id).then((data) => {
      setProfileState(data);

      setLocation({
        title: 'Pinned Location',
        name: data && data.address,
        position: { lat: data.latitude, lng: data.longitude },
        address: data && data.address,
      });

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
    });
    onFetchCategories();
  }, [form, onGetProfile, onFetchCategories]);

  console.log('Profile State', profileState);
  console.log('Profile Props', profileProps);
  console.log('location', location);

  if (loadingProps)
    return (
      <Layout className='profile-container'>
        <Spin />
      </Layout>
    );

  return (
    <Layout className='profile-container'>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form
            layout='vertical'
            form={form}
            id='myForm'
            onFinish={onFinish}
            onFieldsChange={onFormChange}
            className='form'
          >
            <Row gutter={[16, 16]}>
              <Col sm={24} lg={8}>
                <Form.Item
                  rules={[{ required: true }]}
                  name='name'
                  label='Name'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true }]}
                  name='firstName'
                  label='First Name'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true }]}
                  name='lastName'
                  label='Last Name'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true }]}
                  name='middleName'
                  label='Middle Name'
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={24} lg={8}>
                <Form.Item
                  rules={[{ required: true }]}
                  name='email'
                  label='Email'
                >
                  <Input />
                </Form.Item>
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
                <BusinessHours form={form} />
              </Col>
              <Col sm={24} lg={8}>
                <Row>
                  <Col span={24} style={{ height: '300px' }}>
                    <GoogleMap
                      location={location}
                      setLocation={updateStateOnSetLocation}
                    />
                  </Col>
                  <Col span={24}>{location && location.address}</Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div style={{ margin: 10 }}>
                      <span>Image</span>
                      <Upload
                        value={
                          profileState &&
                          profileState.image &&
                          `${STORAGE_URL}/${profileState.image}`
                        }
                        setFile={(e) => setFile(e)}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col span={24} align='right'>
                <Button
                  form='myForm'
                  key='submit'
                  htmlType='submit'
                  disabled={objectsEqual(profileProps, profileState) && !file}
                >
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    profileProps: state.profile.profileData,
    loadingProps: state.profile.profileLoading,
    categories: state.categories.categoriesData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onGetProfile: (data) => dispatch(getProfile(data)),
    onEditProfile: (data) => dispatch(editProfile(data)),
    onFetchCategories: (data) => dispatch(fetchCategories(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
