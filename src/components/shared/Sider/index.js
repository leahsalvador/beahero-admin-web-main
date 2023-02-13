import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import 'antd/dist/antd.css';
import { Menu, Layout, Modal } from 'antd';
import {
  AreaChartOutlined,
  UserOutlined,
  HomeOutlined,
  FileOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;

const SiderMenu = (props) => {
  function logout() {
    Modal.confirm({
      title: 'Do you want to logout?',
      icon: <ExclamationCircleOutlined />,
      content: 'You will redirected to login page',
      onOk() {
        localStorage.removeItem('SESSION_TOKEN');
        props.history.push('/');
        window.location.reload();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <Sider
      className='sider-container'
      trigger={null}
      collapsible
      collapsed={props.siderCollapse}
      style={{ backgroundColor: 'white' }}
    >
      <div className='logo'>
        <HomeOutlined
          style={{ fontSize: 30, color: 'white' }}
          onClick={() =>
            props.history.push({
              pathname: '/',
            })
          }
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[props.location.pathname.split('/')[1]]}
          style={{ backgroundColor: 'transparent' }}
        >
          <Menu.Item
            key='reports'
            icon={
              <AreaChartOutlined style={{ fontSize: 20, color: '#222831' }} />
            }
          >
            <Link onClick={() => props.onChangeParentMenu('Reports')}>
              <span style={{ color: 'gray' }}>Reports</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key='merchants'
            icon={<UserOutlined style={{ fontSize: 20, color: '#222831' }} />}
          >
            <Link onClick={() => props.onChangeParentMenu('Merchants')}>
              <span style={{ color: 'gray' }}>Merchants</span>
            </Link>
          </Menu.Item>
          {props.userType === 'admin' && (
            <Menu.Item
              key='manage'
              icon={<FileOutlined style={{ fontSize: 20, color: '#222831' }} />}
            >
              <Link onClick={() => props.onChangeParentMenu('manage')}>
                <span style={{ color: 'gray' }}>Manage System</span>
              </Link>
            </Menu.Item>
          )}
          {props.userType === 'merchant' && (
            <Menu.Item
              key='settings'
              icon={
                <SettingOutlined style={{ fontSize: 20, color: '#222831' }} />
              }
            >
              <Link onClick={() => props.onChangeParentMenu('settings')}>
                <span style={{ color: 'gray' }}>Settings</span>
              </Link>
            </Menu.Item>
          )}

          <Menu.Item
            icon={<LogoutOutlined style={{ fontSize: 20, color: '#222831' }} />}
          >
            <Link onClick={() => logout()}>
              <span style={{ color: 'gray' }}>Logout</span>
            </Link>
          </Menu.Item>
          {/* {
                    props.paths.map((data, index) => {
                        return (
                            <Menu.Item key={index} icon={data.icon}>
                                <Link to={data.route}>{data.slug}</Link>
                            </Menu.Item>
                        )
                    })
                } */}
        </Menu>
      </div>
    </Sider>
  );
};

export default SiderMenu;

// FA3F63
