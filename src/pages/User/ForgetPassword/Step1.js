import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider ,Row,Col} from 'antd';
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
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          router.push('/user/forgetPassword/confirm');
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="账户">
            {getFieldDecorator('userName', {
              // initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入待找回用户' }],
            })(<Input  size="large" placeholder="请输入收款人姓名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              // initialValue: data.receiverAccount,
              rules: [
                { required: true, message: '请输入账户绑定的邮箱' },
                { type: 'email', message: '请输入正确的邮箱' },
              ],
            })(<Input  size="large" placeholder="请输入账户绑定的邮箱" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="验证码">
            <Row gutter={8}>
              <Col span={16}>
              {getFieldDecorator('amount', {
              // initialValue: data.amount,
              rules: [
                { required: true, message: '请输入转账金额' },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入数字验证码',
                },
              ],
            })(<Input  size="large" placeholder="请输入邮箱收到的验证码" />)}
              </Col>
              <Col span={8}>
                <Button
                  // disabled={count}
                  // className={styles.getCaptcha}
                   size="large"
                  // onClick={this.onGetCaptcha}
                >
                  获取验证码
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
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step1;
