/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import * as _ from 'lodash';
import './App.scss';
import 'antd/dist/antd.css';
import { NotFound } from './notFound';
import Login from './login/component';
import Dashboard from './dashboard/components/index';
import Rider from './riders/components/index';
import Customer from './customers/components/index';
import Employee from './employee/components/index';
import Categories from './categories/components/index';
import Products from './products/components/index';
import ProfitAndLost from './profit_and_lost/components/index';
import Merchants from './merchants/components/index';
import Rates from './rates/components/index';
import Orders from './orders/components/index';
import Profile from './profile/components/index';

import { getUser } from '../utilities/token';

import { Layout, Modal, Row, Col, Card, Menu, Typography } from 'antd';
import Axios from 'axios';
import Sider from './shared/Sider';
import {
  ExclamationCircleOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  CarOutlined,
  ContainerOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const { Content, Header } = Layout;
moment.updateLocale(moment.locale(), { invalidDate: 'N/A' });
const { Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

const axiosError = () => {
  Modal.error({
    title: 'Oops! Something when wrong.',
    content: 'You will be redirected to login page.',
    onOk: () => logoutMe(),
  });
};

const logoutMe = () => {
  localStorage.removeItem('SESSION_TOKEN');
  window.location.replace('/');
  window.location.reload();
};

Axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    axiosError();
    return Promise.reject(error);
  }
);

const paths = [
  {
    default: true,
    exact: true,
    slug: 'Home',
    header: 'Home',
    route: '/',
    component: Dashboard,
    icon: <HomeOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Employee',
    header: 'Employee',
    route: '/employee',
    component: Employee,
    icon: <UsergroupAddOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Riders',
    header: 'Riders',
    route: '/manage/riders',
    component: Rider,
    icon: <CarOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Customers',
    header: 'Customers',
    route: '/manage/customers',
    component: Customer,
    icon: <UsergroupAddOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Categories',
    header: 'Categories',
    route: '/manage/categories',
    component: Categories,
    icon: <ContainerOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Products',
    header: 'Products',
    route: '/merchants/products',
    component: Products,
    icon: <UnorderedListOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'ProfitAndLost',
    header: 'Profit And Lost',
    route: '/reports/profit-and-lost',
    component: ProfitAndLost,
    icon: <UnorderedListOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Merchants',
    header: 'Merchants',
    route: '/manage/merchants',
    component: Merchants,
    icon: <UnorderedListOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Rates',
    header: 'Rates',
    route: '/manage/rates',
    component: Rates,
    icon: <UnorderedListOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Orders',
    header: 'Orders',
    route: '/merchants/orders',
    component: Orders,
    icon: <UnorderedListOutlined />,
  },
  {
    default: true,
    exact: true,
    slug: 'Profile',
    header: 'Profile',
    route: '/settings/profile',
    component: Profile,
    icon: <UnorderedListOutlined />,
  },
];

const isLocalStorageEmpty = () => {
  let strResult;
  if (localStorage.getItem('SESSION_TOKEN') === null) {
    strResult = true;
  } else {
    strResult = false;
  }
  return strResult;
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      siderCollapse: true,
      activeTab: 0,
      parentMenu: '',
      childMenu: '',
      userType: '',
      userName: '',
    };
    this.onChangeParentMenu = this.onChangeParentMenu.bind(this);
  }

  componentWillMount() {
    window.document.title = 'BeaHero';
    const currentPathIndex = paths.findIndex(
      (data) => data.route === this.props.location.pathname
    );
    this.setState({ activeTab: currentPathIndex });

    if (isLocalStorageEmpty()) {
      this.setState({ isLoggedIn: false });
    } else {
      const { type, name } = getUser();

      const currentUserType =
        type === 4
          ? 'admin'
          : type === 3
          ? 'merchant'
          : type === 2
          ? 'riders'
          : 'customers';

      this.setState({
        userType: currentUserType,
        isLoggedIn: true,
        userName: name,
      });
    }
  }

  onChangeParentMenu(menu) {
    this.setState({ parentMenu: menu });

    const pathFound = paths.filter(
      (path) => path.route.split('/')[1] === menu.toLowerCase()
    );

    // console.log("found", pathFound[0].route);

    this.props.history.push({
      pathname: pathFound[0].route,
    });
  }

  getChildMenu() {
    let returnMenu = [];
    const reports = ['ProfitAndLost'];
    const merchants = ['Products', 'Orders'];
    const manage = ['Riders', 'Customers', 'Merchants', 'Categories', 'Rates'];
    const settings = ['Profile'];

    switch (this.props.location.pathname.split('/')[1]) {
      case 'reports':
        reports.map((item) => {
          const found = paths.find((path) => item === path.slug);
          returnMenu.push(found);
        });
        break;
      case 'merchants':
        merchants.map((item) => {
          const found = paths.find((path) => item === path.slug);
          returnMenu.push(found);
        });
        break;
      case 'manage':
        manage.map((item) => {
          const found = paths.find((path) => item === path.slug);
          returnMenu.push(found);
        });
        break;
      case 'settings':
        settings.map((item) => {
          const found = paths.find((path) => item === path.slug);
          returnMenu.push(found);
        });
        break;
      default:
        break;
    }
    return returnMenu;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedIn !== nextProps.loggedIn && nextProps.loggedIn) {
      this.setState({ isLoggedIn: true });
      window.location.reload();
    }
  }

  toggle = () => {
    this.setState({
      siderCollapse: !this.state.siderCollapse,
    });
  };

  logout() {
    Modal.confirm({
      title: 'Do you want to logout?',
      icon: <ExclamationCircleOutlined />,
      content: 'You will redirected to login page',
      onOk() {
        logoutMe();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    switch (this.state.isLoggedIn) {
      case false:
        return (
          <Layout className='app-layout'>
            <Login />
          </Layout>
        );
      case true:
        return (
          <Layout style={{ height: '100vh' }}>
            <Sider
              userType={this.state.userType}
              siderCollapse={this.state.siderCollapse}
              activeTab={this.state.activeTab}
              paths={paths}
              onChangeParentMenu={this.onChangeParentMenu}
              {...this.props}
              location={this.props.location}
              history={this.props.history}
            />
            <Layout className='site-layout'>
              <Header
                className='site-layout-background'
                style={{
                  padding: 0,
                  backgroundColor: '#FA3F63',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {/* Selected Menu */}
                <Text
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {this.props.location.pathname.split('/')[1] === ''
                    ? 'Home'
                    : this.props.location.pathname.split('/')[1] === 'manage'
                    ? 'Manage System'
                    : this.props.location.pathname.split('/')[1]}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    textTransform: 'capitalize',
                    marginRight: '16px',
                  }}
                >
                  {this.state.userName && `Hello, ${this.state.userName}`}
                </Text>

                {/* {React.createElement(
                  this.state.siderCollapse
                    ? MenuUnfoldOutlined
                    : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: this.toggle,
                    style: { color: "white", fontSize: 20, padding: "10px" },
                  }
                )} */}
              </Header>
              <Content
                className='site-layout-background'
                style={{
                  minHeight: 280,
                  overflow: 'auto',
                }}
              >
                {/* <Row style={{ margin: 10 }}>
                  <Col span={24}>
                    <Card className='card-filter'>
                      <Row gutter={8}>
                        <Col lg={4} md={4} sm={24} xs={24}>
                          <div
                            style={{
                              background: '#FA3F63',
                              color: 'white',
                              padding: '4px',
                            }}
                          >
                            Clear All Filters
                          </div>
                        </Col>
                        <Col lg={20} md={20} sm={24} xs={24}>
                          <div
                            style={{
                              color: 'white',
                              padding: '4px',
                            }}
                          >
                            <Row justify='space-between'>
                              <Col>
                                <RangePicker size='small' />
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-day'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-day'>All Day</Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-stores'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-stores'>All Stores</Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-categories'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-categories'>
                                    All Categories
                                  </Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-items'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-items'>All Items</Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-modifiers'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-modifiers'>
                                    All Modifiers
                                  </Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-channels'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-channels'>
                                    All Channels
                                  </Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                              <Col>
                                <Select
                                  defaultValue='all-employees'
                                  style={{ width: 120 }}
                                  onChange={() => {}}
                                  size='small'
                                >
                                  <Option value='all-employees'>
                                    All Employees
                                  </Option>
                                  <Option value='today'>Today</Option>
                                </Select>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row> */}
                <Row gutter={8} style={{ margin: 10 }}>
                  <Col lg={4} md={4} sm={24} xs={24}>
                    {this.getChildMenu().length > 0 && (
                      <Card style={{ height: '100%' }} className='card-menu'>
                        <Menu
                          theme='dark'
                          mode='inline'
                          selectedKeys={[this.props.location.pathname]}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          {this.getChildMenu().map((data, i) => {
                            if (data) {
                              return (
                                <Menu.Item
                                  key={data.route}
                                  className='childMenuIcon'
                                  icon={data.icon}
                                >
                                  <Link
                                    key={i}
                                    to={data.route}
                                    style={{ color: 'black' }}
                                  >
                                    {data.header}
                                  </Link>
                                </Menu.Item>
                              );
                            }
                          })}
                        </Menu>
                      </Card>
                    )}
                  </Col>
                  <Col
                    lg={
                      this.props.location.pathname.split('/')[1] === ''
                        ? 24
                        : 20
                    }
                    md={
                      this.props.location.pathname.split('/')[1] === ''
                        ? 24
                        : 20
                    }
                    sm={24}
                    xs={24}
                  >
                    <Card>
                      <Switch>
                        {/* // this will scroll to top when switch changes. */}
                        {window.scrollTo(0, 0)}
                        {/* filtering paths for user role feature */}
                        {_.map(
                          this.state.userType === 'admin'
                            ? paths
                            : paths.filter(
                                (path) =>
                                  path.route !== '/manage/customers' &&
                                  path.route !== '/manage/riders' &&
                                  path.route !== '/manage/categories' &&
                                  path.route !== '/manage/merchants'
                              ),
                          (path) => (
                            <Route
                              exact={path.exact}
                              path={path.route}
                              component={path.component}
                              key={path.route}
                            />
                          )
                        )}
                        <Route component={NotFound} />
                        <Redirect to='/404' />
                      </Switch>
                    </Card>
                  </Col>
                </Row>

                {/* <div style={{ paddingBottom: '100vh' }} /> */}
              </Content>
            </Layout>
          </Layout>
        );
      default:
        break;
    }
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.login.loggedIn,
  };
}

export default withRouter(connect(mapStateToProps, {})(App));
