import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider ,Row,Col,message} from 'antd';
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
  };

      // 邮箱验证码
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const { form,dispatch } = this.props;
      form.validateFields(['email',"userName"], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          dispatch({
            type: 'user/queryByUserNameAndEmail',
            payload: {userName:values.userName,email:values.email},
            callback:res=>{
              if(res.code===200){
                console.log("111")
                this.setState({user:res.data});
                dispatch({type: 'user/sendMailCode',
                payload:{operation:"password",...res.data},
              });
              }else{
                message.error("请输入正确的用户名和绑定的邮箱");
              }
            }
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  render() {
    const { count,buttonText } = this.state;
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
        <Form  layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="用户名">
            {getFieldDecorator('userName', {
               validateTrigger: 'onBlur', 
              rules: [{ required: true, message: '请输入待找回用户' }],
            })
            (<Input  size="large" placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
               validateTrigger: 'onBlur', 
              rules: [
                { required: true, message: '请输入账户绑定的邮箱' },
                { type: 'email', message: '请输入正确的邮箱' },
              ],
            })(<Input  size="large" placeholder="请输入账户绑定的邮箱" />)}
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
            })(<Input  size="large" placeholder="请输入邮箱收到的验证码" />)}
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
