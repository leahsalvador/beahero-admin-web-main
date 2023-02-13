import React, { Component } from 'react';
import { Form, Input, Button, Layout } from 'antd';
import { connect } from 'react-redux';
import { submitLogin } from '../actions';
import logo from '../../../assets/logo/logo.png';
import './index.scss';

class Login extends Component {
  handleSubmit(e) {
    this.props.onSubmitLogin(e);
  }

  render() {
    const { loggingIn, loginRejected } = this.props;
    return (
      <Layout>
        <div className='login-container'>
          <div className='logo'>
            <img src={logo} alt='logo' />
          </div>
          <div className='login-form'>
            <div className='login-header'>
              <span>Administrator Login</span>
            </div>
            {loginRejected && (
              <div className='login-error-message'>
                <span>Login Failed: Invalid Credentials</span>
              </div>
            )}
            <Form
              name='basic'
              initialValues={{ remember: true }}
              onFinish={(e) => this.handleSubmit(e)}
              // onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name='email'
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <Input placeholder='Email' />
              </Form.Item>

              <Form.Item
                name='password'
                placeholder='Password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password placeholder='Password' />
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  style={{
                    width: '100%',
                    backgroundColor: '#FD2D55',
                    outline: 0,
                    border: 'none',
                    height: 40,
                    borderRadius: 6,
                    fontSize: 10,
                  }}
                  loading={loggingIn}
                  htmlType='submit'
                >
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginRejected: state.login.loginRejected,
    loggingIn: state.login.loggingIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitLogin: (data) => dispatch(submitLogin(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
