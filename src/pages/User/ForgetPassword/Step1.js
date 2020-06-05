import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, message } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ form }) => ({}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
    count: 0,
    buttonText: '获取验证码',
    operation:"retrieve"
  };

  // 邮箱验证码
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const { form, dispatch } = this.props;
      let operation=this.state.operation;
      form.validateFields(['email', 'userName'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          dispatch({
            type: 'user/queryByUserNameAndEmail',
            payload: { userName: values.userName, email: values.email },
            callback: res => {
              let { data } = res;
              if (res.code === 200) {
                console.log(res.data);
                this.setState({ user: res.data });
                dispatch({
                  type: 'user/sendMailCode',
                  payload: { ...res.data, operation: operation },
                });
              } else {
                message.error('请输入正确的用户名和绑定的邮箱');
              }
            },
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  onValidateForm = () => {
    const { form, dispatch } = this.props;
    const user=this.state.user;
    const operation=this.state.operation;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/verificationCheck',
          payload: {email:values.email,code:values.code,operation:operation},
          callback: res => {
            let { data } = res;
            if (res.code === 200) {
              this.props.history.push(
                '/user/forgetPassword/confirm',
                { user: user, code: values.code,operation:operation},
              );
            } else {
              message.error(res.message);
            }
          },
        });
      }
    });
  };

  render() {
    const { count, buttonText } = this.state;
    const { form } = this.props;
    const { getFieldDecorator, validateFields } = form;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="用户名">
            {getFieldDecorator('userName', {
              validateTrigger: 'onBlur',
              rules: [{ required: true, message: '请输入待找回用户' }],
            })(<Input size="large" placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入账户绑定的邮箱' },
                { type: 'email', message: '请输入正确的邮箱' },
              ],
            })(<Input size="large" placeholder="请输入账户绑定的邮箱" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="验证码">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入验证码' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入数字验证码',
                    },
                  ],
                })(<Input size="large" placeholder="请输入邮箱收到的验证码" />)}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  // className={styles.getCaptcha}
                  size="large"
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : buttonText}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={this.onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step1;
