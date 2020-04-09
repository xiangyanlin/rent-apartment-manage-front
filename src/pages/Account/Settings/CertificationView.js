import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage,FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Select, Row, Col, Popover } from 'antd';
import styles from './PasswordView.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ user, loading }) => ({
  currentUser:user.currentUser,
   submitting: loading.effects['user/updateUserForm'],
}))
@Form.create()
class CertificationView extends Component {
 

  render() {
    const { form, submitting ,currentUser} = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <div style={{marginBottom:"10px"}}>
        <span>认证状态：</span><span className={styles.name}>{currentUser.identify}</span>
        </div>
      <Form onSubmit={this.handleSubmit}>
        {/* userName */}
          <FormItem label="认证身份">
              {getFieldDecorator('role', {
                rules: [
                  {
                    required: true,
                    validator: this.checkOld,
                  },
                ],
              })(
                <Select defaultValue="lucy" style={{ width: 120 }} >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    validator: this.checkOld,
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form.realName.placeholder' })} />
              )}
            </FormItem>
            <FormItem label="身份证号">
              {getFieldDecorator('idCard', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input placeholder={formatMessage({ id: 'form.idCard.placeholder' })}
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.password.identify" />
              </Button>
            </FormItem>
      </Form>
    </div>
    );
  }
}

export default CertificationView;
