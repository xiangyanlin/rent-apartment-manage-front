import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Form, Button, Input, Checkbox, Alert, Icon, Row ,Col} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

    //手机号码登录
  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const { dispatch } = this.props;
  //         dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile,
  //         })
  //           .then(resolve)
  //           .catch(reject);
  //       }
  //     });
  //   });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { autoLogin } = this.state;
    if (!err) {
      const { dispatch } = this.props;
        localStorage.setItem('userName',values.userName);
      if(autoLogin){
          localStorage.setItem('password',values.password);
      }else{
          localStorage.removeItem('password');
      }
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          //type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    const strName=localStorage.getItem("userName");
    const strPass=localStorage.getItem("password")
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        > 
         {/* <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName name="userName" placeholder="admin/user" />
            <Password
              name="password"
              placeholder="888888/123456"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab> */}
          {/* <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-verification-code' }))}
            <Mobile name="mobile" />
            <Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />
          </Tab> */}
          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div> */}
        {login.status === 'error' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName 
            name="userName" 
            placeholder="请输入用户名"
            defaultValue={strName} />
          <Password
            name="password"
            placeholder="请输入密码"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            defaultValue={strPass}
          />

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div> 

          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <Row type="flex" justify="end" >
            <Link to="/User/Register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </Row>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
