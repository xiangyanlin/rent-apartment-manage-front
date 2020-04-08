import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './PasswordView.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ user, loading }) => ({
  currentUser:user.currentUser,
   submitting: loading.effects['user/updateUserForm'],
}))
@Form.create()
class PasswordView extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  checkOld = (rule, value, callback) => {
    const { form ,currentUser} = this.props;
    if (value && value !== currentUser.password) {
      callback(formatMessage({ id: 'validation.password.old' }));
    } else {
      callback();
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch,currentUser } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        //const { prefix } = this.state;
        values.id=currentUser.id;
        dispatch({
          type: 'user/updateUserForm',
          payload: {
            ...values,
          },
          callback: res => {
            if (res.code == 200) {
              window.localStorage.removeItem("currentUser");
              window.location.href="/user/login";
            }
          },
        });
      }
    });
  };

  render() {
    const { form, submitting ,currentUser} = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main}>
        <div style={{marginBottom:"10px"}}>
        <span>用户名：</span><span className={styles.name}>{currentUser.userName}</span>
        </div>
      <Form onSubmit={this.handleSubmit}>
        {/* userName */}
      <FormItem label="旧密码">
          {getFieldDecorator('old', {
            rules: [
              {
                required: true,
                validator: this.checkOld,
              },
            ],
          })(
            <Input size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'form.oldPassword.placeholder' })} />
          )}
        </FormItem>
        <FormItem  label="新密码">
          <Popover
            getPopupContainer={node => node.parentNode}
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  <FormattedMessage id="validation.password.strength.msg" />
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                   required: true,
                  validator: this.checkPassword,
                  // message: formatMessage({ id: 'validation.password.required' }),
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.password.placeholder' })}
              />
            )}
          </Popover>
        </FormItem>
        <FormItem label="确认密码">
          {getFieldDecorator('confirm', {
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
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
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
            <FormattedMessage id="app.password.update" />
          </Button>
        </FormItem>
      </Form>
    </div>
    );
  }
}

export default PasswordView;
